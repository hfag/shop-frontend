import React from "react";
import { withBreadcrumbs } from "react-router-breadcrumbs-hoc";

import Link from "components/Link";
import Container from "components/Container";
import Card from "components/Card";

import CategoryBreadcrumb from "containers/breadcrumbs/CategoryBreadcrumb";
import ProductBreadcrumb from "containers/breadcrumbs/ProductBreadcrumb";
import Keyer from "containers/breadcrumbs/Keyer";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";

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
		path: "login",
		breadcrumb: generateStringBreadcrumb("Anmelden")
	},
	{ path: "/category/:categoryId/:page", breadcrumb: CategoryBreadcrumb },
	{ path: "/product/:productId", breadcrumb: ProductBreadcrumb }
];

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
