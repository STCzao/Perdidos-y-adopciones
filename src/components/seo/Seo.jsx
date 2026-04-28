import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  buildCanonicalUrl,
} from "./seoUtils";

const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const ensureLinkTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertJsonLdScripts = (structuredData = []) => {
  document.head
    .querySelectorAll("script[data-seo-jsonld='true']")
    .forEach((node) => node.remove());

  structuredData.forEach((entry, index) => {
    if (!entry) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonld = "true";
    script.dataset.seoJsonldIndex = String(index);
    script.text = JSON.stringify(entry);
    document.head.appendChild(script);
  });
};

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  structuredData = [],
  index = true,
}) => {
  useEffect(() => {
    const canonical = buildCanonicalUrl(path);
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const ogImage =
      image ||
      import.meta.env.VITE_MEDIA_IMG_URL ||
      import.meta.env.VITE_NAVBAR_LOGO_URL ||
      "";

    document.documentElement.lang = "es";
    document.title = fullTitle;

    ensureMetaTag("meta[name='description']", {
      name: "description",
      content: description,
    });
    ensureMetaTag("meta[property='og:title']", {
      property: "og:title",
      content: fullTitle,
    });
    ensureMetaTag("meta[property='og:description']", {
      property: "og:description",
      content: description,
    });
    ensureMetaTag("meta[property='og:type']", {
      property: "og:type",
      content: type,
    });
    ensureMetaTag("meta[property='og:url']", {
      property: "og:url",
      content: canonical,
    });
    ensureMetaTag("meta[property='og:site_name']", {
      property: "og:site_name",
      content: SITE_NAME,
    });
    ensureMetaTag("meta[name='twitter:card']", {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMetaTag("meta[name='twitter:title']", {
      name: "twitter:title",
      content: fullTitle,
    });
    ensureMetaTag("meta[name='twitter:description']", {
      name: "twitter:description",
      content: description,
    });

    if (ogImage) {
      ensureMetaTag("meta[property='og:image']", {
        property: "og:image",
        content: ogImage,
      });
      ensureMetaTag("meta[name='twitter:image']", {
        name: "twitter:image",
        content: ogImage,
      });
    }

    ensureLinkTag("link[rel='canonical']", {
      rel: "canonical",
      href: canonical,
    });

    ensureMetaTag("meta[name='robots']", {
      name: "robots",
      content: index ? "index, follow" : "noindex, nofollow",
    });

    upsertJsonLdScripts(structuredData);

    return () => {
      document.head
        .querySelectorAll("script[data-seo-jsonld='true']")
        .forEach((node) => node.remove());
    };
  }, [description, image, index, path, structuredData, title, type]);

  return null;
};

export default Seo;
