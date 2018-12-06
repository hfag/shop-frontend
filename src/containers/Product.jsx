import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import isEqual from "lodash/isEqual";
import Lightbox from "react-images";
import { Helmet } from "react-helmet";
import queryString from "query-string";

import Thumbnail from "../containers/Thumbnail";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Price from "../components/Price";
import Link from "../components/Link";
import Select from "../components/Select";
import VariationSlider from "../components/VariationSlider";
import { colors, borders } from "../utilities/style";
import { stripTags } from "../utilities";
import { fetchAllProductCategoriesIfNeeded } from "../actions/product/categories";
import { fetchProductIfNeeded } from "../actions/product";
import { addShoppingCartItem } from "../actions/shopping-cart";
import {
  getProductCategories,
  getProductBySlug,
  getProductAttributesBySlug,
  getResellerDiscountByProductId,
  getAttachments,
  getAttachmentById,
  getSales
} from "../reducers";
import Bill from "../components/Bill";
import ProductItem from "./ProductItem";
import { InputFieldWrapper } from "../components/InputFieldWrapper";
import JsonLd from "../components/JsonLd";
import { attachmentsToJsonLd, productToJsonLd } from "../utilities/json-ld";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

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

const LightboxBox = styled(Box)`
  cursor: zoom-in;
`;

/**
 * Renders the product page
 * @returns {Component} The component
 */
