import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { Flex, Box } from "grid-styled";

import Link from "components/Link";
import Container from "components/Container";
import Category from "containers/Category";

import { fetchAll as fetchProductCategories } from "actions/product/categories";

import { getProductCategoryChildrenIds } from "reducers";

class ProductCategories extends React.PureComponent {
	componentWillMount = () => {
		const { dispatch, categoryIds, fetchProductCategories } = this.props;

		if (categoryIds.length === 0) {
			fetchProductCategories();
		}
	};
	render = () => {
		const { categoryIds } = this.props;
		return (
			<Container>
				<Flex wrap>
					{categoryIds.length
						? categoryIds.map(categoryId => (
								<Box
									key={categoryId}
									width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
									pr={2}
									pt={2}
								>
									<Link to={"/category/" + categoryId}>
										<Category id={categoryId} />
									</Link>
								</Box>
							))
						: new Array(12).fill().map((el, index) => (
								<Box
									key={index}
									width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
									pr={2}
									pt={2}
								>
									<Category id={-1} />
								</Box>
							))}
				</Flex>
			</Container>
		);
	};
}

const mapStateToProps = (state, { match: { params: { categoryId } } }) => ({
	categoryIds:
		getProductCategoryChildrenIds(
			state,
			categoryId ? parseInt(categoryId) : undefined
		) || []
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	fetchProductCategories() {
		dispatch(fetchProductCategories());
	}
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ProductCategories)
);
