import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import isEqual from "lodash/isEqual";
import queryString from "query-string";
import {
  defineMessages,
  injectIntl,
  FormattedMessage,
  useIntl,
} from "react-intl";

import Card from "../layout/Card";
import Table from "../Table";
import Button from "../Button";
import Price from "../Price";
import Select from "../Select";
import VariationSlider from "../VariationSlider";
import { colors, borders } from "../../utilities/style";
import { stripTags } from "../../utilities/decode";
import Bill from "../Bill";
import ProductItem from "../ProductItem";
import { InputFieldWrapper } from "../InputFieldWrapper";
import JsonLd from "../seo/JsonLd";
import { productToJsonLd } from "../../utilities/json-ld";
import { pathnamesByLanguage } from "../../utilities/urls";
import productMessages from "../../i18n/product";
import { setProductView, trackPageView } from "../../utilities/analytics";
import CrossSellFlex from "../Flex";
import LightboxGallery from "../content/LightboxGallery";
import UnsafeHTMLContent from "../content/UnsafeHTMLContent";
import messages from "./messages";
import {
  Product as ProductType,
  ProductOptionGroup,
  ProductOption,
  ProductVariant,
  BulkDiscount,
  RecommendationType,
} from "../../schema";
import useSWR from "swr";
import request from "../../utilities/request";
import { GET_PRODUCT_BY_SLUG } from "../../gql/product";
import { API_URL, ABSOLUTE_URL } from "../../utilities/api";
import Head from "next/head";
import { AppContext } from "../../pages/_app";
import StyledLink from "../StyledLink";

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

const DiscountRow = styled.tr<{ selected?: boolean }>`
  background-color: ${({ selected }) =>
    selected ? colors.primary : "transparent"};

  color: ${({ selected }) => (selected ? "#fff" : "inherit")};
`;

