import Head from "next/head";
import Link from "next/link";
import { request } from "graphql-request";
import useSWR from "swr";
import { GET_ALL_COLLECTIONS, GET_COLLECTION } from "../../gql/collection";
import TestPage from "../../containers/Test";
import { GetStaticProps } from "next";
import { API_URL } from "../../utilities/api";
import { Collection } from "../../schema";
import ProductCollection from "../../components/ProductCollection";
import { FunctionComponent } from "react";

const Home: FunctionComponent<{ collection: Collection }> = ({
  collection
}) => {
  return (
    <>
      <ProductCollection collectionId={1} initialData={collection} />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: { collection: await request(API_URL, GET_COLLECTION, { id: 1 }) }
  };
};
