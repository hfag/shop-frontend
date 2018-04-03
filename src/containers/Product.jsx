import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import isEqual from "lodash/isEqual";

import Thumbnail from "containers/Thumbnail";

import Card from "components/Card";
import Container from "components/Container";
import Placeholder from "components/Placeholder";
import Link from "components/Link";
import Select from "components/Select";
import VariationSlider from "components/VariationSlider";

import { colors, shadows } from "utilities/style";

import { fetchProductCategories } from "actions/product/categories";
import { fetchProduct } from "actions/product";

import {
	getProductCategories,
	getProductById,
	getProductAttributesBySlug
} from "reducers";

class Product extends React.PureComponent {
	constructor(props) {
		super(props);

		if (props.product) {
			this.state = {
				possibleAttributeValues: this.getPossibleAttributeValues(
					props.product.variations
				),
				selectedAttributes: this.getDefaultAttributes(props.product.variations)
			};
		} else {
			this.state = {
				possibleAttributeValues: {},
				selectedAttributes: {}
			};
		}
	}

	getPossibleAttributeValues = (variations = []) =>
		variations
			.map(({ attributes }) => attributes)
			.reduce((object, attributes) => {
				Object.keys(attributes).forEach(attributeKey => {
					if (attributeKey in object) {
						if (object[attributeKey].includes(attributes[attributeKey])) {
							return;
						}

						object[attributeKey].push(attributes[attributeKey]);
					} else {
						object[attributeKey] = [attributes[attributeKey]];
					}
				});

				return object;
			}, {});

	getDefaultAttributes = (variations = []) => {
		const possibleValues = this.getPossibleAttributeValues(variations);

		return Object.keys(possibleValues).reduce((object, attributeKey) => {
			object[attributeKey] =
				possibleValues[attributeKey].length === 1
					? possibleValues[attributeKey][0]
					: null;
			return object;
		}, {});
	};

	componentWillReceiveProps = newProps => {
		if (
			newProps.product &&
			(!this.props.product ||
				!isEqual(newProps.product.variations, this.props.product.variations))
		) {
			this.setState({
				possibleAttributeValues: this.getPossibleAttributeValues(
					newProps.product.variations
				),
				selectedAttributes: this.getDefaultAttributes(
					newProps.product.variations
				)
			});
		}
	};

	componentWillMount = () => {
		const { categories, fetchProduct, fetchAllProductCategories } = this.props;

		if (categories.length === 0) {
			fetchAllProductCategories();
		}

		fetchProduct();
	};

	onChangeDropdown = attributeKey => selectedItem => {
		this.setState({
			selectedAttributes: {
				...this.state.selectedAttributes,
				[attributeKey]: selectedItem ? selectedItem.value : null
			}
		});
	};

	onVariationSliderSelect = (imageId, attributes) => {
		this.setState({ selectedAttributes: attributes });
	};

	getAttributeLabel = attributeKey =>
		this.props.attributes && this.props.attributes[attributeKey]
			? this.props.attributes[attributeKey].name
			: attributeKey;

	getOptionLabel = (attributeKey, optionValue) => {
		const { attributes = {} } = this.props;

		return attributes[attributeKey] && attributes[attributeKey].isTaxonomy
			? attributes[attributeKey].options.find(
					option => option.slug === optionValue
			  ).name
			: optionValue;
	};

	render = () => {
		const { product = {}, attributes = {} } = this.props;
		const { selectedAttributes, possibleAttributeValues } = this.state;

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

		const selectedVariation =
			variations.find(variation =>
				isEqual(variation.attributes, selectedAttributes)
			) || {};

		//based on all the possible values and the constraints given by variations calculated the actual possible attributes values
		const possibleAttributes = this.getPossibleAttributeValues(
			variations.filter(({ attributes }) => {
				for (let key in selectedAttributes) {
					if (
						!selectedAttributes.hasOwnProperty(key) ||
						selectedAttributes[key] === null
					) {
						continue;
					}

					if (
						key in attributes &&
						attributes[key] !== selectedAttributes[key]
					) {
						return false;
					}
				}

				return true;
			})
		);

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
					<hr />
					<VariationSlider
						variations={variations}
						selectedAttributes={selectedAttributes}
						onSelect={this.onVariationSliderSelect}
					/>
					<Flex flexWrap="wrap">
						{Object.keys(possibleAttributes)
							.filter(
								attributeKey => possibleAttributeValues[attributeKey].length > 1
							)
							.map(attributeKey => (
								<Box key={attributeKey} width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
									<h4>{this.getAttributeLabel(attributeKey)}</h4>
									<Select
										placeholder="Wählen Sie eine Eigenschaft"
										onChange={this.onChangeDropdown(attributeKey)}
										value={selectedAttributes[attributeKey]}
										options={possibleAttributes[attributeKey].map(value => ({
											label: this.getOptionLabel(attributeKey, value),
											value
										}))}
									/>
								</Box>
							))}
					</Flex>
					<table>
						<tbody>
							{Object.keys(selectedAttributes).map(attributeKey => (
								<tr key={attributeKey}>
									<td>{this.getAttributeLabel(attributeKey)}</td>
									<td>
										{selectedAttributes[attributeKey]
											? this.getOptionLabel(
													attributeKey,
													selectedAttributes[attributeKey]
											  )
											: "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
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
				),
				attributes: getProductAttributesBySlug(state)
		  }
		: {
				productId: parseInt(productId),
				categories: getProductCategories(state)
		  };
};

const mapDispatchToProps = (
	dispatch,
	{ match: { params: { productId } } }
) => ({
	fetchAllProductCategories(perPage = 30, visualize = true) {
		return dispatch(fetchProductCategories(perPage, visualize));
	},
	fetchProduct(visualize = true) {
		return dispatch(fetchProduct(parseInt(productId), visualize));
	},
	fetchAttributes(visualize = true) {
		return dispatch(fetchProductAttributes(visualize, productId));
	},
	fetchVariations(visualize = true) {
		return dispatch(fetchVariations(visualize, productId));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
