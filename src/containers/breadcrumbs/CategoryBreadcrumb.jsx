import React from "react";
import { connect } from "react-redux";
import Link from "components/Link";
import Placeholder from "components/Placeholder";
import Keyer from "containers/breadcrumbs/Keyer";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";
import { getProductCategoryById } from "reducers";

/**
 * Renders the category breadcrumb
 * @returns {Component} The component
 */
class CategoryBreadcrumb extends React.PureComponent {
	render = () => {
		const {
			id,
			category: { name },
			parents,
			match
		} = this.props;

		return name ? 
			[
				...parents.map(cat => 
					<Keyer key={cat.id}>
						<Breadcrumb>
							<Link to={"/category/" + cat.id + "/1"}>{cat.name}</Link>
						</Breadcrumb>
					</Keyer>
				),
				<Keyer key={id}>
					<Breadcrumb>
						<Link to={"/category/" + id + "/1"}>{name}</Link>
					</Breadcrumb>
				</Keyer>
			]
		 : 
			<Placeholder text inline minWidth={5} />
		;
	};
}

const mapStateToProps = (
	state,
	{
		match: {
			params: { categoryId }
		}
	}
) => {
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
};

export default connect(mapStateToProps)(CategoryBreadcrumb);
