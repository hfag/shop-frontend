import { AppContext } from "../AppWrapper";
import { GET_PRODUCTS_BY_FACETS_IDS } from "../../gql/search";
import { Query } from "../../schema";
import { ResellerDiscount } from "../../schema";
import { SearchResult } from "../../schema";
import { Unavailable } from "../administrator/Unavailable";
import { defineMessages, useIntl } from "react-intl";
import { pathnamesByLanguage } from "../../utilities/urls";
import Button from "../elements/Button";
import Pagination from "../elements/Pagination";
import Price from "../elements/Price";
import React, { useContext, useMemo, useState } from "react";
import StyledLink from "../elements/StyledLink";
import Table from "../elements/Table";
import request from "../../utilities/request";
import styled from "@emotion/styled";
import useSWR from "swr";

const messages = defineMessages({
  reseller: {
    id: "AccountResellerDiscounts.reseller",
    defaultMessage: "Wiederverkäufer",
  },
  download: {
    id: "AccountResellerDiscounts.download",
    defaultMessage: "Herunterladen",
  },
});

const ResellerWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const ITEMS_PER_PAGE = 100;

const mapSearchResult = (
  item: SearchResult,
  resellerDiscounts: ResellerDiscount[]
) => {
  const activeResellerDiscounts = resellerDiscounts.filter((discount) =>
    discount.facetValueIds.reduce(
      (has, valueId) =>
        has &&
        item.facetValueIds.find((facetValueId) => facetValueId === valueId)
          ? true
          : false,
      true
    )
  );

  const price = "value" in item.price ? item.price.value : undefined;

  const discountedPrice = price
    ? activeResellerDiscounts.reduce(
        (price, d) => (1 - d.discount / 100) * price,
        price
      )
    : undefined;

  return {
    ...item,
    price,
    discountedPrice,
    discounts: activeResellerDiscounts.map((d) => d.discount),
  };
};

const getFullResellerList = async (
  locale: string,
  facetValueIds: string[],
  resellerDiscounts: ResellerDiscount[]
) => {
  const response = await request<{ search: Query["search"] }>(
    locale,
    GET_PRODUCTS_BY_FACETS_IDS,
    {
      facetValueIds,
      take: ITEMS_PER_PAGE,
      skip: 0,
    }
  );

  const items = response.search.items.map((item) =>
    mapSearchResult(item, resellerDiscounts)
  );
  let totalItems = response.search.totalItems;

  while (items.length < totalItems) {
    const response = await request<{ search: Query["search"] }>(
      locale,
      GET_PRODUCTS_BY_FACETS_IDS,
      {
        facetValueIds,
        take: ITEMS_PER_PAGE,
        skip: items.length,
      }
    );

    totalItems = response.search.totalItems;

    items.push(
      ...response.search.items.map((item) =>
        mapSearchResult(item, resellerDiscounts)
      )
    );
  }

  return items;
};

const AccountReseller = () => {
  const intl = useIntl();
  const { user, customer, token } = useContext(AppContext);

  if (!customer && user) {
    return <Unavailable />;
  }

  const [page, setPage] = useState(0);

  const facetValueIds: string[] = useMemo(
    () =>
      customer?.resellerDiscounts
        ? [].concat(...customer.resellerDiscounts.map((d) => d.facetValueIds))
        : [],
    [customer]
  );

  const { data: searchResponse } = useSWR(
    [GET_PRODUCTS_BY_FACETS_IDS, token, page, customer?.resellerDiscounts],
    (query) =>
      request<{ search: Query["search"] }>(intl.locale, query, {
        facetValueIds,
        take: ITEMS_PER_PAGE,
        skip: page * ITEMS_PER_PAGE,
      })
  );

  const onDownloadList = async () => {
    if (!customer?.resellerDiscounts) {
      alert("Please try again later");
      return;
    }

    const items = await getFullResellerList(
      intl.locale,
      facetValueIds,
      customer.resellerDiscounts
    );

    const fileData =
      `sku,name,discount,price,discounted_price\n` +
      items
        .map(
          (item) =>
            item.sku +
            "," +
            '"' +
            item.productVariantName.replaceAll('"', "") +
            '",' +
            item.discounts.map((d) => `${d}%`).join(";") +
            "," +
            (Math.round(item.price) / 100).toFixed(2) +
            "," +
            (Math.round(item.discountedPrice) / 100).toFixed(2)
        )
        .join("\n");
    const blob = new Blob([fileData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "reseller-discounts.csv";
    link.href = url;
    link.click();
  };

  const items = useMemo(() => {
    if (!customer) {
      return [];
    }

    return searchResponse?.search?.items.map((item) =>
      mapSearchResult(item, customer.resellerDiscounts)
    );
  }, [searchResponse]);

  const total = searchResponse
    ? Math.ceil(searchResponse.search.totalItems / ITEMS_PER_PAGE)
    : 0;

  return (
    <ResellerWrapper>
      <h2>{intl.formatMessage(messages.reseller)}</h2>
      <Button onClick={onDownloadList}>
        {intl.formatMessage(messages.download)}
      </Button>
      <Pagination currentPage={page} total={total} setPage={setPage} />
      <div>
        <Table>
          <thead>
            <tr>
              <th>Artikelnummer</th>
              <th>Name</th>
              <th>Rabatt</th>
              <th>Preis</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map((item) => (
                <tr key={item.sku}>
                  <td>{item.sku}</td>
                  <td>
                    <StyledLink
                      href={`/${intl.locale}/${
                        pathnamesByLanguage.product.languages[intl.locale]
                      }/${item.slug}?sku=${item.sku}`}
                    >
                      {item.productVariantName}
                    </StyledLink>
                  </td>
                  <td>{item.discounts.map((d) => `${d}%`).join(", ")}</td>
                  <td>
                    {item.price && item.discountedPrice ? (
                      <>
                        <div>
                          <Price strike>{item.price}</Price>
                        </div>
                        <div>
                          <Price>{item.discountedPrice}</Price>
                        </div>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <Pagination currentPage={page} total={total} setPage={setPage} />
    </ResellerWrapper>
  );
};

export default AccountReseller;
