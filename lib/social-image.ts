import { createHash } from "node:crypto";

import type { SanityIconName } from "@driftime/sanity-plugin-icon";
import { Icon, getIcon } from "@driftime/sanity-plugin-icon/render";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { del, get, list, put } from "@vercel/blob";
import { ImageResponse } from "next/og";
import { createElement } from "react";
import sharp from "sharp";

import { iconFieldNames, socialImageIconStyle } from "@/config/icons";
import { resolveRoute } from "@/config/links";
import type { SanityRoute } from "@/config/routes";
import { socialImageIconSize, socialImageScene, socialImageVersion } from "@/config/social-image";
import { isDefined } from "@/lib/utils";
import { drawWallSign } from "@/lib/wall-sign";
import type { Nullable } from "@/types";

/**
 * Finds the filled version of an icon chosen in the icon field.
 *
 * @param icon - Icon chosen in the icon field.
 * @returns The filled icon, or undefined when there's no icon or no filled version of it.
 */
export async function findFilledIcon(icon: Nullable<SanityIcon>) {
  const name = iconFieldNames.find((iconName) => iconName === icon?.name);
  if (!isDefined(name)) return undefined;

  const filledIcon = await getIcon({ library: "central", style: socialImageIconStyle, name });

  return filledIcon;
}

/**
 * Draws an icon's silhouette, white on black, centred on the wall.
 *
 * @param icon - The icon to draw, or undefined when there's none.
 * @returns The icon's coverage at each pixel of the wall, from 0 to 1, or undefined when it draws nothing.
 */
async function drawIconMask(icon: Nullable<SanityIcon>) {
  if (!isDefined(icon)) return undefined;

  const { width, height } = socialImageScene;
  const silhouette = new ImageResponse(
    createElement(
      "div",
      {
        style: {
          display: "flex",
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
        },
      },
      createElement(Icon, { value: icon, width: socialImageIconSize, height: socialImageIconSize }),
    ),
    { width, height },
  );
  const coverage = await sharp(Buffer.from(await silhouette.arrayBuffer()))
    .extractChannel(0)
    .raw()
    .toBuffer();

  if (!coverage.some((value) => value > 0)) return undefined;

  return Float32Array.from(coverage, (value) => value / 255);
}

/**
 * Turns text into a repeatable number.
 *
 * @param text - The text to turn into a number.
 * @returns A whole number from 0 up to 2³², the same every time for the same text.
 */
function hashText(text: string) {
  let hash = 0;

  for (const character of text) hash = (hash * 1_000_003 + (character.codePointAt(0) ?? 0)) % 4_294_967_296;

  return hash;
}

/**
 * Finds a social image stored in the Blob store by an earlier build or request.
 *
 * @param pathname - Where the image is stored.
 * @returns The image's bytes, or undefined when it isn't stored or the store can't be reached.
 */
async function findStoredImage(pathname: string) {
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
async function storeImage(folder: string, pathname: string, jpeg: Buffer) {
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
 * Draws a social image as a JPEG, or fetches it from the Blob store when the same image has been drawn before, so
 * each image is only drawn again when its icon, page, or drawing changes.
 *
 * @param path - Path of the page the image is for, which gives its wall and dust a pattern of their own.
 * @param icon - Icon chosen in Sanity, or undefined when there's none.
 * @param fallbackIconName - Name of the Central icon drawn, filled, when there's no icon or it draws nothing.
 * @returns The image's bytes.
 * @throws When neither the icon nor the fallback draws anything, so an image never goes out without a sign.
 */
async function drawSocialImage(path: string, icon: Nullable<SanityIcon>, fallbackIconName: SanityIconName<"central">) {
  "use cache";

  const { width, height, wall, dust } = socialImageScene;
  const mask =
    (await drawIconMask(icon)) ??
    (await drawIconMask(await getIcon({ library: "central", style: socialImageIconStyle, name: fallbackIconName })));
  if (!isDefined(mask)) throw new Error(`The social image's fallback icon, ${fallbackIconName}, draws nothing.`);

  const page = path.replaceAll(/^\/|\/$/gu, "") || "home";
  const folder = `social-images/${process.env.VERCEL_ENV ?? "development"}/${page}`;
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ socialImageVersion, socialImageScene, socialImageIconSize }))
    .update(new Uint8Array(mask.buffer))
    .digest("hex")
    .slice(0, 16);
  const pathname = `${folder}/${fingerprint}.jpg`;
  const storedImage = await findStoredImage(pathname);
  if (isDefined(storedImage)) return storedImage;

  const seed = hashText(path);
  const pixels = drawWallSign(mask, {
    ...socialImageScene,
    wall: { ...wall, seed: wall.seed + seed },
    dust: { ...dust, seed: dust.seed + seed },
  });
  const jpeg = await sharp(pixels, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  await storeImage(folder, pathname, jpeg);

  return new Uint8Array(jpeg);
}

/**
 * Draws a social image: the page's icon as a matte metal sign on a wall, lit by morning sun through shutters.
 *
 * @param route - Route of the page the image is for, which gives its wall and dust a pattern of their own.
 * @param icon - Icon chosen in Sanity, or undefined when there's none.
 * @param fallbackIconName - Name of the Central icon drawn, filled, when there's no icon or it draws nothing.
 * @returns A response with the image as a JPEG.
 * @throws When neither the icon nor the fallback draws anything, so an image never goes out without a sign.
 */
export async function createSocialImage(
  route: SanityRoute,
  icon: Nullable<SanityIcon>,
  fallbackIconName: SanityIconName<"central">,
) {
  const jpeg = await drawSocialImage(resolveRoute(route) ?? "", icon, fallbackIconName);

  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}
