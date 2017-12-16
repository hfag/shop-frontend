import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import Thumbnail from "containers/Thumbnail";
import Placeholder from "components/Placeholder";

import { colors, shadows } from "utilities/style";

import { fetch as fetchProductCategory } from "actions/product/categories";
import { getProductCategoryById } from "reducers";

const StyledCategory = styled.div`
	background-color: #fff;
	box-shadow: ${shadows.y};

	& > div:first-child {
		/* Thumbnail */
		border-bottom: ${colors.background} 1px solid;
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

class Category extends React.PureComponent {
	componentWillMount = () => {
		const { id, category, fetchProductCategory } = this.props;

		if (id > 0 && !category) {
			fetchProductCategory();
		}
	};

	render = () => {
		const { category, parent } = this.props;

		return (
			<StyledCategory>
				<Thumbnail id={category ? category.thumbnailId : -1} />
				<div>
					{category ? <Title>{category.name}</Title> : <Placeholder text />}
					{category ? (
						parent ? (
							<Subtitle>{parent.name}</Subtitle>
						) : (
							""
						)
					) : (
						<Placeholder text />
					)}
				</div>
			</StyledCategory>
		);
	};
}

Category.propTypes = {
	categories: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = (state, { id }) => {
	const category = getProductCategoryById(state, id);

	return category
		? {
				category,
				parent: category.parent
					? getProductCategoryById(state, category.parent)
					: undefined
			}
		: {};
};

const mapDispatchToProps = (dispatch, { id }) => ({
	fetchProductCategory() {
		return dispatch(fetchProductCategory(id));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
