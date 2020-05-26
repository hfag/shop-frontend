import Head from "next/head";
import Link from "next/link";
import { request } from "graphql-request";
import useSWR from "swr";
import { GET_ALL_COLLECTIONS } from "../gql/products";
import TestPage from "../containers/Test";
import { GetStaticProps } from "next";
import { API_URL } from "../utilities/api";

const Home = (props: { collections: any }) => {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Wanna read a{" "}
          <Link href="/posts/first-post">
            <a>post?</a>
          </Link>
        </h1>

        <TestPage initialData={props.collections} />

        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: { collections: await request(API_URL, GET_ALL_COLLECTIONS) }
  };
};
