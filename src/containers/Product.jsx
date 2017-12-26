import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import Thumbnail from "containers/Thumbnail";
import Placeholder from "components/Placeholder";

import { colors, shadows } from "utilities/style";

import { fetchItem as fetchProduct } from "actions/product";

import { getProductCategories, getProductById } from "reducers";

const StyledProduct = styled.div`
	background-color: #fff;
	box-shadow: ${shadows.y};

	display: flex;
	flex-direction: column;
	height: 100%;

	& > div:first-child {
		/* Thumbnail */
		border-bottom: ${colors.background} 1px solid;
	}

	& > div:last-child {
		flex: 1 0 auto;
	}

	& > div {
		padding: 0.5rem;
	}
`;

const Title = styled.div`
	font-weight: 500;
`;

const Subtitle = styled.div`
	color: ${colors.fontLight};
	font-size: 0.8rem;
`;

class Product extends React.PureComponent {
	componentWillMount = () => {
		const { id, product, fetchProduct } = this.props;

		if (id > 0 && !product) {
			fetchProduct();
		}
	};

	render = () => {
		const { product, categories } = this.props;

		return (
			<StyledProduct>
				<Thumbnail id={product ? product.thumbnailId : -1} />
				<div>
					{product ? <Title>{product.title}</Title> : <Placeholder text />}
					{product ? (
						categories ? (
							categories.map(category => (
								<Subtitle key={category.id}>{category.name}</Subtitle>
							))
						) : (
							""
						)
					) : (
						<Placeholder text />
					)}
				</div>
			</StyledProduct>
		);
	};
}

Product.propTypes = {
	id: PropTypes.number.isRequired
};

const mapStateToProps = (state, { id }) => {
	const product = getProductById(state, id);

	return product
		? {
				product,
				categories: getProductCategories(state).filter(category =>
					product.categoryIds.includes(category.id)
				)
			}
		: {};
};

const mapDispatchToProps = (dispatch, { id }) => ({
	fetchProduct() {
		return dispatch(fetchProduct(id));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
