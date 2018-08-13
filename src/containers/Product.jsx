import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import isEqual from "lodash/isEqual";

import Thumbnail from "../containers/Thumbnail";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Price from "../components/Price";
import Link from "../components/Link";
import Select from "../components/Select";
import VariationSlider from "../components/VariationSlider";
import { colors, borders } from "../utilities/style";
import { fetchProductCategories } from "../actions/product/categories";
import { fetchProduct } from "../actions/product";
import { addShoppingCartItem } from "../actions/shopping-cart";
import {
  getProductCategories,
  getProductBySlug,
  getProductAttributesBySlug,
  getResellerDiscountByProductId
} from "../reducers";
import Bill from "../components/Bill";

const StyledTable = styled.table`
  word-wrap: break-word;
`;

const Counter = styled.input`
  width: 100%;
  background-color: transparent;
  border: ${colors.secondary} 1px solid;
  padding: 0.25rem 0.5rem;
  border-radius: ${borders.inputRadius};
`;

const DiscountTable = styled(Table)`
  tr {
    cursor: pointer;
  }
`;

const DiscountRow = styled.tr`
  background-color: ${({ selected }) =>
    selected ? colors.primary : "transparent"};

  color: ${({ selected }) => (selected ? "#fff" : "inherit")};
`;

/**
 * Renders the product page
 * @returns {Component} The component
 */
