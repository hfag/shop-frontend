import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import Thumbnail from "containers/Thumbnail";

import Card from "components/Card";
import Container from "components/Container";
import Placeholder from "components/Placeholder";
import Link from "components/Link";

import { colors, shadows } from "utilities/style";

import { fetchProductCategories } from "actions/product/categories";
import { fetchProduct, fetchVariations } from "actions/product";

import { getProductCategories, getProductById } from "reducers";

class Product extends React.PureComponent {
	componentWillMount = () => {
		const {
			productId,
			product,
			fetchProduct,
			fetchVariations,
			fetchAllProductCategories
		} = this.props;

		if (productId > 0 && !product) {
			fetchAllProductCategories();
			fetchProduct();
		}

		fetchVariations();
	};

	render = () => {
		const { product = {} } = this.props;

		const {
			id,
			title,
			content,
			excerpt,
			thumbnailId,
			categoryIds,
			date,
			variations = []
		} = product;

		return (
			<Container>
				<Card>
					<h1>{title}</h1>
					<Flex>
						<Box width={[1 / 3, 1 / 3, 1 / 4, 1 / 6]}>
							<Thumbnail id={thumbnailId} />
						</Box>
					</Flex>
					<div dangerouslySetInnerHTML={{ __html: content }} />
					{variations.length > 0 && (
						<Flex>
							{[...new Set(variations.map(({ imageId }) => imageId))].map(
								imageId => (
									<Box key={imageId} width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}>
										<Thumbnail id={imageId} />
									</Box>
								)
							)}
						</Flex>
					)}
				</Card>
			</Container>
		);
	};
}

const mapStateToProps = (state, { match: { params: { productId } } }) => {
	const product = getProductById(state, parseInt(productId));
	return product && !product._isFetching
		? {
				productId: parseInt(productId),
				product,
				categories: getProductCategories(state).filter(category =>
					product.categoryIds.includes(category.id)
				)
		  }
		: { productId: parseInt(productId) };
};

const mapDispatchToProps = (
	dispatch,
	{ match: { params: { productId } } }
) => ({
	fetchAllProductCategories(perPage = 30, visualize = true) {
		return dispatch(fetchProductCategories(perPage, visualize));
	},
	fetchProduct(visualize = true) {
		return dispatch(fetchProduct(productId, visualize));
	},
	fetchVariations(visualize = true) {
		return dispatch(fetchVariations(visualize, productId));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
