import React from "react";
import { connect } from "react-redux";

import Link from "components/Link";
import Placeholder from "components/Placeholder";

import Keyer from "containers/breadcrumbs/Keyer";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";

import { getProductCategoryById, getProductById } from "reducers";

class ProductBreadcrumb extends React.PureComponent {
	render = () => {
		const { id, product: { title }, parents, match } = this.props;

		return title ? (
			[
				...parents.reverse().map(cat => (
					<Keyer key={cat.id}>
						<Breadcrumb>
							<Link to={"/category/" + cat.id + "/1"}>{cat.name}</Link>
						</Breadcrumb>
					</Keyer>
				)),
				<Keyer key={id}>
					<Breadcrumb>
						<Link to={"/product/" + id}>{title}</Link>
					</Breadcrumb>
				</Keyer>
			]
		) : (
			<Placeholder text inline minWidth={5} />
		);
	};
}

const mapStateToProps = (state, { match: { params: { productId } } }) => {
	const product = getProductById(state, productId) || {};

	const category =
		getProductCategoryById(
			state,
			product.categoryIds ? product.categoryIds[0] : -1
		) || {};
	const parents = [getProductCategoryById(state, product.categoryIds[0])];

	let current = category;

	while (current.parent) {
		parents.push(getProductCategoryById(state, current.parent));
		current = parents[parents.length - 1];
	}

	return {
		id: productId,
		product,
		parents
	};
};

export default connect(mapStateToProps)(ProductBreadcrumb);
