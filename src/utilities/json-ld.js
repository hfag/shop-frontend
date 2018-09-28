import { stripTags } from ".";

const { ABSOLUTE_URL } = process.env;

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
  sku: product.sku,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "CHF",
    lowPrice:
      product && product.variations
        ? product.variations.reduce(
            (lowest, { price }) =>
              lowest < price && lowest !== 0 ? lowest : price,
            0
          )
        : product.minPrice,
    highPrice:
      product &&
      product.variations &&
      product.variations.reduce(
        (highest, { price }) =>
          highest > price && highest !== 0 ? highest : price,
        0
      ),
    offerCount: product && product.variations && product.variations.length,
    itemCondition: "NewCondition",
    availability: "InStock",
    availableAtOrFrom: "ch.feuerschutz.1",
    availableDeliveryMethod: [
      "OnSitePickup",
      "http://purl.org/goodrelations/v1#DeliveryModeMail"
    ],
    deliveryLeadTime: 1,
    potentialAction: {
      "@type": "ViewAction",
      target: "https://shop.feuerschutz.ch/produkt/" + product.slug,
      name: "Kaufe Produkt"
    },
    seller: {
      "@id": ABSOLUTE_URL + "/#organization"
    }
  }
});

/**
 * Maps an attachment to a json-ld schema
 * @param {Object} attachment The attachment to map
 * @returns {Object} The mapped schema
 */
export const attachmentToJsonLd = attachment => attachment && attachment.url;

/**
 * Maps multiple attachment to a json-ld schema
 * @param {Object} [attachments=[]] The attachments to map
 * @returns {Object} The mapped schema
 */
export const attachmentsToJsonLd = (attachments = []) =>
  attachments.length === 0
    ? attachmentToJsonLd(attachments[0])
    : attachments.map(attachmentToJsonLd);
