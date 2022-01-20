import { GET_FULL_PRODUCT_BY_ID } from "../../../../gql/product";
import { GetStaticPaths, GetStaticProps } from "next";
import { Product as ProductType, Query } from "../../../../schema";
import { defineMessages, useIntl } from "react-intl";
import { locale, messages } from "../../config";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import { withApp } from "../../../../components/AppWrapper";

import React, { FunctionComponent, useMemo } from "react";
import SidebarBreadcrumb from "../../../../components/layout/sidebar/SidebarBreadcrumb";
import SidebarBreadcrumbs from "../../../../components/layout/sidebar/SidebarBreadcrumbs";
import Wrapper from "../../../../components/layout/Wrapper";
import dynamic from "next/dynamic";
import page from "../../../../i18n/page";
import request from "../../../../utilities/request";
import useSWR from "swr";

const EditProduct = dynamic(
  () => import("../../../../components/product/EditProduct")
);

const Page: FunctionComponent<{
  productId: string;
  productResponse: { product: ProductType };
}> = ({ productId, productResponse }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_FULL_PRODUCT_BY_ID, productId],
    (query, productId) =>
      request<{ product: Query["product"] }>(intl.locale, query, {
        id: productId,
      }),
    {
      initialData: productResponse,
    }
  );

  const breadcrumbs = useMemo(() => {
    return data.product.collections.length > 0
      ? data.product.collections[0].breadcrumbs
          .filter((b) => parseInt(b.id) > 1 /* remove root collection */)
          .map((b) => ({
            name: b.name,
            url: `/${intl.locale}/${
              pathnamesByLanguage.productCategory.languages[intl.locale]
            }/${b.slug}`,
          }))
      : [];
  }, [data]);

  return (
    <Wrapper
      sidebar={
        <SidebarBreadcrumbs breadcrumbs={breadcrumbs}>
          {data && (
            <SidebarBreadcrumb active>{data.product.name}</SidebarBreadcrumb>
          )}
        </SidebarBreadcrumbs>
      }
      breadcrumbs={
        data
          ? [
              ...breadcrumbs,
              {
                name: data.product.name,
                url: `/${intl.locale}/${
                  pathnamesByLanguage.product.languages[intl.locale]
                }/${data.product.slug}`,
              },
              {
                name: intl.formatMessage(page.editProduct),
                url: `/${intl.locale}/${
                  pathnamesByLanguage.editProduct.languages[intl.locale]
                }/${productId}`,
              },
            ]
          : []
      }
    >
      <EditProduct product={data && data.product} />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

export const getStaticPaths: GetStaticPaths = async () => {
  // const data: { products: { items: ProductType[] } } = await request(
  //   locale,
  //   GET_ALL_PRODUCT_SLUGS
  // );

  return {
    paths: [] /*data.products.items.map((product) => ({
      params: { slug: product.slug, id: product.id },
    }))*/,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const productResponse = await request<{
    product: Query["product"];
  }>(locale, GET_FULL_PRODUCT_BY_ID, {
    id: context.params.id,
  });

  return {
    revalidate: 10, //products will be rerendered at most every 10s
    notFound: productResponse?.product ? false : true,
    props: {
      productResponse,
      productId: context.params.id,
    },
  };
};
