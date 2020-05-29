import { GetStaticPaths, GetStaticProps } from "next";
import request from "../../../utilities/request";
import { API_URL } from "../../../utilities/api";
import { GET_ALL_COLLECTIONS } from "../../../gql/collection";
import { Collection } from "../../../schema";

const Page = (props) => {
  return <div>hi {JSON.stringify(props)}</div>;
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const data: { collections: Collection[] } = await request(
    API_URL,
    GET_ALL_COLLECTIONS
  );

  return {
    paths: data.collections.map((collection) => ({
      params: { slug: collection.id }
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return { props: { slug: context.params.slug } };
};