class Product extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.product) {
      this.state = {
        possibleAttributeValues: this.getPossibleAttributeValues(
          props.product.variations
        ),
        selectedAttributes: this.getDefaultAttributes(props.product.variations),
        quantity: 1
      };
    } else {
      this.state = {
        possibleAttributeValues: {},
        selectedAttributes: {},
        quantity: 1
      };
    }
  }

  /**
   * Returns an object mapping the attribute keys to all possible values
   * @param {Array<Object>} variations All variations
   * @returns {Object} The attribute key -> values map
   */
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
        }, {});

        return object;
      }, {});

  /**
   * Returns the default attributes for a given set of variations
   * @param {Array<Object>} variations All possible variations
   * @returns {Component} The component
   */
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

  /**
   * Called when the component receives new props
   * @param {Object} newProps The new props
   * @returns {void}
   */
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

  /**
   * Generates the onDropdownChange function based on the attribute key
   * @param {string} attributeKey What attribute selection has changed
   * @returns {function} The onChange callback
   */
  onChangeDropdown = attributeKey => selectedItem =>
    this.setState({
      selectedAttributes: {
        ...this.state.selectedAttributes,
        [attributeKey]: selectedItem ? selectedItem.value : null
      }
    });
  /**
   * Called when the slider selection changes
   * @param {number|string} imageId The image's id
   * @param {Array<Object>} attributes All attributes related to this image
   * @returns {void}
   */
  onVariationSliderSelect = (imageId, attributes) =>
    this.setState({ selectedAttributes: attributes });
  /**
   * Gets the label based on the attribute key
   * @param {string} attributeKey The attribute key
   * @returns {string} The label
   */
  getAttributeLabel = attributeKey =>
    this.props.attributes && this.props.attributes[attributeKey]
      ? this.props.attributes[attributeKey].name
      : attributeKey;

  /**
   * Gets the option label for an attribute key
   * @param {string} attributeKey The attribute key
   * @param {any} optionValue The option value
   * @returns {string} The label
   */
  getOptionLabel = (attributeKey, optionValue) => {
    const { attributes = {} } = this.props;

    return attributes[attributeKey] && attributes[attributeKey].isTaxonomy
      ? attributes[attributeKey].options.find(
          option => option.slug === optionValue
        ).name
      : optionValue;
  };

  render = () => {
    const {
      product = {},
      attributes = {},
      categories,
      addToShoppingCart
    } = this.props;
    const {
      selectedAttributes,
      possibleAttributeValues,
      quantity
    } = this.state;

    const {
      id,
      title,
      content,
      excerpt,
      thumbnailId,
      categoryIds,
      date,
      variations = [],
      discount = {}
    } = product;

    const selectedVariation = variations.find(variation =>
        isEqual(variation.attributes, selectedAttributes)
      ),
      { sku, price } = selectedVariation || {};

    const discountRow = (discount.bulk &&
      selectedVariation &&
      discount.bulk[selectedVariation.id] &&
      discount.bulk[selectedVariation.id].reduce(
        (highestQuantity, nextDiscount) =>
          nextDiscount.qty >= highestQuantity.qty &&
          nextDiscount.qty <= quantity
            ? nextDiscount
            : highestQuantity,
        { qty: 1, ppu: price }
      )) || { qty: 1, ppu: price };

    //based on all the possible values and the constraints given by variations calculated the actual possible attributes values
    const possibleAttributes = this.getPossibleAttributeValues(
      variations.filter(({ attributes }) => {
        for (let key in selectedAttributes) {
          if (
            !Object.prototype.hasOwnProperty.call(selectedAttributes, key) ||
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
      <Card>
        <h1>{title}</h1>
        <Flex>
          <Box width={[1 / 3, 1 / 3, 1 / 4, 1 / 6]}>
            <Thumbnail id={thumbnailId} />
          </Box>
        </Flex>
        <div dangerouslySetInnerHTML={{ __html: content }} />

        {variations.length > 1 && (
          <div>
            <hr />
            <h4>Wähle eine Variante</h4>
            <VariationSlider
              variations={variations}
              selectedAttributes={selectedAttributes}
              onSelect={this.onVariationSliderSelect}
            />
          </div>
        )}
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
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
            <h4>Anzahl</h4>
            <Counter
              type="number"
              value={quantity}
              onChange={e =>
                this.setState({
                  quantity: Math.max(parseInt(e.currentTarget.value), 1)
                })
              }
            />
          </Box>
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
            <h4>Zurücksetzen</h4>
            <Button
              onClick={() =>
                new Promise((resolve, reject) => {
                  this.setState(
                    {
                      selectedAttributes: this.getDefaultAttributes(
                        product.variations
                      )
                    },
                    resolve
                  );
                })
              }
            >
              Auswahl zurücksetzen
            </Button>
          </Box>
        </Flex>
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
            <h4>Zusammenfassung</h4>
            <StyledTable>
              <tbody>
                <tr>
                  <td>Artikelnummer</td>
                  <td>{sku}</td>
                </tr>
                <tr>
                  <td>Kategorien</td>
                  <td>
                    {categories.length > 0
                      ? categories
                          .map(({ id, name }) => (
                            <Link key={id} styled to={`category/${id}`}>
                              {name}
                            </Link>
                          ))
                          .reduce((prev, curr) => [prev, ", ", curr])
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>Produkt</td>
                  <td>{title}</td>
                </tr>
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
            </StyledTable>
          </Box>
          {discount.bulk &&
            selectedVariation &&
            discount.bulk[selectedVariation.id] &&
            discount.bulk[selectedVariation.id].length > 0 && (
              <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
                <h4>Mengenrabatt</h4>
                <DiscountTable>
                  <thead>
                    <tr>
                      <th>Anzahl (ab)</th>
                      <th>Stückpreis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discount.bulk[selectedVariation.id].map(
                      ({ qty, ppu }, index) => (
                        <DiscountRow
                          onClick={() => this.setState({ quantity: qty })}
                          selected={qty === discountRow.qty}
                          key={index}
                        >
                          <td>{qty}</td>
                          <td>
                            <Price>{ppu}</Price>
                          </td>
                        </DiscountRow>
                      )
                    )}
                  </tbody>
                </DiscountTable>
              </Box>
            )}
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
            {selectedVariation ? (
              <div>
                <h4>Preis</h4>
                <Bill
                  items={[
                    {
                      price,
                      quantity,
                      discountPrice:
                        discountRow.qty > 1 ? discountRow.ppu : undefined
                    }
                  ]}
                />
                <Button
                  disabled={
                    !selectedVariation || isNaN(quantity) || quantity <= 0
                  }
                  onClick={() =>
                    addToShoppingCart(
                      selectedVariation.id,
                      /* get labels */
                      Object.keys(selectedAttributes).reduce(
                        (object, attributeKey) => {
                          object[
                            this.getAttributeLabel(attributeKey)
                          ] = this.getOptionLabel(
                            attributeKey,
                            selectedAttributes[attributeKey]
                          );
                          return object;
                        },
                        {}
                      ),
                      quantity
                    )
                  }
                >
                  Zum Warenkorb hinzufügen
                </Button>
              </div>
            ) : null /*"Wähle zuerst eine Variante aus"*/}
          </Box>
        </Flex>
      </Card>
    );
  };
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { productSlug }
    }
  }
) => {
  const product = getProductBySlug(state, productSlug);
  return {
    productSlug,
    product: product && !product._isFetching ? product : {},
    categories:
      product && !product._isFetching
        ? getProductCategories(state).filter(category =>
            product.categoryIds.includes(category.id)
          )
        : [],
    attributes: getProductAttributesBySlug(state),
    resellerDiscount: getResellerDiscountByProductId(
      state,
      (product && product.id) || 0
    )
  };
};

const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { productSlug }
    }
  }
) => ({
  /**
   * Fetches all product categories
   * @param {number} perPage How many items per page
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAllProductCategories(perPage = 30, visualize = true) {
    return dispatch(fetchProductCategories(perPage, visualize));
  },
  /**
   * Fetches the product
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProduct(visualize = true) {
    return dispatch(fetchProduct(productSlug, visualize));
  },
  /**
   * Fetches the product attributes
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAttributes(visualize = true) {
    return dispatch(fetchProductAttributes(visualize, productId));
  },
  /**
   * Fetches the product variations
   * @param {number|string} productId The productId
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchVariations(productId, visualize = true) {
    return dispatch(fetchVariations(visualize, productId));
  },
  /**
   * Updates the shopping cart
   * @param {number|string} productId The product id
   * @param {number|string} [variationId] The variation id
   * @param {Object} [variation] The variation attributes
   * @param {number} [quantity=1] The quantity
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {function} The redux thunk
   */
  addToShoppingCart(
    productId,
    variationId,
    variation,
    quantity = 1,
    visualize = true
  ) {
    return dispatch(
      addShoppingCartItem(
        productId,
        variationId,
        variation,
        quantity,
        visualize
      )
    );
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the product variations
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchVariations(visualize = true) {
    return mapStateToProps.product
      ? mapDispatchToProps.fetchVariations(
          mapStateToProps.product.id,
          visualize
        )
      : Promise.resolve();
  },
  /**
   * Updates the shopping cart
   * @param {number|string} [variationId] The variation id
   * @param {Object} [variation] The variation attributes
   * @param {number} [quantity=1] The quantity
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {function} The redux thunk
   */
  addToShoppingCart(variationId, variation, quantity = 1, visualize = true) {
    return mapStateToProps.product
      ? mapDispatchToProps.addToShoppingCart(
          mapStateToProps.product.id,
          variationId,
          variation,
          quantity,
          visualize
        )
      : Promise.resolve();
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Product);
