import { GET_FULL_PRODUCT_BY_ID } from "../../../../gql/product";
import { Query } from "../../../../schema";
import { locale, messages } from "../../config";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../../../components/AppWrapper";

import { useRouter } from "next/router";
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

const Page: FunctionComponent = () => {
  const intl = useIntl();
  const router = useRouter();
  const { id: productId } = router.query;

  const { data /*, error*/ } = useSWR(
    [GET_FULL_PRODUCT_BY_ID, productId],
    (query, productId) =>
      request<{ product: Query["product"] }>(intl.locale, query, {
        id: productId,
      })
  );

  const breadcrumbs = useMemo(() => {
    return data?.product?.collections && data.product.collections.length > 0
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
            <SidebarBreadcrumb active>{data.product?.name}</SidebarBreadcrumb>
          )}
        </SidebarBreadcrumbs>
      }
      breadcrumbs={
        data?.product
          ? [
              ...breadcrumbs,
              {
                name: data.product.name,
                url: `/${intl.locale}/${
                  pathnamesByLanguage.product.languages[intl.locale]
                }/${data.product?.slug}`,
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
      <EditProduct product={data?.product} />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

/*export const getStaticPaths: GetStaticPaths = async () => {
  // const data: { products: { items: ProductType[] } } = await request(
  //   locale,
  //   GET_ALL_PRODUCT_SLUGS
  // );

  return {
    paths: [], //data.products.items.map((product) => ({
    //params: { slug: product.slug, id: product.id },
    //})),
    fallback: "blocking",
  };
};*/

/*export const getStaticProps: GetStaticProps = async (context) => {
  const productResponse = await request<{
    product: Query["product"];
  }>(locale, GET_FULL_PRODUCT_BY_ID, {
    id: context.params.id,
  });

  return {
    revalidate: 60 * 60 * 12, //products will be rerendered at most every 10s
    notFound: productResponse?.product ? false : true,
    props: {
      productResponse,
      productId: context.params.id,
    },
  };
};*/
