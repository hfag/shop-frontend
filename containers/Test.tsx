import React from "react";
import useSWR from "swr";
import { GET_ALL_COLLECTIONS } from "../gql/collection";
import { API_URL } from "../utilities/api";

const TestPage = (props: { initialData: any }) => {
  const { data, error } = useSWR(GET_ALL_COLLECTIONS, {
    initialData: props.initialData,
  });
  const loading = !data;

  if (error) return <h1>Error {JSON.stringify(error)}</h1>;
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Setting up Apollo GraphQL in Next.js with Server Side Rendering</h1>
      <div>{JSON.stringify(data)}</div>
    </>
  );
};

export default TestPage;
