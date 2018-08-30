import { stripTags } from ".";

/**
 * Maps a product to a json-ld schema
 * @param {Object} product The product to map
 * @param {Array|string} [imageSchema=""] The image schema
 * @returns {Object} The json-ld schema
 */
export const productToJsonLd = (product, imageSchema = "") => ({
  "@type": "Product",
  name: stripTags(product.title),
  image: imageSchema,
  description: product.description,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "CHF",
    lowPrice: product.variations.reduce(
      (lowest, { price }) => (lowest < price && lowest !== 0 ? lowest : price),
      0
    ),
    highPrice: product.variations.reduce(
      (highest, { price }) =>
        highest > price && highest !== 0 ? highest : price,
      0
    ),
    offerCount: product.variations.length,
    availability: "InStock",
    seller: {
      "@type": "Organization",
      name: "Hauser Feuerschutz AG"
    }
  }
});

/**
 * Maps an attachment to a json-ld schema
 * @param {Object} attachment The attachment to map
 * @returns {Object} The mapped schema
 */
export const attachmentToJsonLd = attachment =>
  attachment &&
  attachment.sizes &&
  attachment.sizes.shop_single &&
  attachment.sizes.shop_single.source_url;

/**
 * Maps multiple attachment to a json-ld schema
 * @param {Object} [attachments=[]] The attachments to map
 * @returns {Object} The mapped schema
 */
export const attachmentsToJsonLd = (attachments = []) =>
  attachments.length === 0
    ? attachmentToJsonLd(attachments[0])
    : attachments.map(attachmentToJsonLd);
