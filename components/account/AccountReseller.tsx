import { AppContext } from "../AppWrapper";
import { GET_EXPORT_PRODUCT_PAGE } from "../../gql/product";
import { GET_PRODUCTS_BY_FACETS_IDS } from "../../gql/search";
import { Product, SearchResult } from "../../schema";
import { Query } from "../../schema";
import { ResellerDiscount } from "../../schema";
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

const ITEMS_PER_PAGE = 50;

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

type ExportProduct = {
  [key: string]: string;
};

const mapProductItem = (
  item: Product,
  resellerDiscounts: ResellerDiscount[]
): ExportProduct[] =>
  item.variants.map<ExportProduct>((variant) => {
    const facetValueIds = [
      ...item.facetValues.map((v) => v.id),
      ...variant.facetValues.map((v) => v.id),
    ];

    const activeResellerDiscounts = resellerDiscounts.filter((discount) =>
      discount.facetValueIds.reduce(
        (has, valueId) =>
          has && facetValueIds.includes(valueId) ? true : false,
        true
      )
    );

    const discountedPrice = activeResellerDiscounts.reduce(
      (price, d) => (1 - d.discount / 100) * price,
      variant.price
    );

    const p = {
      group: item.customFields?.groupKey,
      sku: variant.sku,
      name: item.name,
      image: variant?.featuredAsset?.source,
      price: (Math.round(variant.price) / 100).toFixed(2),
      discounted_price: (Math.round(discountedPrice) / 100).toFixed(2),
      reseller_discounts: activeResellerDiscounts
        .map((d) => `${d.discount}%`)
        .join(";"),
      bulk_discounts: variant.bulkDiscounts
        .map(
          (d) => `(${d.quantity}, ${(Math.round(d.price) / 100).toFixed(2)})`
        )
        .join(";"),
    };

    for (const option of variant.options) {
      p[option.group.name] = option.name;
    }

    return p;
  });

const getFullResellerList = async (
  locale: string,
  resellerDiscounts: ResellerDiscount[]
): Promise<string> => {
  const response = await request<{ products: Query["products"] }>(
    locale,
    GET_EXPORT_PRODUCT_PAGE,
    {
      take: ITEMS_PER_PAGE,
      skip: 0,
    }
  );

  const items = response.products.items.map((item: Product) =>
    mapProductItem(item, resellerDiscounts)
  );
  let totalItems = response.products.totalItems;

  while (items.length < totalItems) {
    const response = await request<{ products: Query["products"] }>(
      locale,
      GET_EXPORT_PRODUCT_PAGE,
      {
        take: ITEMS_PER_PAGE,
        skip: items.length,
      }
    );

    totalItems = response.products.totalItems;

    items.push(
      ...response.products.items.map((item: Product) =>
        mapProductItem(item, resellerDiscounts)
      )
    );

    // wait 300ms to reduce the likelihood of the server being overloaded
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const flattenedItems = items.flat();

  const columns = Array.from(
    new Set<string>(flattenedItems.flatMap(Object.keys))
  );
  const body = flattenedItems
    .map((item) => columns.map((column) => `"${item[column] || ""}"`).join(","))
    .join("\n");

  return '"' + columns.join('","') + '"' + "\n" + body;
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

    try {
      const csvFileData = await getFullResellerList(
        intl.locale,
        customer.resellerDiscounts
      );

      const blob = new Blob([csvFileData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "reseller-discounts.csv";
      link.href = url;
      link.click();
    } catch (e) {
      console.log(e);
      throw e;
    }
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
