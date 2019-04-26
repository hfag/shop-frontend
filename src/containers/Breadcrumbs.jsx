import React, { Props } from "react";
import Link from "components/Link";
import Card from "components/Card";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";
import { connect } from "react-redux";
import { matchPath, withRouter } from "react-router";

import Placeholder from "../components/Placeholder";
import { generateProductBreadcrumbs } from "./breadcrumbs/ProductBreadcrumb";
import { generateCategoryBreadcrumbs } from "./breadcrumbs/CategoryBreadcrumb";
import JsonLd from "../components/JsonLd";
import { stripTags } from "../utilities";
import { generatePostBreadcrumbs } from "./breadcrumbs/PostBreadcrumb";
import { generatePageBreadcrumbs } from "./breadcrumbs/PageBreadcrumb";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * Generates the breadcrumb array for a string
 * @param {string} text The name of the breadcrumb
 * @returns {Array} The breadcrumb array
 */
const generateStringBreadcrumb = text => ({ url }, location, state) => [
  {
    url,
    name: text
  }
];

const routes = [
  {
    path: "/de",
    breadcrumb: generateStringBreadcrumb("Startseite")
  },
  {
    path: "/de/login",
    breadcrumb: generateStringBreadcrumb("Anmelden")
  },
  {
    path: "/de/warenkorb",
    breadcrumb: generateStringBreadcrumb("Warenkorb")
  },
  {
    path: "/de/konto",
    breadcrumb: generateStringBreadcrumb("Konto")
  },
  {
    path: "/de/konto/details",
    breadcrumb: generateStringBreadcrumb("Details")
  },
  {
    path: "/de/konto/rechnungsadresse",
    breadcrumb: generateStringBreadcrumb("Rechnungsadresse")
  },
  {
    path: "/de/konto/lieferadresse",
    breadcrumb: generateStringBreadcrumb("Lieferadresse")
  },
  {
    path: "/de/konto/bestellungen",
    breadcrumb: generateStringBreadcrumb("Bestellungen")
  },
  {
    path: "/de/suche",
    breadcrumb: generateStringBreadcrumb("Suche")
  },
  {
    path: "/de/produkt-kategorie/",
    breadcrumb: generateCategoryBreadcrumbs
  },
  {
    path: "/de/produkt/:productSlug",
    breadcrumb: generateProductBreadcrumbs
  },
  {
    path: "/de/beitrag/:postSlug",
    breadcrumb: generatePostBreadcrumbs
  },
  {
    path: "/de/seite/:pageSlug",
    breadcrumb: generatePageBreadcrumbs
  },
  {
    path: "/fr",
    breadcrumb: generateStringBreadcrumb("Page d'accueil")
  },
  {
    path: "/fr/login",
    breadcrumb: generateStringBreadcrumb("Connexion")
  },
  {
    path: "/fr/panier-d-achat",
    breadcrumb: generateStringBreadcrumb("Panier d'achat")
  },
  {
    path: "/fr/compte",
    breadcrumb: generateStringBreadcrumb("Compte")
  },
  {
    path: "/fr/compte/details",
    breadcrumb: generateStringBreadcrumb("Détails")
  },
  {
    path: "/fr/compte/adresse-de-facturation",
    breadcrumb: generateStringBreadcrumb("Adresse de facturation")
  },
  {
    path: "/fr/compte/adresse-de-livraison",
    breadcrumb: generateStringBreadcrumb("Adresse de livraison")
  },
  {
    path: "/fr/compte/commandes",
    breadcrumb: generateStringBreadcrumb("Commandes")
  },
  {
    path: "/fr/recherche",
    breadcrumb: generateStringBreadcrumb("Recherche")
  },
  {
    path: "/fr/produit-categorie/",
    breadcrumb: generateCategoryBreadcrumbs
  },
  {
    path: "/fr/produit/:productSlug",
    breadcrumb: generateProductBreadcrumbs
  },
  {
    path: "/fr/article/:postSlug",
    breadcrumb: generatePostBreadcrumbs
  },
  {
    path: "/fr/page/:pageSlug",
    breadcrumb: generatePageBreadcrumbs
  }
];

/**
 * Renders a list of fake components
 * @param {Object} props The component properties
 * @returns {Component} The component
 */
const BreadcrumbWrapper = ({ breadcrumb: { url, name } }) => (
  <Breadcrumb>
    {url && name ? (
      <Link to={url}>
        <span dangerouslySetInnerHTML={{ __html: name }} />
      </Link>
    ) : (
      <Placeholder text inline minWidth={5} />
    )}
  </Breadcrumb>
);

/**
 * Renders all breadcrumbs
 * @param {Object} props The breadcrumb props
 * @returns {Component} The breadcrumbs
 */
const Breadcrumbs = ({ location, state }) => {
  const breadcrumbs = [].concat.apply(
    [],
    routes
      .map(route => ({ ...route, match: matchPath(location.pathname, route) }))
      .filter(route => route.match)
      .map(({ breadcrumb, match }) => breadcrumb(match, location, state))
  );

  return (
    <Card>
      {breadcrumbs.length > 0 ? (
        <div>
          <div>
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbWrapper key={index} breadcrumb={breadcrumb} />
            ))}
          </div>
          <JsonLd>
            {{
              "@context": "http://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbs.map(({ name, url }, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: stripTags(name),
                item: ABSOLUTE_URL + url
              }))
            }}
          </JsonLd>
        </div>
      ) : (
        <Breadcrumb>
          <Placeholder text inline minWidth={5} />
        </Breadcrumb>
      )}
    </Card>
  );
};

const mapStateToProps = state => ({
  state
});

const ConnectedBreadcrumbs = connect(mapStateToProps)(Breadcrumbs);
export default withRouter(ConnectedBreadcrumbs);
