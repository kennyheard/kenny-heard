import { resolveRoute } from "@/config/links";
import type { SanityRoutedDocument } from "@/config/routes";
import { isDevelopment } from "@/lib/environment";
import { pruneSocialImages } from "@/lib/social-image-storage";
import { isDefined } from "@/lib/utils";
import { routedDocumentsQuery } from "@/sanity/groq/routes";
import { client } from "@/sanity/lib/client";
import type { Nullable } from "@/types";

// A local build reads its own dataset, so pruning from it could delete images that another environment still uses.
if (isDevelopment) {
  console.log("Skipped pruning social images locally");
} else {
  const documents = await client.fetch<Nullable<SanityRoutedDocument>[]>(
    routedDocumentsQuery,
    {},
    { perspective: "published", stega: false, useCdn: false },
  );
  const paths = documents.flatMap((document) => {
    const path = isDefined(document) ? resolveRoute(document) : undefined;

    return isDefined(path) ? [path] : [];
  });

  const prunedCount = await pruneSocialImages(paths);

  console.log(
    prunedCount > 0 ? `Pruned ${prunedCount} social image${prunedCount === 1 ? "" : "s"}` : "No social images to prune",
  );
}
