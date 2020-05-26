import Head from "next/head";
import Link from "next/link";

import TestPage from "../containers/Test";
import { withApollo, initOnContext } from "../libs/apollo";
import { NextPageContext, GetStaticProps } from "next";

const Home = function Home() {
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

        <TestPage />

        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>
    </div>
  );
};

export default withApollo({ ssr: false })(Home);

export const getStaticProps: GetStaticProps = async (context) => {
  initOnContext(context);
  console.log(context.apolloClient);
  return { props: {} };
};
