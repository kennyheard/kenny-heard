import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { get, list } from "@vercel/blob";

import { isDefined } from "@/lib/utils";

/** Folder the site's font files are downloaded into, which git ignores. */
const fontsFolder = "app/fonts";

/**
 * Checks whether a font file has already been downloaded, by its size.
 *
 * @param file - Path to the file.
 * @param size - Size of the file in the Blob store, in bytes.
 * @returns Whether the file is already there.
 */
async function isDownloaded(file: string, size: number) {
  try {
    const { size: downloadedSize } = await stat(file);

    return downloadedSize === size;
  } catch {
    return false;
  }
}

if (!isDefined(process.env.BLOB_STORE_ID)) {
  throw new Error("The fonts are licensed and private, so building the site needs the Blob store's BLOB_STORE_ID.");
}

const { blobs } = await list({ prefix: "web/" });

await mkdir(fontsFolder, { recursive: true });
await Promise.all(
  blobs.map(async ({ pathname, size }) => {
    const file = path.join(fontsFolder, path.basename(pathname));
    if (await isDownloaded(file, size)) return;

    const result = await get(pathname, { access: "private" });
    if (result?.statusCode !== 200) throw new Error(`Couldn't download ${pathname} from the Blob store.`);
    await writeFile(file, Buffer.from(await new Response(result.stream).arrayBuffer()));
  }),
);
