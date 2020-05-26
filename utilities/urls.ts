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
    confirmation: "bestaetigung",
    tos: "agbs"
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
    confirmation: "confirmation",
    tos: "conditions-generales"
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
 */
export const getUrlPartByKeyAndLocation = (
  urlKey: string,
  location: Location,
  fallback = "de"
) => pathnamesByLanguage[getLanguageFromLocation(location, fallback)][urlKey];

/**
 * Gets the url part by a key and the current window lanuage
 */
export const getUrlPartByKeyForCurrentLanguage = (
  urlKey: string,
  fallback: string
) => pathnamesByLanguage[getLanguageFromCurrentWindow(fallback)][urlKey];
