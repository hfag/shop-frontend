import React from "react";
import { withApollo } from "../libs/apollo";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_COLLECTIONS } from "../gql/products";

const TestPage = (props) => {
  const { loading, error, data } = useQuery(GET_ALL_COLLECTIONS);
  if (error) return <h1>Error</h1>;
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Setting up Apollo GraphQL in Next.js with Server Side Rendering</h1>
      <div>{JSON.stringify(data)}</div>
    </>
  );
};

export default TestPage;
