import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent, useMemo } from "react";
import { Product as ProductType, Query } from "../../../schema";
import request from "../../../utilities/request";
import {
  GET_ALL_PRODUCT_SLUGS,
  GET_PRODUCT_BY_SLUG,
} from "../../../gql/product";
import Wrapper from "../../../components/layout/Wrapper";
import Product from "../../../components/product/Product";
import { useIntl } from "react-intl";
import useSWR from "swr";
import page from "../../../i18n/page";
import { pathnamesByLanguage } from "../../../utilities/urls";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";
import { locale, messages } from "../config";
import { withApp } from "../../../components/AppWrapper";

const Page: FunctionComponent<{
  productSlug: string;
  productResponse: { productBySlug: ProductType };
}> = ({ productSlug, productResponse }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_PRODUCT_BY_SLUG, productSlug],
    (query, productSlug) =>
      request<{ productBySlug: Query["productBySlug"] }>(intl.locale, query, {
        slug: productSlug,
      }),
    {
      initialData: productResponse,
    }
  );

  const breadcrumbs = useMemo(() => {
    return data.productBySlug.collections.length > 0
      ? data.productBySlug.collections[0].breadcrumbs
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
            <SidebarBreadcrumb active>
              {data.productBySlug.name}
            </SidebarBreadcrumb>
          )}
        </SidebarBreadcrumbs>
      }
      breadcrumbs={
        data
          ? [
              ...breadcrumbs,
              {
                name: data.productBySlug.name,
                url: `/${intl.locale}/${
                  pathnamesByLanguage.product.languages[intl.locale]
                }/${productSlug}`,
              },
            ]
          : []
      }
    >
      <Product product={data && data.productBySlug} />
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
    productBySlug: Query["productBySlug"];
  }>(locale, GET_PRODUCT_BY_SLUG, {
    slug: context.params.slug,
  });

  return {
    revalidate: 10, //products will be rerendered at most every 10s
    notFound: productResponse?.productBySlug ? false : true,
    props: {
      productResponse,
      productSlug: context.params.slug,
    },
  };
};
