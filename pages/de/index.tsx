import { request } from "graphql-request";
import { GET_ALL_COLLECTIONS, GET_COLLECTION } from "../../gql/collection";
import { GetStaticProps } from "next";
import { API_URL } from "../../utilities/api";
import { Collection } from "../../schema";
import ProductCollection from "../../components/ProductCollection";
import { FunctionComponent } from "react";
import Wrapper from "../../components/layout/Wrapper";

const Home: FunctionComponent<{
  collectionResponse: { collection: Collection };
}> = ({ collectionResponse }) => {
  return (
    <Wrapper sidebar={<>hi</>} breadcrumbs={[]}>
      <ProductCollection
        collectionId={1}
        initialData={collectionResponse}
        showDescription={false}
      />
    </Wrapper>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      collectionResponse: await request(API_URL, GET_COLLECTION, { id: 1 })
    }
  };
};
