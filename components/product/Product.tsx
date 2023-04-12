import { FormattedMessage, useIntl } from "react-intl";
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";

import { ABSOLUTE_URL } from "../../utilities/api";
import { ADD_TO_ORDER, GET_ACTIVE_ORDER } from "../../gql/order";
import { AppContext } from "../AppWrapper";
import {
  BulkDiscount,
  Mutation,
  ProductOption,
  ProductOptionGroup,
  Product as ProductType,
  ProductVariant,
  RecommendationType,
} from "../../schema";
import { InputFieldWrapper } from "../form/InputFieldWrapper";
import { borders, colors } from "../../utilities/style";
import { errorCodeToMessage } from "../../utilities/i18n";
import { isClient } from "../../utilities/ssr";
import { mutate } from "swr";
import { pathnamesByLanguage } from "../../utilities/urls";
import { productToJsonLd } from "../../utilities/json-ld";
import { stripTags } from "../../utilities/decode";
import { useAuthenticate } from "../../utilities/hooks";
import { useRouter } from "next/router";
import Asset from "../elements/Asset";
import Bill from "../elements/Bill";
import Box from "../layout/Box";
import Button from "../elements/Button";
import Card from "../layout/Card";
import Edit from "../elements/EditButton";
import Flex from "../layout/Flex";
import Head from "next/head";
import JsonLd from "../seo/JsonLd";
import LightboxGallery from "../content/LightboxGallery";
import Placeholder from "../elements/Placeholder";
import Price from "../elements/Price";
import ProductCrossSells from "./ProductCrossSells";
import Select from "../elements/Select";
import StyledLink from "../elements/StyledLink";
import Table from "../elements/Table";
import UnsafeHTMLContent from "../content/UnsafeHTMLContent";
import VariationSlider from "./VariationSlider";
import messages from "../../i18n/product";
import productMessages from "../../i18n/product";
import request from "../../utilities/request";

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

