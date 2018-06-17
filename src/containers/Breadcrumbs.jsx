import React, { Props } from "react";
import { withBreadcrumbs } from "react-router-breadcrumbs-hoc";
import Link from "components/Link";
import Container from "components/Container";
import Card from "components/Card";
import CategoryBreadcrumb from "containers/breadcrumbs/CategoryBreadcrumb";
import ProductBreadcrumb from "containers/breadcrumbs/ProductBreadcrumb";
import Keyer from "containers/breadcrumbs/Keyer";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";

/**
 * Generates a component from a string
 * @param {string} text The link text
 * @returns {Component} The component
 */
const generateStringBreadcrumb = text => ({ match: { url } }) => (
  <Breadcrumb>
    <Link to={url}>{text}</Link>
  </Breadcrumb>
);

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
    path: "/produkte/",
    breadcrumb: CategoryBreadcrumb
  },
  { path: "/produkt/:productSlug", breadcrumb: ProductBreadcrumb }
];

/**
 * Renders all breadcrumbs
 * @param {Object} props The breadcrumb props
 * @returns {Component} The breadcrumbs
 */
const Breadcrumbs = ({ breadcrumbs }) => (
  <Container>
    <Card>
      {breadcrumbs.map(({ breadcrumb, path, match }, index) => (
        <Keyer key={index}>{breadcrumb}</Keyer>
      ))}
    </Card>
  </Container>
);

export default withBreadcrumbs(routes)(Breadcrumbs);
