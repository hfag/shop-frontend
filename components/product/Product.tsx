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
import styled from "@emotion/styled";
import { FormattedMessage, useIntl } from "react-intl";

import Card from "../layout/Card";
import Table from "../elements/Table";
import Button from "../elements/Button";
import Price from "../elements/Price";
import Select from "../elements/Select";
import VariationSlider from "./VariationSlider";
import { colors, borders } from "../../utilities/style";
import { stripTags } from "../../utilities/decode";
import Bill from "../elements/Bill";
import JsonLd from "../seo/JsonLd";
import { productToJsonLd } from "../../utilities/json-ld";
import { pathnamesByLanguage } from "../../utilities/urls";
import productMessages from "../../i18n/product";
import { setProductView, trackPageView } from "../../utilities/analytics";
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
import { ABSOLUTE_URL } from "../../utilities/api";
import Head from "next/head";
import StyledLink from "../elements/StyledLink";
import request from "../../utilities/request";
import { ADD_TO_ORDER, GET_ACTIVE_ORDER } from "../../gql/order";
import { mutate } from "swr";
import Placeholder from "../elements/Placeholder";
import ProductCrossSells from "./ProductCrossSells";
import Flex from "../layout/Flex";
import Box from "../layout/Box";
import { AppContext } from "../AppWrapper";

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
  tbody {
    tr {
      cursor: pointer;
    }
  }
`;

const DiscountRow = styled.tr<{ selected?: boolean }>`
  background-color: ${({ selected }) =>
    selected ? colors.primary : "transparent"};

  color: ${({ selected }) => (selected ? "#fff" : "inherit")};
