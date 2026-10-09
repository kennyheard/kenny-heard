import type { Metadata } from "next";

import { resolveRoute } from "@/config/links";
import { isIndexedRoute } from "@/config/routes";
import type { SanityRoutedDocument } from "@/config/routes";
import { baseUrl, isProduction } from "@/lib/environment";
import { buildImageUrl } from "@/lib/images";
import { isDefined } from "@/lib/utils";
import type { SanitySeoSettings } from "@/sanity/schemas/documents/globals/settings";
import type { SanitySeoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanityAnyImage } from "@/sanity/types";
import type { Nullable } from "@/types";

/** Site values that pages fall back to. */
export interface SiteIdentity {
  /** Site name, used as the title of pages without one and as the Open Graph site name. */
  name: string;
  /** Text added after every page title. */
  suffix: string;
  /** Character between a page title and the suffix, with a space either side. */
  separator: string;
  /** Description for pages without one. */
  description: string;
  /** Social sharing image URL for pages without one. */
  image: string;
}

/**
 * Next.js metadata shared by every page. The base URL comes from the environment, and `robots` only takes
 * the object form so it can merge with the environment's and each page's directives.
 */
export type SiteMetadata = Omit<Metadata, "metadataBase" | "robots"> & {
  robots?: Extract<Metadata["robots"], object>;
};

/** Site values and shared metadata. */
export interface MetadataConfig {
  /** Values that pages fall back to. */
  site: SiteIdentity;
  /** Metadata shared by every page. */
  metadata?: SiteMetadata;
}

/** Metadata for a single page, overriding the site's. */
interface DocumentMetadata {
  /** Page title. */
  title?: Nullable<string>;
  /** Text added after the title, replacing the site's. */
  suffix?: Nullable<string>;
  /** Page description. */
  description?: Nullable<string>;
  /** Social sharing image. */
  image?: Nullable<SanityAnyImage>;
  /** Canonical path. */
  canonical?: Nullable<string>;
  /** Crawling directives, overriding the site's and the environment's. */
  robots?: Extract<Metadata["robots"], object>;
}

/** Routed document with its SEO fields. */
type SanityMetadataDocument = SanityRoutedDocument &
  SanitySeoFields & {
    /** Title, used when there is no SEO title. */
    title?: string;
    /** Description, used when there is no SEO description. */
    description?: string;
    /** Opening line, used when there is no SEO description or description. */
    introduction?: string;
    /** Image, used when there is no SEO image. */
    image?: SanityAnyImage;
  };

/**
 * Creates metadata helpers bound to the site's values.
 *
 * @returns The site values and resolvers for page metadata.
 */
export function defineMetadataConfig({ site, metadata = {} }: MetadataConfig) {
  /** Metadata every page starts from, with indexing allowed only in production. */
  const siteMetadata: SiteMetadata = {
    ...metadata,
    // Placed after the spread on purpose, so a site can't remove the Cairn credit.
    generator: "Cairn (https://cairn.driftime.com)",
    robots: { ...metadata.robots, index: isProduction, follow: isProduction },
    openGraph: { siteName: site.name, ...metadata.openGraph },
    twitter: { card: "summary_large_image", ...metadata.twitter },
  };

  /**
   * Resolves metadata for a page, falling back to the site's values.
   *
   * @param documentMetadata - The page's own values.
   * @returns The page metadata.
   */
  function resolveMetadata(documentMetadata: DocumentMetadata = {}): Metadata {
    const { title, suffix, description, image, canonical, robots } = documentMetadata;

    const resolvedTitle = `${title ?? site.name} ${site.separator} ${suffix ?? site.suffix}`;
    const resolvedDescription = description ?? site.description;
    const resolvedImage = isDefined(image?.asset)
      ? buildImageUrl(image, { width: 1200, height: 630, fit: "crop" })
      : site.image;

    return {
      ...siteMetadata,
      metadataBase: new URL(baseUrl),
      title: resolvedTitle,
      description: resolvedDescription,
      robots: { ...siteMetadata.robots, ...robots },
      alternates: { ...siteMetadata.alternates, ...(isDefined(canonical) && { canonical }) },
      openGraph: {
        ...siteMetadata.openGraph,
        title: resolvedTitle,
        description: resolvedDescription,
        images: resolvedImage,
      },
    };
  }

  /**
   * Resolves metadata for a page from the document it renders, preferring its SEO fields, then its
   * content, then the site-wide settings. Without a document, the page is marked not found and noindex.
   *
   * @param document - The document the page renders.
   * @param settings - The site-wide SEO settings.
   * @returns The page metadata.
   */
  function resolveSanityMetadata(document: Nullable<SanityMetadataDocument>, settings: Nullable<SanitySeoSettings>) {
    if (!isDefined(document?._id)) {
      return resolveMetadata({
        title: "Page not found",
        suffix: settings?.seoSuffix,
        description: settings?.seoDescription,
        image: settings?.seoImage,
        robots: { index: false, follow: false },
      });
    }

    const { _type, seoTitle, seoDescription, seoImage, title, description, introduction, image } = document;

    return resolveMetadata({
      title: seoTitle ?? title ?? settings?.seoTitle,
      suffix: settings?.seoSuffix,
      description: seoDescription ?? description ?? introduction ?? settings?.seoDescription,
      image: seoImage ?? image ?? settings?.seoImage,
      canonical: resolveRoute(document),
      robots: isIndexedRoute(_type) ? undefined : { index: false },
    });
  }

  return { site, resolveMetadata, resolveSanityMetadata };
}
