import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import isEqual from "lodash/isEqual";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";

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
  getSales,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import Bill from "../components/Bill";
import ProductItem from "./ProductItem";
import { InputFieldWrapper } from "../components/InputFieldWrapper";
import JsonLd from "../components/JsonLd";
import { attachmentsToJsonLd, productToJsonLd } from "../utilities/json-ld";
import { pathnamesByLanguage } from "../utilities/urls";
import productMessages from "../i18n/product";
import { setProductView, trackPageView } from "../utilities/analytics";
import CrossSellFlex from "../components/Flex";
import Flexbar from "../components/Flexbar";
import LightboxGallery from "../components/LightboxGallery";
import UnsafeHTMLContent from "../components/UnsafeHTMLContent";

const messages = defineMessages({
  chooseAVariation: {
    id: "Product.chooseAVariation",
    defaultMessage: "Wähle eine Variante"
  },
  chooseAnAttribute: {
    id: "Product.chooseAnAttribute",
    defaultMessage: "Wählen Sie eine Eigenschaft"
  },
  reset: {
    id: "Product.reset",
    defaultMessage: "Zurücksetzen"
  },
  resetSelection: {
    id: "Product.resetSelection",
    defaultMessage: "Auswahl zurücksetzen"
  },
  mustSelectVariation: {
    id: "Product.mustSelectVariation",
    defaultMessage: "Wählen Sie zuerst eine Variante aus!"
  },
  contactUs: {
    id: "Product.contactUs",
    defaultMessage: "Kontaktieren Sie uns für dieses Produkt"
  },
  contactEmail: {
    id: "Product.contactEmail",
    defaultMessage: "Senden Sie uns eine E-Mail"
  },
  contactCall: {
    id: "Product.contactCall",
    defaultMessage: "Rufen Sie uns an"
  },
  imageGallery: {
    id: "Product.imageGallery",
    defaultMessage: "Bildergalerie"
  },
  specifications: {
    id: "Product.specifications",
    defaultMessage: "Spezifikationen"
  },
  additionalProducts: {
    id: "Product.additionalProducts",
    defaultMessage: "Ergänzende Produkte"
  },
  previousImage: {
    id: "Product.previousImage",
    defaultMessage: "Vorheriges Bild (linke Pfeiltaste)"
  },
  nextImage: {
    id: "Product.nextImage",
    defaultMessage: "Nächstes Bild (rechte Pfeiltaste)"
  },
  closeLightbox: {
    id: "Product.closeLightBox",
    defaultMessage: "Schliessen (Esc)"
  }
});

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const ProductCard = styled(Card)`
  margin-bottom: 0;
`;

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

      setProductView(
        this.props.product.sku,
        this.props.product.title,
        this.props.product.minPrice
      );
      trackPageView();

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
      language,
      product = {},
      attributes = {},
      categories,
      addToShoppingCart,
      resellerDiscount,
      galleryImageIds = [],
      galleryAttachments = [],
      sales,
      intl
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
      crossSellIds = [],
      type = "variable"
    } = product;

    const selectedVariation =
      variations.length === 0 ||
      variations.find(variation =>
        isEqual(variation.attributes, selectedAttributes)
      );

    let sku, price, flashSale;
    if (type === "simple") {
      sku = product.sku;
      price = product.price;

      flashSale = sales.find(sale => sale.productId === id);
    } else if (type === "variable") {
      sku = selectedVariation ? selectedVariation.sku : product.sku;
      price = selectedVariation ? selectedVariation.price : null;

      flashSale = selectedVariation
        ? sales.find(
            sale =>
              sale.productId === id && sale.variationId === selectedVariation.id
          )
        : null;
    }

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
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${language}/${pathnamesByLanguage[language].product}/${slug}`}
          />
        </Helmet>
        <JsonLd>
          {{
            "@context": "http://schema.org/",
            ...productToJsonLd(product, attachmentsToJsonLd(galleryAttachments))
          }}
          }
        </JsonLd>
        <ProductCard>
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
              <h4>{intl.formatMessage(messages.chooseAVariation)}</h4>
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
                    placeholder={intl.formatMessage(messages.chooseAnAttribute)}
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
              <h4>{intl.formatMessage(productMessages.quantity)}</h4>
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
              <h4>{intl.formatMessage(messages.reset)}</h4>
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
                {intl.formatMessage(messages.resetSelection)}
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
                  <h4>{intl.formatMessage(productMessages.bulkDiscount)}</h4>
                  <DiscountTable>
                    <thead>
                      <tr>
                        <th>
                          {intl.formatMessage(productMessages.quantity)} (
                          {intl.formatMessage(productMessages.from)})
                        </th>
                        <th>
                          {intl.formatMessage(productMessages.pricePerUnit)}
                        </th>
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
                <h4>{intl.formatMessage(productMessages.resellerDiscount)}</h4>
                <FormattedMessage
                  id="Product.resellerDiscountMessage"
                  defaultMessage="Als Wiederverkäufer erhalten Sie {resellerDiscount}% Rabatt auf dieses Produkt."
                  values={{
                    resellerDiscount
                  }}
                />
              </Box>
            )}
            <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
              {price && selectedVariation ? (
                <div>
                  <h4>{intl.formatMessage(productMessages.price)}</h4>
                  <Bill
                    items={[
                      {
                        price: flashSale ? parseFloat(flashSale.price) : price,
                        quantity,
                        discountPrice: resellerDiscount
                          ? (1.0 - resellerDiscount / 100) * price
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
                    {intl.formatMessage(productMessages.addToCart)}
                  </Button>
                </div>
              ) : price == null ? (
                <div>
                  <h4>{intl.formatMessage(productMessages.price)}</h4>
                  <p>{intl.formatMessage(messages.mustSelectVariation)}</p>
                  <Button state="disabled">
                    {intl.formatMessage(productMessages.addToCart)}
                  </Button>
                </div>
              ) : (
                <div>
                  <p>{intl.formatMessage(messages.contactUs)}</p>
                  <Flex flexWrap="wrap">
                    <div style={{ marginRight: 16, marginBottom: 16 }}>
                      <Button
                        onClick={() => {
                          window.location = "mailto:info@feuerschutz.ch";
                          return Promise.resolve();
                        }}
                      >
                        {intl.formatMessage(messages.contactEmail)}
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        window.location = "tel:+41628340540";
                        return Promise.resolve();
                      }}
                    >
                      {intl.formatMessage(messages.contactCall)}
                    </Button>
                  </Flex>
                </div>
              )}
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            {content && (
              <Box width={[1, 1, 1 / 2, 2 / 3]} pr={3} mt={3}>
                <UnsafeHTMLContent content={content} />
                <h2>{intl.formatMessage(messages.imageGallery)}</h2>
                <LightboxGallery galleryImageIds={galleryImageIds} />
              </Box>
            )}
            <Box width={[1, 1, 1 / 2, 1 / 3]} pl={3} mt={3}>
              <h4>{intl.formatMessage(messages.specifications)}</h4>
              <StyledTable>
                <tbody>
                  <tr>
                    <td>{intl.formatMessage(productMessages.sku)}</td>
                    <td>{sku}</td>
                  </tr>
                  <tr>
                    <td>{intl.formatMessage(productMessages.categories)}</td>
                    <td>
                      {categories.length > 0
                        ? categories
                            .map(({ id, name, slug }) => (
                              <Link
                                key={id}
                                styled
                                to={`/${language}/${pathnamesByLanguage[language].productCategory}/${slug}/1`}
                              >
                                {name}
                              </Link>
                            ))
                            .reduce((prev, curr) => [prev, ", ", curr])
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td>{intl.formatMessage(productMessages.product)}</td>
                    <td dangerouslySetInnerHTML={{ __html: title }}></td>
                  </tr>
                  {Object.keys(selectedAttributes).map(attributeKey => (
                    <tr key={attributeKey}>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: this.getAttributeLabel(attributeKey)
                        }}
                      ></td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: selectedAttributes[attributeKey]
                            ? this.getOptionLabel(
                                attributeKey,
                                selectedAttributes[attributeKey]
                              )
                            : "-"
                        }}
                      ></td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </Box>
          </Flex>
        </ProductCard>

        {crossSellIds.length > 0 && (
          <Card style={{ marginBottom: 0 }}>
            <h2 ref={this.crossSelling} style={{ margin: 0 }}>
              {intl.formatMessage(messages.additionalProducts)}
            </h2>
          </Card>
        )}

        <CrossSellFlex flexWrap="wrap" style={{ paddingBottom: 16 }}>
          {crossSellIds.map(productId => (
            <ProductItem key={productId} id={productId} />
          ))}
        </CrossSellFlex>
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
      ? [product.thumbnailId, ...(product.galleryImageIds || [])]
      : [];

  return {
    language: getLanguage(state),
    languageFetchString: getLanguageFetchString(state),
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
    galleryImageIds,
    galleryAttachments: galleryImageIds.map(attachmentId =>
      getAttachmentById(state, attachmentId)
    ),
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
   * @param {string} language The language string
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAllProductCategoriesIfNeeded(perPage = 30, language, visualize = true) {
    return dispatch(
      fetchAllProductCategoriesIfNeeded(perPage, language, visualize)
    );
  },
  /**
   * Fetches the product
   * @param {string} language The language string
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProductIfNeeded(language, visualize = true) {
    return dispatch(fetchProductIfNeeded(productSlug, language, visualize));
  },
  /**
   * Updates the shopping cart
   * @param {number|string} productId The product id
   * @param {number|string} [variationId] The variation id
   * @param {Object} [variation] The variation attributes
   * @param {number} [quantity=1] The quantity
   * @param {string} sku The sku
   * @param {string} productName The product name
   * @param {number} minPrice The minimum price
   * @param {string} language The language string
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {function} The redux thunk
   */
  addToShoppingCart(
    productId,
    variationId,
    variation,
    quantity = 1,
    sku,
    productName,
    minPrice,
    language,
    visualize = true
  ) {
    return dispatch(
      addShoppingCartItem(
        productId,
        variationId,
        variation,
        quantity,
        { sku, productName, minPrice },
        language,
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
   * Fetches all product categories
   * @param {number} perPage How many items per page
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAllProductCategoriesIfNeeded(perPage = 30, visualize = true) {
    return mapDispatchToProps.fetchAllProductCategoriesIfNeeded(
      perPage,
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Fetches the product
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProductIfNeeded(visualize = true) {
    return mapDispatchToProps.fetchProductIfNeeded(
      mapStateToProps.languageFetchString,
      visualize
    );
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
    const { id: productId, sku, title, minPrice } =
      mapStateToProps.product || {};

    return mapStateToProps.product
      ? mapDispatchToProps.addToShoppingCart(
          productId,
          variationId,
          variation,
          quantity,
          sku,
          title,
          minPrice,
          mapStateToProps.languageFetchString,
          visualize
        )
      : Promise.resolve();
  }
});

const TranslatedProduct = injectIntl(Product);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TranslatedProduct);
