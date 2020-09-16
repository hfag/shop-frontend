import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent, useMemo } from "react";
import { Product as ProductType } from "../../../schema";
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
import { locale } from "../config.json";

const ProductPage: FunctionComponent<{
  productSlug: string;
  productResponse: { productBySlug: ProductType };
}> = ({ productSlug, productResponse }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_PRODUCT_BY_SLUG, productSlug],
    (query, productSlug) => request(intl.locale, query, { slug: productSlug }),
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

export default ProductPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const data: { products: { items: ProductType[] } } = await request(
    locale,
    GET_ALL_PRODUCT_SLUGS
  );

  return {
    paths: data.products.items.map((product) => ({
      params: { slug: product.slug, id: product.id },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      productResponse: await request(locale, GET_PRODUCT_BY_SLUG, {
        slug: context.params.slug,
      }),
      productSlug: context.params.slug,
    },
  };
};