`;

const Product: FunctionComponent<{
  product?: ProductType;
}> = React.memo(({ product }) => {
  const intl = useIntl();
  const { customer: user, token } = useContext(AppContext);

  if (!product) {
    return <Placeholder block />;
  }

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
    const possibleOptions: { [optionGroupId: string]: ProductOption[] } = {};

    product.optionGroups.forEach((group: ProductOptionGroup) => {
      possibleOptions[group.id] = group.options.filter((option) =>
        possibleVariants.find((v) => {
          //check if at least one variant still has this option
          const o = v.options.find((o) => o.groupId === group.id);
          return o && o.id === option.id;
        })
      );
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

  const activeResellerDiscounts = useMemo(
    () => [
      ...(user
        ? user.resellerDiscounts.filter((discount) =>
            discount.facetValueIds.reduce(
              (has, valueId) =>
                has && product.facetValues.find((value) => value.id === valueId)
                  ? true
                  : false,
              true
            )
          )
        : []),
      ...(user && selectedVariant
        ? user.resellerDiscounts.filter((discount) =>
            discount.facetValueIds.reduce(
              (has, valueId) =>
                has &&
                selectedVariant.facetValues.find(
                  (value) => value.id === valueId
                )
                  ? true
                  : false,
              true
            )
          )
        : []),
    ],
    [user, product, selectedVariant]
  );

  const activeBulkDiscount: BulkDiscount | null = useMemo(() => {
    if (selectedVariant && activeResellerDiscounts.length === 0) {
      const row = selectedVariant.bulkDiscounts
        .concat() //copy
        .sort((a, b) => b.quantity - a.quantity)
        .find((discount) => discount.quantity <= quantity);

      return row ? row : null;
    }

    return null;
  }, [selectedVariant, quantity, activeResellerDiscounts.length]);

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

  const upsells = useMemo(
    () =>
      product.recommendations.filter(
        (r) => r.type === RecommendationType.Upsell
      ),
    [product]
  );

  const defaultOptions = useMemo(() => {
    //on the initial render select
    const defaultOptions: {
      [groupId: string]: ProductOption;
    } = product.optionGroups.reduce((object, optionGroup) => {
      if (optionGroup.options.length === 1) {
        object[optionGroup.id] = optionGroup.options[0];
      }
      return object;
    }, {});

    return defaultOptions;
  }, []);

  useEffect(() => {
    //on the initial render select the default options
    setSelectedOptions(defaultOptions);
  }, []);
  useEffect(() => {
    const autoSelection: { [groupId: string]: ProductOption } = Object.keys(
      possibleOptions
    )
      .filter(
        (groupId) =>
          !selectedOptions[groupId] && possibleOptions[groupId].length === 1
      )
      .reduce((obj, groupId) => {
        obj[groupId] = possibleOptions[groupId][0];
        return obj;
      }, {});

    if (Object.keys(autoSelection).length > 0) {
      console.log(selectedOptions, { ...selectedOptions, ...autoSelection });
      setSelectedOptions({ ...selectedOptions, ...autoSelection });
    }
  }, [possibleVariants]);

  return (
    <div>
      <Head>
        <title>{stripTags(product.name)} - Hauser Feuerschutz AG</title>
        {/* <meta name="description" content={stripTags(product.description)} /> */}
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
        <Flex flexWrap="wrap" marginX>
          {product.optionGroups
            .filter((optionGroup) => !(optionGroup.id in defaultOptions))
            .map((optionGroup) => (
              <Box
                key={optionGroup.id}
                width={[1, 1 / 2, 1 / 3, 1 / 3]}
                paddingX={0.5}
              >
                <h4>{optionGroup.name}</h4>
                <Select
                  placeholder={intl.formatMessage(messages.chooseAnAttribute)}
                  onChange={(item: ProductOption) => {
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
                          (o) => o.code === item.code
                        ),
                      });
                    }
                  }}
                  value={selectedOptions[optionGroup.id] || null}
                  options={optionGroup.options.filter((option) =>
                    possibleOptions[optionGroup.id].includes(option)
                  )}
                  getOptionLabel={(item: ProductOption) => item.name}
                />
              </Box>
            ))}
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5}>
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
            <Box key={index} width={[1, 1 / 2, 1 / 3, 1 / 3]} paddingX={2}>
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
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5}>
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
        <Flex flexWrap="wrap" marginX>
          {activeResellerDiscounts.length === 0 ? (
            selectedVariant &&
            selectedVariant.bulkDiscounts.length > 0 && (
              <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} paddingX={2} marginTop={3}>
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
                          selected={
                            activeBulkDiscount &&
                            quantity === activeBulkDiscount.quantity
                          }
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
            <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5} marginTop={1}>
              <h4>{intl.formatMessage(productMessages.resellerDiscount)}</h4>
              {activeResellerDiscounts.map((d) => (
                <>
                  <FormattedMessage
                    id="Product.resellerDiscountMessage"
                    defaultMessage="Als Wiederverkäufer erhalten Sie {resellerDiscount}% Rabatt auf dieses Produkt."
                    values={{
                      resellerDiscount: d.discount,
                    }}
                  />
                  <br />
                </>
              ))}
            </Box>
          )}
          <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5} marginTop={1}>
            {selectedVariant && selectedVariant.price ? (
              <div>
                <h4>{intl.formatMessage(productMessages.price)}</h4>
                <Bill
                  items={[
                    {
                      price: selectedVariant.price,
                      quantity,
                      discountPrice:
                        activeResellerDiscounts.length === 0
                          ? activeBulkDiscount
                            ? activeBulkDiscount.price
                            : undefined
                          : activeResellerDiscounts.reduce(
                              (price, d) => (1 - d.discount / 100) * price,
                              selectedVariant.price
                            ),
                      unit,
                    },
                  ]}
                />
                <Button
                  state={!selectedVariant || quantity <= 0 ? "disabled" : ""}
                  onClick={async () => {
                    if (selectedVariant) {
                      const data = await request(intl.locale, ADD_TO_ORDER, {
                        productVariantId: selectedVariant.id,
                        quantity,
                      });
                      //trigger refetching of the active order
                      mutate([GET_ACTIVE_ORDER, token]);

                      if (crosssellRef.current) {
                        const el = ReactDOM.findDOMNode(crosssellRef.current);
                        if ("scrollIntoView" in el) {
                          el.scrollIntoView();
                        }
                      }

                      return true;
                    } else {
                      throw new Error();
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
            <Box width={[1, 1, 1 / 2, 2 / 3]} paddingRight={1} marginTop={1}>
              <UnsafeHTMLContent content={product.description} />
              <h2>{intl.formatMessage(messages.imageGallery)}</h2>
              <LightboxGallery assets={product.assets} />
            </Box>
          )}
          <Box width={[1, 1, 1 / 2, 1 / 3]} paddingLeft={1} marginTop={1}>
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
                {product.facetValues
                  .filter((vf) => vf.facet.code !== "category")
                  .map((facetValue, index) => (
                    <tr key={index}>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: facetValue.facet.name,
                        }}
                      ></td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: facetValue.name,
                        }}
                      ></td>
                    </tr>
                  ))}
              </tbody>
            </StyledTable>
          </Box>
        </Flex>
      </ProductCard>

      <ProductCrossSells
        productId={product.id}
        productSlug={product.slug}
        crosssellRef={crosssellRef}
        crosssells={crosssells}
        upsells={upsells}
      />
    </div>
  );
});
export default Product;