const Product: FunctionComponent<{
  initialData?: { productBySlug: ProductType };
  productSlug: string;
}> = React.memo(({ initialData, productSlug }) => {
  const intl = useIntl();
  const { setActiveOrderId } = useContext(AppContext);

  const { data, error } = useSWR(
    [GET_PRODUCT_BY_SLUG, productSlug],
    (query, id) => request(API_URL, query, { id }),
    {
      initialData,
    }
  );

  if (!data) {
    return <>Loading</>;
  }

  const product: ProductType = data.productBySlug;

  const [selectedOptions, setSelectedOptions] = useState<{
    [optionGroupId: string]: ProductOption;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const crosssellRef = useRef(null);

  const possibleVariants = useMemo(
    () =>
      product.variants.filter((v) =>
        Object.keys(selectedOptions).reduce((possible, optionGroupId) => {
          const option = v.options.find(
            (o: ProductOption) => o.groupId === optionGroupId
          );
          return (
            possible &&
            option &&
            option.code === selectedOptions[optionGroupId].code
          );
        }, true)
      ),
    [product, selectedOptions]
  );

  //recalculate the possible options
  const possibleOptions = useMemo(() => {
    const possibleOptions: { [option: string]: string[] } = {};

    product.optionGroups.forEach((group: ProductOptionGroup) => {
      possibleOptions[group.code] = group.options
        .filter((option) =>
          possibleVariants.find((v) => {
            //check if at least one variant still has this option
            const o = v.options.find((o) => o.groupId === group.id);
            return o && o.id === option.id;
          })
        )
        .map((o) => o.code);
    });

    return possibleOptions;
  }, [possibleVariants]);

  const selectedVariant: ProductVariant | null = useMemo(
    () => (possibleVariants.length === 1 ? possibleVariants[0] : null),
    [possibleVariants]
  );

  const onVariationSliderSelect = useCallback(
    (options) => setSelectedOptions({ ...selectedOptions, ...options }),
    [selectedOptions, setSelectedOptions]
  );

  const activeBulkDiscount: BulkDiscount | null = useMemo(() => {
    if (selectedVariant) {
      const row = selectedVariant.bulkDiscounts
        .sort((a, b) => a.quantity - b.quantity)
        .find((discount) => discount.quantity >= quantity);
      return row ? row : null;
    }

    return null;
  }, [selectedVariant, quantity]);

  const unit: string | null = useMemo(() => {
    if (selectedVariant) {
      const facetValue = selectedVariant.facetValues.find(
        (f) => f.facet.code === "unit"
      );
      const option = selectedVariant.options.find((o) => o.code === "unit");

      return option ? option.name : facetValue ? facetValue.name : null;
    }
    return null;
  }, [selectedVariant]);

  const crosssells = useMemo(
    () =>
      product.recommendations.filter(
        (r) => r.type === RecommendationType.Crosssell
      ),
    [product]
  );

  const resellerDiscount = false;

  return (
    <div>
      <Head>
        <title>{stripTags(product.name)} - Hauser Feuerschutz AG</title>
        <meta name="description" content={stripTags(product.description)} />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.product.languages[intl.locale]
          }/${product.slug}`}
        />
      </Head>
      <JsonLd>
        {{
          "@context": "http://schema.org/",
          ...productToJsonLd(product),
        }}
        }
      </JsonLd>
      <ProductCard>
        <h1 dangerouslySetInnerHTML={{ __html: product.name }} />
        <div>
          <hr />
          <h4>{intl.formatMessage(messages.chooseAVariation)}</h4>
          <VariationSlider
            variants={product.variants}
            selectedOptions={selectedOptions}
            onSelect={onVariationSliderSelect}
          />
        </div>
        <Flex flexWrap="wrap">
          {product.optionGroups.map((optionGroup) => (
            <Box key={optionGroup.id} width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
              <h4>{optionGroup.name}</h4>
              <Select
                placeholder={intl.formatMessage(messages.chooseAnAttribute)}
                onChange={(item: { label: string; value: string }) => {
                  const group = product.optionGroups.find(
                    (g) => g.id === optionGroup.id
                  );
                  if (!group) {
                    console.error(
                      "The select isn't paired to a group, this shouldn't happen"
                    );
                    return;
                  }
                  if (!item) {
                    const o = { ...selectedOptions };
                    delete o[optionGroup.id];
                    setSelectedOptions(o);
                  } else {
                    setSelectedOptions({
                      ...selectedOptions,
                      [optionGroup.id]: group.options.find(
                        (o) => o.code === item.value
                      ),
                    });
                  }
                }}
                value={
                  selectedOptions[optionGroup.id] &&
                  selectedOptions[optionGroup.id].code
                }
                options={optionGroup.options.map((option) => ({
                  label: option.name,
                  value: option.code,
                }))}
              />
            </Box>
          ))}
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
            <h4>{intl.formatMessage(productMessages.quantity)}</h4>
            <Counter
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(parseInt(e.currentTarget.value), 1))
              }
            />
          </Box>
          {/*fields.map(({ label, placeholder, type, maxLength }, index) => (
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
              ))*/}
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2}>
            <h4>{intl.formatMessage(messages.reset)}</h4>
            <Button
              onClick={() =>
                new Promise((resolve, reject) => {
                  setSelectedOptions({});
                  resolve();
                })
              }
            >
              {intl.formatMessage(messages.resetSelection)}
            </Button>
          </Box>
        </Flex>
        <Flex flexWrap="wrap">
          {resellerDiscount === false ? (
            selectedVariant &&
            selectedVariant.bulkDiscounts.length > 0 && (
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
                    {selectedVariant.bulkDiscounts.map(
                      ({ quantity, price }, index) => (
                        <DiscountRow
                          onClick={() => setQuantity(quantity)}
                          selected={quantity === activeBulkDiscount.quantity}
                          key={index}
                        >
                          <td>{quantity}</td>
                          <td>
                            <Price>{price}</Price>
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
                  resellerDiscount,
                }}
              />
            </Box>
          )}
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} px={2} mt={3}>
            {selectedVariant && selectedVariant.price ? (
              <div>
                <h4>{intl.formatMessage(productMessages.price)}</h4>
                <Bill
                  items={[
                    {
                      price: selectedVariant.price / 100,
                      quantity,
                      discountPrice: activeBulkDiscount
                        ? activeBulkDiscount.price
                        : undefined,
                      unit,
                    },
                  ]}
                />
                <Button
                  state={!selectedVariant || quantity <= 0 ? "disabled" : ""}
                  onClick={() => {
                    if (selectedVariant) {
                      return request(API_URL, "", {
                        productVariantId: selectedVariant.id,
                        quantity,
                      }).then((data) => {
                        setActiveOrderId(data.addItemToOrder.id);

                        if (this.crosssellRef.current) {
                          const el = ReactDOM.findDOMNode(
                            this.crosssellRef.current
                          );
                          if ("scrollIntoView" in el) {
                            el.scrollIntoView();
                          }
                        }
                      });
                    } else {
                      return Promise.resolve();
                    }
                  }}
                >
                  {intl.formatMessage(productMessages.addToCart)}
                </Button>
              </div>
            ) : !selectedVariant ? (
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
                        window.location.href = "mailto:info@feuerschutz.ch";
                        return Promise.resolve();
                      }}
                    >
                      {intl.formatMessage(messages.contactEmail)}
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      window.location.href = "tel:+41628340540";
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
          {product.description && (
            <Box width={[1, 1, 1 / 2, 2 / 3]} pr={3} mt={3}>
              <UnsafeHTMLContent content={product.description} />
              <h2>{intl.formatMessage(messages.imageGallery)}</h2>
              <LightboxGallery assets={product.assets} />
            </Box>
          )}
          <Box width={[1, 1, 1 / 2, 1 / 3]} pl={3} mt={3}>
            <h4>{intl.formatMessage(messages.specifications)}</h4>
            <StyledTable>
              <tbody>
                <tr>
                  <td>{intl.formatMessage(productMessages.sku)}</td>
                  <td>
                    {selectedVariant
                      ? selectedVariant.sku
                      : product.customFields.groupKey}
                  </td>
                </tr>
                <tr>
                  <td>{intl.formatMessage(productMessages.categories)}</td>
                  <td>
                    {product.collections
                      .map(({ id, name }) => (
                        <StyledLink
                          key={id}
                          underlined
                          href={`/${intl.locale}/${
                            pathnamesByLanguage.productCategory.languages[
                              intl.locale
                            ]
                          }/${id}`}
                        >
                          {name}
                        </StyledLink>
                      ))
                      //@ts-ignore
                      .reduce((prev, curr) => [prev, ", ", curr])}
                  </td>
                </tr>
                <tr>
                  <td>{intl.formatMessage(productMessages.product)}</td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: selectedVariant
                        ? selectedVariant.name
                        : product.name,
                    }}
                  ></td>
                </tr>
                {Object.keys(selectedOptions).map((optionGroupId) => {
                  const optionGroup = product.optionGroups.find(
                    (g) => g.id === optionGroupId
                  );

                  return (
                    <tr key={optionGroupId}>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: optionGroup ? optionGroup.name : "-",
                        }}
                      ></td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: selectedOptions[optionGroupId]
                            ? selectedOptions[optionGroupId].name
                            : "-",
                        }}
                      ></td>
                    </tr>
                  );
                })}
              </tbody>
            </StyledTable>
          </Box>
        </Flex>
      </ProductCard>

      {crosssells.length > 0 && (
        <Card mb={0}>
          <h2 ref={crosssellRef} style={{ margin: 0 }}>
            {intl.formatMessage(messages.additionalProducts)}
          </h2>
        </Card>
      )}

      <CrossSellFlex flexWrap="wrap" style={{ paddingBottom: 16 }}>
        {crosssells.map((r, index) => (
          <ProductItem key={index} product={r.recommendation} />
        ))}
      </CrossSellFlex>
    </div>
  );
});
export default Product;
