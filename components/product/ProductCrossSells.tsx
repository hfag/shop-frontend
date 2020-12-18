import ProductItem from "./ProductItem";
import Flex from "../layout/Flex";
import Card from "../layout/Card";
import { FunctionComponent, useCallback, useState } from "react";
import { Product, ProductRecommendation, Query } from "../../schema";
import { defineMessages, useIntl } from "react-intl";
import RestrictedView from "../elements/RestrictedView";
import Button from "../elements/Button";
import { useAuthenticate } from "../../utilities/hooks";
import { FaEdit } from "react-icons/fa";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import request, { requestAdmin } from "../../utilities/request";
import {
  ADMIN_UPDATE_CROSS_SELLS,
  ADMIN_UPDATE_UP_SELLS,
  GET_PRODUCT,
  GET_PRODUCT_BY_SLUG,
  GET_PRODUCTS,
} from "../../gql/product";
import Flexbar from "../layout/Flexbar";
import form from "../../i18n/form";
import { mutate } from "swr";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

const Edit = styled(FaEdit)`
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;
`;

const StyledAsyncSelect = styled(AsyncSelect)`
  flex-grow: 1;
  margin-left: 1rem;
`;

const messages = defineMessages({
  additionalProducts: {
    id: "ProductCrossSells.additionalProducts",
    defaultMessage: "Ergänzende Produkte",
  },
  crossSell: {
    id: "ProductCrossSells.crossSell",
    defaultMessage: "Ergänzende Produkte",
  },
  upSell: {
    id: "ProductCrossSells.upSell",
    defaultMessage: "Bessere Produkte",
  },
});

const ProductCrossSells: FunctionComponent<{
  productId: number | string;
  productSlug: string;
  crosssellRef: React.MutableRefObject<any>;
  crosssells: ProductRecommendation[];
  upsells: ProductRecommendation[];
}> = ({ productId, productSlug, crosssellRef, crosssells, upsells }) => {
  const intl = useIntl();
  const isAdmin = useAuthenticate();
  const [editing, setEditing] = useState(false);
  const [upSellOptions, setUpSellOptions] = useState<
    { label: string; value: string | number }[] | null
  >(
    upsells.map((recommendation) => ({
      label: recommendation.recommendation.name,
      value: recommendation.recommendation.id,
    }))
  );
  const [crossSellOptions, setCrossSellOptions] = useState<
    { label: string; value: string | number }[] | null
  >(
    crosssells.map((recommendation) => ({
      label: recommendation.recommendation.name,
      value: recommendation.recommendation.id,
    }))
  );

  const fetchOptions = useCallback(
    (input: string) =>
      request<{ products: Query["products"] }>(intl.locale, GET_PRODUCTS, {
        options: { filter: { name: { contains: input } } },
      }).then(
        (response) =>
          response?.products?.items.map((item: Product) => ({
            label: item.name,
            value: item.id,
          })) || []
      ),
    []
  );

  const onSubmit = useCallback(() => {
    return Promise.all([
      requestAdmin(intl.locale, ADMIN_UPDATE_CROSS_SELLS, {
        productId,
        productIds: crossSellOptions
          ? crossSellOptions.map((option) => option.value)
          : [],
      }),
      requestAdmin(intl.locale, ADMIN_UPDATE_UP_SELLS, {
        productId,
        productIds: upSellOptions
          ? upSellOptions.map((option) => option.value)
          : [],
      }),
    ]).then(() => {
      mutate([GET_PRODUCT, productId]);
      mutate([GET_PRODUCT_BY_SLUG, productSlug]);
      setEditing(false);
    });
  }, [crossSellOptions, upSellOptions]);

  return (
    <>
      {(crosssells.length > 0 || isAdmin) && (
        <Card mb={0}>
          <h2 ref={crosssellRef} style={{ margin: 0 }}>
            {intl.formatMessage(messages.additionalProducts)}
            {isAdmin && <Edit onClick={() => setEditing(true)} />}
          </h2>
        </Card>
      )}
      <Flex flexWrap="wrap" style={{ paddingBottom: 16 }}>
        {!editing &&
          crosssells.map((r, index) => (
            <ProductItem key={index} product={r.recommendation} />
          ))}
      </Flex>
      {editing && (
        <Card>
          <Flexbar marginBottom={1}>
            <span>{intl.formatMessage(messages.crossSell)}</span>
            <StyledAsyncSelect
              isMulti
              loadOptions={fetchOptions}
              value={crossSellOptions}
              onChange={setCrossSellOptions}
            />
          </Flexbar>
          <Flexbar marginBottom={2}>
            <span>{intl.formatMessage(messages.upSell)}</span>
            <StyledAsyncSelect
              isMulti
              loadOptions={fetchOptions}
              value={upSellOptions}
              onChange={setUpSellOptions}
            />
          </Flexbar>

          <Flexbar>
            <Button onClick={onSubmit}>
              {intl.formatMessage(form.saveChanges)}
            </Button>

            <Button onClick={() => setEditing(false)} marginLeft={1}>
              {intl.formatMessage(form.cancel)}
            </Button>
          </Flexbar>
        </Card>
      )}
    </>
  );
};

export default ProductCrossSells;
