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
    path: "/",
    breadcrumb: generateStringBreadcrumb("Startseite")
  },
  {
    path: "/login",
    breadcrumb: generateStringBreadcrumb("Anmelden")
  },
  {
    path: "/warenkorb",
    breadcrumb: generateStringBreadcrumb("Warenkorb")
  },
  {
    path: "/kasse",
    breadcrumb: generateStringBreadcrumb("Kasse")
  },
  {
    path: "/konto",
    breadcrumb: generateStringBreadcrumb("Konto")
  },
  {
    path: "/konto/details",
    breadcrumb: generateStringBreadcrumb("Details")
  },
  {
    path: "/konto/rechnungsadresse",
    breadcrumb: generateStringBreadcrumb("Rechnungsadresse")
  },
  {
    path: "/konto/lieferadresse",
    breadcrumb: generateStringBreadcrumb("Lieferadresse")
  },
  {
    path: "/konto/bestellungen",
    breadcrumb: generateStringBreadcrumb("Bestellungen")
  },
  {
    path: "/suche",
    breadcrumb: generateStringBreadcrumb("Suche")
  },
  {
    path: "/produkte/",
    breadcrumb: generateCategoryBreadcrumbs
  },
  {
    path: "/produkt/:productSlug",
    breadcrumb: generateProductBreadcrumbs
  },
  {
    path: "/beitrag/:postSlug",
    breadcrumb: generatePostBreadcrumbs
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

const ConnectedRouter = connect(mapStateToProps)(Breadcrumbs);
export default withRouter(ConnectedRouter);
