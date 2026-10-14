import { del, get, list, put } from "@vercel/blob";

import { isProduction } from "@/lib/environment";
import { isDefined } from "@/lib/utils";

/** Folder in the Blob store holding every environment's social images. */
const socialImagesFolder = "social-images";

/** Environments that keep social images of their own, so staging never replaces production's. */
const socialImageEnvironments = new Set(["production", "staging"]);

/**
 * Names a page's folder in the Blob store, from its path.
 *
 * @param path - Path of the page.
 * @returns The page's folder, without the environment.
 */
function findPageFolder(path: string) {
  return path.replaceAll(/^\/|\/$/gu, "") || "home";
}

/**
 * Finds the folder in the Blob store holding a page's social images in this environment.
 *
 * @param path - Path of the page the images are for.
 * @returns The folder's path.
 */
export function findSocialImageFolder(path: string) {
  return `${socialImagesFolder}/${isProduction ? "production" : "staging"}/${findPageFolder(path)}`;
}

/**
 * Finds a social image stored in the Blob store by an earlier build or request.
 *
 * @param pathname - Where the image is stored.
 * @returns The image's bytes, or undefined when it isn't stored or the store can't be reached.
 */
export async function findStoredImage(pathname: string) {
  try {
    const result = await get(pathname, { access: "private" });
    if (result?.statusCode !== 200) return undefined;

    return new Uint8Array(await new Response(result.stream).arrayBuffer());
  } catch (error) {
    console.error(`Couldn't read the stored social image ${pathname}.`, error);

    return undefined;
  }
}

/**
 * Stores a page's social image in the Blob store, then deletes the page's older images.
 *
 * @param folder - Folder holding the page's images.
 * @param pathname - Where to store the image, inside the folder.
 * @param jpeg - The image's bytes.
 */
export async function storeImage(folder: string, pathname: string, jpeg: Buffer) {
  try {
    await put(pathname, jpeg, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/jpeg",
    });
    const { blobs } = await list({ prefix: `${folder}/` });
    const olderImages = blobs.map((blob) => blob.pathname).filter((storedPathname) => storedPathname !== pathname);
    if (isDefined(olderImages)) await del(olderImages);
  } catch (error) {
    console.error(`Couldn't store the social image ${pathname}.`, error);
  }
}

/**
 * Lists every social image in the Blob store, in every environment.
 *
 * @param cursor - Where the previous page of results ended, or undefined for the first page.
 * @returns The stored images' pathnames.
 */
async function listSocialImages(cursor?: string): Promise<string[]> {
  const { blobs, cursor: nextCursor, hasMore } = await list({ prefix: `${socialImagesFolder}/`, cursor });
  const pathnames = blobs.map((blob) => blob.pathname);

  return hasMore ? [...pathnames, ...(await listSocialImages(nextCursor))] : pathnames;
}

/**
 * Deletes every stored social image that doesn't belong to one of the site's current pages, in every environment.
 *
 * @param paths - Paths of every page that has a social image.
 */
export async function sweepSocialImages(paths: string[]) {
  const pageFolders = new Set(paths.map((path) => findPageFolder(path)));
  const storedImages = await listSocialImages();
  const deadImages = storedImages.filter((pathname) => {
    const [, environment = "", ...pageFolder] = pathname.split("/").slice(0, -1);

    return !socialImageEnvironments.has(environment) || !pageFolders.has(pageFolder.join("/"));
  });

  if (isDefined(deadImages)) await del(deadImages);
}