const ErrorContainer = styled.div`
  color: ${colors.danger};
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

const areOptionsEqual = (o1: ProductOption, o2: ProductOption) =>
  o1 && o2 && o1.id == o2.id;

const Product: FunctionComponent<{
  product?: ProductType;
}> = React.memo(({ product }) => {
  if (!product) {
    return <Placeholder block />;
  }

  const intl = useIntl();
  const router = useRouter();

  const { customer: user, token } = useContext(AppContext);
  const isAdmin = useAuthenticate();

  const [selectedOptions, setSelectedOptions] = useState<{
    [optionGroupId: string]: ProductOption;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const crosssellRef = useRef(null);

  useEffect(() => {
    setSelectedOptions({});
    setQuantity(1);
  }, [product]);

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
      /* facets from product */
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
      /* facets from variant */
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
  }, [product]);

  const customizationOptions: {
    [key: string]: {
      labels: { language: string; label: string }[];
      type: string;
    };
  } | null = useMemo(() => {
    try {
      return JSON.parse(product.customFields.customizationOptions);
    } catch (e) {
      return null;
    }
  }, [product.customFields.customizationOptions]);

  const [customizations, setCustomizations] = useState({});

  useEffect(() => {
    //select the default options or the specified sku
    setSelectedOptions(
      router.query.sku && !Array.isArray(router.query.sku)
        ? product.variants
            .find((v) => v.sku === router.query.sku)
            .options.reduce((obj, option) => {
              obj[option.groupId] = option;
              return obj;
            }, {})
        : defaultOptions
    );
  }, [product.variants, router.query.sku]);

  /*useEffect(() => {
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
      setSelectedOptions({ ...selectedOptions, ...autoSelection });
    }
  }, [possibleVariants]);*/

  const galleryAssets = product.assets.filter(
    (a) => a.id != product.featuredAsset.id
  );

  return (
    <div>
      <Head>
        <title>{`${stripTags(product.name)} - Hauser Feuerschutz AG`}</title>
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
        <h1>
          <span dangerouslySetInnerHTML={{ __html: product.name }} />
          {isAdmin && (
            <Edit
              onClick={() =>
                router.push(
                  `/${intl.locale}/${
                    pathnamesByLanguage.editProduct.languages[intl.locale]
                  }/${product.id}`
                )
              }
            />
          )}
        </h1>
        {product.customFields.buyable && (
          <div>
            <hr />
            <h4>{intl.formatMessage(messages.chooseAVariation)}</h4>
            <VariationSlider
              variants={product.variants}
              selectedOptions={selectedOptions}
              onSelect={onVariationSliderSelect}
            />
          </div>
        )}
        <Flex flexWrap="wrap" marginX>
          {product.customFields.buyable &&
            product.optionGroups
              .filter((optionGroup) => !(optionGroup.id in defaultOptions))
              .map((optionGroup) => (
                <Box
                  key={optionGroup.id}
                  widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]}
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
                    selected={selectedOptions[optionGroup.id] || null}
                    options={optionGroup.options
                      .filter((option) =>
                        possibleOptions[optionGroup.id].includes(option)
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))}
                    mapOptionToLabel={(item: ProductOption) => item.name}
                    areOptionsEqual={areOptionsEqual}
                  />
                </Box>
              ))}
          {customizationOptions &&
            Object.keys(customizationOptions).map((optionKey) => {
              const { labels, type } = customizationOptions[optionKey];
              const label = labels.find(
                (l) => l.language === intl.locale
              )?.label;

              return (
                <Box
                  key={optionKey}
                  widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]}
                  paddingX={0.5}
                >
                  <h4>{label || optionKey}</h4>
                  {type === "text" && (
                    <InputFieldWrapper>
                      <input
                        type="text"
                        placeholder={/*placeholder*/ ""}
                        onChange={(e) =>
                          setCustomizations({
                            ...customizations,
                            [optionKey]: e.target.value,
                          })
                        }
                        value={customizations[optionKey] || ""}
                      />
                    </InputFieldWrapper>
                  )}
                </Box>
              );
            })}
          {product.customFields.buyable && (
            <>
              <Box widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5}>
                <h4>{intl.formatMessage(productMessages.quantity)}</h4>
                <Counter
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(parseInt(e.currentTarget.value), 1))
                  }
                />
              </Box>
              <Box widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]} paddingX={0.5}>
                <h4>{intl.formatMessage(messages.reset)}</h4>
                <Button
                  onClick={() =>
                    new Promise((resolve) => {
                      setSelectedOptions({});
                      resolve(true);
                    })
                  }
                >
                  {intl.formatMessage(messages.resetSelection)}
                </Button>
              </Box>
            </>
          )}
        </Flex>
        <Flex flexWrap="wrap" marginX>
          {activeResellerDiscounts.length === 0 ? (
            selectedVariant &&
            selectedVariant.bulkDiscounts.length > 0 && (
              <Box
                widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]}
                paddingX={2}
                marginTop={3}
              >
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
                      ({ quantity, price }, index) => {
                        return (
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
                        );
                      }
                    )}
                  </tbody>
                </DiscountTable>
              </Box>
            )
          ) : (
            <Box
              widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]}
              paddingX={0.5}
              marginTop={1}
            >
              <h4>{intl.formatMessage(productMessages.resellerDiscount)}</h4>
              {activeResellerDiscounts.map((d, i) => (
                <span key={i}>
                  <FormattedMessage
                    id="Product.resellerDiscountMessage"
                    defaultMessage="Als Wiederverkäufer erhalten Sie {resellerDiscount}% Rabatt auf dieses Produkt."
                    values={{
                      resellerDiscount: d.discount,
                    }}
                  />
                  <br />
                </span>
              ))}
            </Box>
          )}
          <Box
            widths={[1, 1, 1, 1 / 2, 1 / 3, 1 / 3]}
            paddingX={0.5}
            marginTop={1}
          >
            {product.customFields.buyable && selectedVariant ? (
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
                      const data = await request<{
                        addCustomItemToOrder: Mutation["addCustomItemToOrder"];
                      }>(intl.locale, ADD_TO_ORDER, {
                        productVariantId: selectedVariant.id,
                        quantity,
                        customizations:
                          Object.keys(customizations).length > 0
                            ? JSON.stringify(customizations)
                            : undefined,
                      });

                      if ("errorCode" in data.addCustomItemToOrder) {
                        setError(
                          errorCodeToMessage(intl, data.addCustomItemToOrder)
                        );
                        return;
                      }

                      //trigger refetching of the active order
                      mutate([GET_ACTIVE_ORDER, token]);

                      if (crosssellRef.current) {
                        crosssellRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }

                      return true;
                    } else {
                      if (isClient) {
                        window.location.reload();
                      } else {
                        throw new Error(
                          "This should never ever happen, please contact us!"
                        );
                      }
                    }
                  }}
                >
                  {intl.formatMessage(productMessages.addToCart)}
                </Button>
                {error && <ErrorContainer>{error}</ErrorContainer>}
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
          {(product.description || galleryAssets.length > 0) && (
            <Box
              widths={[1, 1, 1, 1 / 2, 2 / 3]}
              paddingRight={1}
              marginTop={1}
            >
              <UnsafeHTMLContent content={product.description} />
              {galleryAssets.length > 0 ? (
                <>
                  <h2>{intl.formatMessage(messages.imageGallery)}</h2>
                  <LightboxGallery
                    images={galleryAssets}
                    imageToUrl={(asset) => asset.source}
                    imageToPreviewElement={(asset) => <Asset asset={asset} />}
                  />
                </>
              ) : null}
            </Box>
          )}
          <Box widths={[1, 1, 1, 1 / 2, 1 / 3]} paddingLeft={1} marginTop={1}>
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
                    {product.collections.map(({ id, name, slug }, index) => (
                      <span key={id}>
                        {index > 0 && ", "}
                        <StyledLink
                          underlined
                          href={`/${intl.locale}/${
                            pathnamesByLanguage.productCategory.languages[
                              intl.locale
                            ]
                          }/${slug}`}
                        >
                          {name}
                        </StyledLink>
                      </span>
                    ))}
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
                  .filter(
                    (fv) =>
                      !["categories", "reseller-discounts"].includes(
                        fv.facet.code
                      )
                  )
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
