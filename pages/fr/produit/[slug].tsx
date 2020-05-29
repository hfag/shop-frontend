import { GetStaticPaths, GetStaticProps } from "next";
import { Product } from "../../../schema";
import request from "../../../utilities/request";
import { API_URL } from "../../../utilities/api";
import { GET_ALL_PRODUCT_SLUGS } from "../../../gql/product";

const Page = (props) => {
  return <div>hi {JSON.stringify(props)}</div>;
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const data: { products: { items: Product[] } } = await request(
    API_URL,
    GET_ALL_PRODUCT_SLUGS
  );

  return {
    paths: data.products.items.map((product) => ({
      params: { slug: product.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return { props: { slug: context.params.slug } };
};
