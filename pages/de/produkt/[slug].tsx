import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { Product as ProductType } from "../../../schema";
import request from "../../../utilities/request";
import { API_URL } from "../../../utilities/api";
import {
  GET_ALL_PRODUCT_SLUGS,
  GET_PRODUCT_BY_SLUG,
} from "../../../gql/product";
import Wrapper from "../../../components/layout/Wrapper";
import Product from "../../../components/product/Product";

const ProductPage: FunctionComponent<{
  productSlug: string;
  productResponse: { productBySlug: ProductType };
}> = ({ productSlug, productResponse }) => {
  return (
    <Wrapper sidebar={null} breadcrumbs={[]}>
      <Product productSlug={productSlug} initialData={productResponse} />
    </Wrapper>
  );
};

export default ProductPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const data: { products: { items: ProductType[] } } = await request(
    API_URL,
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
      productResponse: await request(API_URL, GET_PRODUCT_BY_SLUG, {
        slug: context.params.slug,
      }),
      productSlug: context.params.slug,
    },
  };
};
