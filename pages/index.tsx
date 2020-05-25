import Head from "next/head";
import Link from "next/link";

import TestPage from "../containers/Test";

export default function Home() {
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
}
