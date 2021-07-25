import { ABSOLUTE_URL } from "../utilities/api";
import { stripTags } from "../utilities/decode";
import { useIntl } from "react-intl";
import Breadcrumb from "./Breadcrumb";
import Card from "./layout/Card";
import JsonLd from "./seo/JsonLd";
import Placeholder from "./elements/Placeholder";
import React, { FunctionComponent } from "react";
import StyledLink from "./elements/StyledLink";
import page from "../i18n/page";

/**
 * Generates the breadcrumb array for a string
 * @param {string} text The name of the breadcrumb
 * @returns {Array} The breadcrumb array
 */
const generateStringBreadcrumb =
  (text) =>
  ({ url }, location, state) =>
    [
      {
        url,
        name: text,
      },
    ];

const routes = [
  {
    path: "/de",
    breadcrumb: generateStringBreadcrumb("Startseite"),
  },
  {
    path: "/de/login",
    breadcrumb: generateStringBreadcrumb("Anmelden"),
  },
  {
    path: "/de/warenkorb",
    breadcrumb: generateStringBreadcrumb("Warenkorb"),
  },
  {
    path: "/de/konto",
    breadcrumb: generateStringBreadcrumb("Konto"),
  },
  {
    path: "/de/konto/details",
    breadcrumb: generateStringBreadcrumb("Details"),
  },
  {
    path: "/de/konto/rechnungsadresse",
    breadcrumb: generateStringBreadcrumb("Rechnungsadresse"),
  },
  {
    path: "/de/konto/lieferadresse",
    breadcrumb: generateStringBreadcrumb("Lieferadresse"),
  },
  {
    path: "/de/konto/bestellungen",
    breadcrumb: generateStringBreadcrumb("Bestellungen"),
  },
  {
    path: "/de/suche",
    breadcrumb: generateStringBreadcrumb("Suche"),
  },
  {
    path: "/de/produkt-kategorie/",
    // breadcrumb: generateCategoryBreadcrumbs,
  },
  {
    path: "/de/produkt/:productSlug",
    // breadcrumb: generateProductBreadcrumbs,
  },
  {
    path: "/de/beitrag/:postSlug",
    // breadcrumb: generatePostBreadcrumbs,
  },
  {
    path: "/de/seite/:pageSlug",
    // breadcrumb: generatePageBreadcrumbs,
  },
  {
    path: "/fr",
    breadcrumb: generateStringBreadcrumb("Page d'accueil"),
  },
  {
    path: "/fr/login",
    breadcrumb: generateStringBreadcrumb("Connexion"),
  },
  {
    path: "/fr/panier-d-achat",
    breadcrumb: generateStringBreadcrumb("Panier d'achat"),
  },
  {
    path: "/fr/compte",
    breadcrumb: generateStringBreadcrumb("Compte"),
  },
  {
    path: "/fr/compte/details",
    breadcrumb: generateStringBreadcrumb("Détails"),
  },
  {
    path: "/fr/compte/adresse-de-facturation",
    breadcrumb: generateStringBreadcrumb("Adresse de facturation"),
  },
  {
    path: "/fr/compte/adresse-de-livraison",
    breadcrumb: generateStringBreadcrumb("Adresse de livraison"),
  },
  {
    path: "/fr/compte/commandes",
    breadcrumb: generateStringBreadcrumb("Commandes"),
  },
  {
    path: "/fr/recherche",
    breadcrumb: generateStringBreadcrumb("Recherche"),
  },
  {
    path: "/fr/produit-categorie/",
    // breadcrumb: generateCategoryBreadcrumbs,
  },
  {
    path: "/fr/produit/:productSlug",
    // breadcrumb: generateProductBreadcrumbs,
  },
  {
    path: "/fr/article/:postSlug",
    // breadcrumb: generatePostBreadcrumbs,
  },
  {
    path: "/fr/page/:pageSlug",
    // breadcrumb: generatePageBreadcrumbs,
  },
];

export interface Breadcrumb {
  name?: string;
  url?: string;
}

/**
 * Renders all breadcrumbs
 */
const Breadcrumbs: FunctionComponent<{
  breadcrumbs: Breadcrumb[];
}> = ({ breadcrumbs }) => {
  const intl = useIntl();

  return (
    <Card>
      <div>
        <Breadcrumb>
          <StyledLink href={`/${intl.locale}`}>
            <span
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(page.home),
              }}
            />
          </StyledLink>
        </Breadcrumb>
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb key={index}>
              {index === breadcrumbs.length - 1 ? (
                <span dangerouslySetInnerHTML={{ __html: breadcrumb.name }} />
              ) : (
                <StyledLink href={breadcrumb.url}>
                  <span dangerouslySetInnerHTML={{ __html: breadcrumb.name }} />
                </StyledLink>
              )}
            </Breadcrumb>
          ))
        ) : (
          <Breadcrumb>
            <Placeholder text inline minWidth={5} />
          </Breadcrumb>
        )}
      </div>
      <JsonLd>
        {{
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map(({ name, url }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@id": ABSOLUTE_URL + url, name: stripTags(name) },
          })),
        }}
      </JsonLd>
    </Card>
  );
};

export default Breadcrumbs;
