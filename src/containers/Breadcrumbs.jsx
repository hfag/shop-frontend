import React from "react";
import { connect } from "react-redux";
import { withBreadcrumbs } from "react-router-breadcrumbs-hoc";
import styled from "styled-components";

import Link from "components/Link";
import Placeholder from "components/Placeholder";
import Container from "components/Container";

import { colors, shadows } from "utilities/style";

import { getProductCategoryById } from "reducers";

const Keyer = ({ children }) => children;

const Breadcrumb = styled.div`
	margin: 1rem 0;
	padding: 1rem;
	background-color: ${colors.backgroundOverlay};
	box-shadow: ${shadows.y};
`;

const BreadcrumbItem = styled.div`
	position: relative;
	display: inline-block;
	margin: 0 1rem 0 0;

	& > div {
		color: ${colors.fontLight};
	}

	&:after {
		position: absolute;
		top: 0;
		right: -0.6rem;

		content: "/";
		display: inline-block;
		color: ${colors.primary};
	}

	&:last-child {
		font-weight: bold;

		& > div {
			color: ${colors.primary};
		}

		:after {
			content: "";
		}
	}
`;

const CategoryBreadcrumb = connect(
	(state, { match: { params: { categoryId } } }) => {
		const category = getProductCategoryById(state, categoryId) || {};
		const parents = [];

		let current = category;

		while (current.parent) {
			parents.push(getProductCategoryById(state, current.parent));
			current = parents[parents.length - 1];
		}

		return {
			id: categoryId,
			category,
			parents
		};
	}
)(
	({ id, category: { name }, parents, match }) =>
		name ? (
			[
				...parents.map(cat => (
					<Keyer key={cat.id}>
						<BreadcrumbItem>
							<Link to={"/category/" + cat.id + "/1"}>{cat.name}</Link>
						</BreadcrumbItem>
					</Keyer>
				)),
				<Keyer key={id}>
					<BreadcrumbItem>
						<Link to={"/category/" + id + "/1"}>{name}</Link>
					</BreadcrumbItem>
				</Keyer>
			]
		) : (
			<Placeholder text />
		)
);

const generateStringBreadcrumb = text => ({ match: { url } }) => (
	<BreadcrumbItem>
		<Link to={url}>{text}</Link>
	</BreadcrumbItem>
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
	{ path: "/category/:categoryId/:page", breadcrumb: CategoryBreadcrumb }
];

const Breadcrumbs = ({ breadcrumbs }) => (
	<Container>
		<Breadcrumb>
			{breadcrumbs.map(({ breadcrumb, path, match }, index) => (
				<Keyer key={index}>{breadcrumb}</Keyer>
			))}
		</Breadcrumb>
	</Container>
);

export default withBreadcrumbs(routes)(Breadcrumbs);
