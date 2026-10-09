import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { get, list } from "@vercel/blob";

import { isDefined } from "@/lib/utils";

/** Folder the site's font files are downloaded into, which git ignores. */
const fontsFolder = "app/fonts";

if (!isDefined(process.env.BLOB_STORE_ID)) {
  throw new Error("The fonts are licensed and private, so building the site needs the Blob store's BLOB_STORE_ID.");
}

const { blobs } = await list();

await mkdir(fontsFolder, { recursive: true });
await Promise.all(
  blobs.map(async ({ pathname }) => {
    const result = await get(pathname, { access: "private" });
    if (result?.statusCode !== 200) throw new Error(`Couldn't download ${pathname} from the Blob store.`);
    await writeFile(
      path.join(fontsFolder, path.basename(pathname)),
      Buffer.from(await new Response(result.stream).arrayBuffer()),
    );
  }),
);
