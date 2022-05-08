import { ABSOLUTE_URL, PUBLIC_PATH } from "./api";
import {
  AggregateOffer,
  Product as JsonLdProduct,
  LocalBusiness,
} from "schema-dts";
import { Product } from "../schema";
import { stripTags } from "./decode";

/**
 * Maps a product to a json-ld schema
 * @param {Object} product The product to map
 * @param {Array|string} [imageSchema] The image schema
 * @returns {Object} The json-ld schema
 */
export const productToJsonLd = (product: Product): JsonLdProduct => {
  const offer: AggregateOffer = {
    "@type": "AggregateOffer",
    priceCurrency: "CHF",
    lowPrice:
      product.variants.reduce(
        (lowest, variant) =>
          lowest < variant.price && lowest !== 0 ? lowest : variant.price,
        product.variants[0].price
      ) / 100,
    highPrice:
      product.variants.reduce(
        (highest, variant) =>
          highest > variant.price && highest !== 0 ? highest : variant.price,
        product.variants[0].price
      ) / 100,
    offerCount: product.variants.length,
    itemCondition: "NewCondition",
    availability: "InStock",
    availableAtOrFrom: "ch.feuerschutz.1",
    availableDeliveryMethod: [
      "OnSitePickup",
      {
        "@type": "DeliveryMethod",
        identifier: "http://purl.org/goodrelations/v1#DeliveryModeMail",
      },
    ],
    potentialAction: {
      "@type": "ViewAction",
      target: "https://shop.feuerschutz.ch/produkt/" + product.slug,
      name: "Kaufe Produkt",
    },
    seller: {
      "@id": ABSOLUTE_URL + "/#organization",
    },
  };

  const schema: JsonLdProduct = {
    "@type": "Product",
    name: stripTags(product.name),
    image: product?.featuredAsset?.source,
    description: stripTags(product.description),
    sku: product.customFields.groupKey || product.variants[0]?.sku,
    offers: offer,
  };

  return schema;
};

export const BUSINESS_JSON_LD: LocalBusiness = {
  "@context": "http://schema.org",
  //@ts-ignore
  "@type": "LocalBusiness ",
  image: [
    ABSOLUTE_URL + PUBLIC_PATH + "images/logo/logo-1x1.png",
    ABSOLUTE_URL + PUBLIC_PATH + "images/logo/logo-4x3.png",
    ABSOLUTE_URL + PUBLIC_PATH + "images/logo/logo-16x9.png",
  ],
  logo: ABSOLUTE_URL + PUBLIC_PATH + "v/logo/logo.png",
  "@id": ABSOLUTE_URL + "/#organization",
  branchCode: "ch.feuerschutz.1",
  name: "Hauser Feuerschutz AG",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sonnmattweg 6",
    addressLocality: "Aarau",
    addressRegion: "AG",
    postalCode: "5000",
    addressCountry: "CH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.3971281,
    longitude: 8.0434878,
  },
  url: ABSOLUTE_URL,
  telephone: "+41628340540",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+41628340540",
      contactType: "customer service",
      availableLanguage: ["German", "French", "Italian", "English"],
      contactOption: "TollFree",
      areaServed: ["CH"],
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "12:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "13:30",
      closes: "17:00",
    },
  ],
};
