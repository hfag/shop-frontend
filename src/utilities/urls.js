import { getLanguageFromCurrentWindow, getLanguageFromLocation } from "./i18n";

export const pathnamesByLanguage = {
  de: {
    productCategory: "produkt-kategorie",
    search: "suche",
    product: "produkt",
    post: "beitrag",
    page: "seite",
    login: "login",
    logout: "logout",
    account: "konto",
    orders: "bestellungen",
    details: "details",
    billingAddress: "rechnungsadresse",
    shippingAddress: "lieferadresse",
    cart: "warenkorb",
    confirmation: "bestaetigung"
  },
  fr: {
    productCategory: "produit-categorie",
    search: "recherche",
    product: "produit",
    post: "article",
    page: "page",
    login: "login",
    logout: "logout",
    account: "compte",
    orders: "commandes",
    details: "details",
    billingAddress: "adresse-de-facturation",
    shippingAddress: "adresse-de-livraison",
    cart: "panier-d-achat",
    confirmation: "confirmation"
  }
};

export const pageSlugsByLanguage = {
  de: {
    companyAbout: "unser-unternehmen",
    downloads: "downloads"
  },
  fr: {
    companyAbout: "notre-entreprise",
    downloads: "telechargements"
  }
};

/**
 * Gets the url part by a key and the given location language
 * @param {string} urlKey The url key to retrieve
 * @param {string} location The current location
 * @param {string} fallback The fallback language key
 * @returns {string} The url part
 */
export const getUrlPartByKeyAndLocation = (urlKey, location, fallback = "de") =>
  pathnamesByLanguage[getLanguageFromLocation(location, fallback)][urlKey];

/**
 * Gets the url part by a key and the current window lanuage
 * @param {string} urlKey The url key to retrieve
 * @param {string} fallback The fallback language key
 * @returns {string} The url part
 */
export const getUrlPartByKeyForCurrentLanguage = (urlKey, fallback) =>
  pathnamesByLanguage[getLanguageFromCurrentWindow(fallback)][urlKey];