class Product extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      possibleAttributeValues: props.product
        ? this.getPossibleAttributeValues(props.product.variations)
        : {},
      selectedAttributes: props.product
        ? this.getDefaultAttributes(props.product.variations)
        : {},
      quantity: 1,
      fieldValues: {},
      isLightboxOpen: false,
      currentLightboxImage: 1
    };

    this.crossSelling = React.createRef();
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

  componentDidMount = () => {
    this.fetchData();
  };

  /**
   * Function called when the component is updated
   * @param {Object} prevProps The previous props
   * @param {Object} prevState The previous state
   * @param {Object} snapshot A snapshot
   * @returns {void}
   */
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (
      prevProps.match.params.productSlug !== this.props.match.params.productSlug
    ) {
      this.fetchData();
    }
  };

  fetchData = () => {
    const {
      fetchProductIfNeeded,
      fetchAllProductCategoriesIfNeeded
    } = this.props;

    Promise.all([
      fetchAllProductCategoriesIfNeeded(),
      fetchProductIfNeeded()
    ]).then(() => {
      const { variationId } = queryString.parse(location.search);

      if (variationId && this.props.product && this.props.product.variations) {
        this.setState({
          selectedAttributes: (
            this.props.product.variations.find(
              variation => variation.id == variationId
            ) || {}
          ).attributes
        });
      }
    });
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

    if (attributes[attributeKey] && attributes[attributeKey].isTaxonomy) {
      const option = attributes[attributeKey].options.find(
        option => option.slug === optionValue
      );
      return option ? option.name : optionValue;
    } else {
      return optionValue;
    }
  };

  /**
   * Called when a field changes
   * @param {string} fieldLabel The field label
   * @returns {void}
   */
  onChangeField = fieldLabel => e => {
    const fieldValues = { ...this.state.fieldValues };

    fieldValues[fieldLabel] = e.currentTarget.value;
    this.setState({ fieldValues });
  };

  render = () => {
    const {
      product = {},
      attributes = {},
      categories,
      addToShoppingCart,
      resellerDiscount,
      galleryAttachments = [],
      sales
    } = this.props;

    const {
      selectedAttributes,
      possibleAttributeValues,
      fieldValues,
      quantity,
      isLightboxOpen,
      currentLightboxImage
    } = this.state;

    const {
      id,
      slug,
      title,
      content,
      description,
      thumbnailId,
      categoryIds,
      date,
      variations = [],
      discount = {},
      fields = [],
      galleryImageIds = [],
      crossSellIds = []
    } = product;

    const selectedVariation = variations.find(variation =>
        isEqual(variation.attributes, selectedAttributes)
      ),
      { sku, price } = selectedVariation || {},
      flashSale = selectedVariation
        ? sales.find(
            sale =>
              sale.productId === id && sale.variationId === selectedVariation.id
          )
        : null;

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

    const uniqueImageIds = variations
      .map(v => v.imageId)
      .filter((v, i, a) => a.indexOf(v) === i);

    const validatedFields = fields.reduce(
      (validated, { label, type, maxLength }) => {
        if (!validated) {
          return validated;
        }

        const value = fieldValues[label] || "";
        switch (type) {
          case "text":
          case "textarea":
            return value !== "" && value.length <= maxLength;
          default:
            return false;
        }
      },
      true
    );

    return (
      <div>
        <Helmet>
          <title>{stripTags(title)} - Hauser Feuerschutz AG</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={ABSOLUTE_URL + "/produkt/" + slug} />
        </Helmet>
        <JsonLd>
          {{
            "@context": "http://schema.org/",
            ...productToJsonLd(product, attachmentsToJsonLd(galleryAttachments))
          }}
          }
        </JsonLd>
        <Card>
          <h1 dangerouslySetInnerHTML={{ __html: title }} />
          {uniqueImageIds.length <= 1 && (
            <Flex>
              <Box width={[1 / 3, 1 / 3, 1 / 4, 1 / 6]}>
                <Thumbnail id={thumbnailId} size="medium" />
              </Box>
            </Flex>
          )}

          {uniqueImageIds.length > 1 && (
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
            {fields.map(({ label, placeholder, type, maxLength }, index) => (
              <Box key={index} width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
                <h4>{label}</h4>
                {type === "text" && (
                  <InputFieldWrapper>
                    <input
                      type="text"
                      placeholder={placeholder}
                      maxLength={maxLength}
                      onChange={this.onChangeField(label)}
                      value={fieldValues[label] || ""}
                    />
                  </InputFieldWrapper>
                )}
                {type === "textarea" && (
                  <InputFieldWrapper>
                    <textarea
                      placeholder={placeholder}
                      maxLength={maxLength}
                      onChange={this.onChangeField(label)}
                      value={fieldValues[label] || ""}
                    />
                  </InputFieldWrapper>
                )}
              </Box>
            ))}
            <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
              <h4>Zurücksetzen</h4>
              <Button
                onClick={() =>
                  new Promise((resolve, reject) => {
                    this.setState(
                      {
                        selectedAttributes: this.getDefaultAttributes(
                          product.variations
                        ),
                        quantity: 1
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
            {resellerDiscount === false ? (
              discount.bulk &&
              selectedVariation &&
              !flashSale &&
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
                              <Price>{parseFloat(ppu)}</Price>
                            </td>
                          </DiscountRow>
                        )
                      )}
                    </tbody>
                  </DiscountTable>
                </Box>
              )
            ) : (
              <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
                <h4>Wiederverkäuferrabatt</h4>
                Als Wiederverkäufer erhalten Sie {resellerDiscount}% Rabatt auf
                dieses Produkt.
              </Box>
            )}
            <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
              {selectedVariation ? (
                <div>
                  <h4>Preis</h4>
                  <Bill
                    items={[
                      {
                        price: flashSale ? parseFloat(flashSale.price) : price,
                        quantity,
                        discountPrice: resellerDiscount
                          ? (resellerDiscount / 100) * price
                          : flashSale
                          ? parseFloat(flashSale.salePrice)
                          : discountRow.qty > 1
                          ? parseFloat(discountRow.ppu)
                          : undefined,
                        unit:
                          selectedAttributes["pa_unit"] &&
                          this.getOptionLabel(
                            "pa_unit",
                            selectedAttributes["pa_unit"]
                          )
                      }
                    ]}
                  />
                  <Button
                    state={
                      !selectedVariation ||
                      isNaN(quantity) ||
                      quantity <= 0 ||
                      !validatedFields
                        ? "disabled"
                        : ""
                    }
                    onClick={() =>
                      addToShoppingCart(
                        selectedVariation.id,
                        /* get labels */
                        {
                          ...Object.keys(selectedAttributes).reduce(
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
                          ...fieldValues
                        },
                        quantity
                      ).then(
                        () =>
                          this.crossSelling.current &&
                          ReactDOM.findDOMNode(
                            this.crossSelling.current
                          ).scrollIntoView()
                      )
                    }
                  >
                    Zum Warenkorb hinzufügen
                  </Button>
                </div>
              ) : (
                <div>
                  <h4>Preis</h4>
                  <p>Wählen Sie zuerst eine Variante aus!</p>
                  <Button state="disabled">Zum Warenkorb hinzufügen</Button>
                </div>
              )}
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            {content && (
              <Box width={[1, 1, 1 / 2, 2 / 3]} pr={3} mt={3}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <h2>Bildergalerie</h2>
                <Flex flexWrap="wrap">
                  <LightboxBox
                    width={[1 / 3, 1 / 3, 1 / 4, 1 / 6]}
                    px={2}
                    mb={2}
                    onClick={() =>
                      this.setState({
                        currentLightboxImage: 0,
                        isLightboxOpen: true
                      })
                    }
                  >
                    <Thumbnail id={thumbnailId} />
                  </LightboxBox>
                  {galleryImageIds.map((imageId, index) => (
                    <LightboxBox
                      key={imageId}
                      width={[1 / 3, 1 / 3, 1 / 4, 1 / 6]}
                      px={2}
                      mb={2}
                      onClick={() =>
                        this.setState({
                          currentLightboxImage: index + 1,
                          isLightboxOpen: true
                        })
                      }
                    >
                      <Thumbnail id={imageId} size="thumbnail" />
                    </LightboxBox>
                  ))}
                </Flex>
                <Lightbox
                  images={galleryAttachments
                    .filter(e => e)
                    .map(attachment => ({
                      src: attachment.url || "",
                      /*caption: attachment.caption,*/
                      srcSet: Object.values(attachment.sizes)
                        .sort((a, b) => a.width - b.width)
                        .map(size => `${size.source_url} ${size.width}w`),
                      thumbnail:
                        attachment.sizes &&
                        attachment.sizes.thumbnail &&
                        attachment.sizes.thumbnail.source_url
                    }))}
                  isOpen={isLightboxOpen}
                  currentImage={currentLightboxImage}
                  onClickPrev={() =>
                    this.setState({
                      currentLightboxImage: Math.max(
                        currentLightboxImage - 1,
                        0
                      )
                    })
                  }
                  onClickNext={() =>
                    this.setState({
                      currentLightboxImage: Math.min(
                        currentLightboxImage + 1,
                        galleryAttachments.length - 1
                      )
                    })
                  }
                  onClose={() => this.setState({ isLightboxOpen: false })}
                  imageCountSeparator={" von "}
                  leftArrowTitle={"Vorheriges Bild (linke Pfeiltaste)"}
                  rightArrowTitle={"Nächstes Bild (rechte Pfeiltaste)"}
                  closeButtonTitle={"Schliessen (Esc)"}
                  backdropClosesModal={true}
                  preventScroll={false}
                  showThumbnails={true}
                  onClickThumbnail={index =>
                    this.setState({ currentLightboxImage: index })
                  }
                  theme={{}}
                />
              </Box>
            )}
            <Box width={[1, 1, 1 / 2, 1 / 3]} pl={3} mt={3}>
              <h4>Spezifikationen</h4>
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
                            .map(({ id, name, slug }) => (
                              <Link
                                key={id}
                                styled
                                to={`/produkt-kategorie/${slug}/1`}
                              >
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
          </Flex>
        </Card>

        {crossSellIds.length > 0 && (
          <Card>
            <h2 ref={this.crossSelling} style={{ margin: 0 }}>
              Ergänzende Produkte
            </h2>
          </Card>
        )}

        <Flex flexWrap="wrap" style={{ margin: "0 -0.5rem" }}>
          {crossSellIds.map(productId => (
            <ProductItem key={productId} id={productId} />
          ))}
        </Flex>
      </div>
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
  const galleryImageIds =
    product && !product._isFetching
      ? [product.thumbnailId, ...product.galleryImageIds]
      : [];

  return {
    productSlug,
    product: product && !product._isFetching ? product : {},
    categories:
      product && !product._isFetching && product.categoryIds
        ? getProductCategories(state).filter(category =>
            product.categoryIds.includes(category.id)
          )
        : [],
    attributes: getProductAttributesBySlug(state),
    resellerDiscount: getResellerDiscountByProductId(
      state,
      product && product.id
    ),
    galleryAttachments:
      galleryImageIds.length > 0
        ? galleryImageIds.map(attachmentId =>
            getAttachmentById(state, attachmentId)
          )
        : [],
    sales: getSales(state)
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
  fetchAllProductCategoriesIfNeeded(perPage = 30, visualize = true) {
    return dispatch(fetchAllProductCategoriesIfNeeded(perPage, visualize));
  },
  /**
   * Fetches the product
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProductIfNeeded(visualize = true) {
    return dispatch(fetchProductIfNeeded(productSlug, visualize));
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
