import { GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { GET_ALL_COLLECTIONS, GET_COLLECTION } from "../../gql/collection";
import { API_URL } from "../../utilities/api";
import { Collection } from "../../schema";
import ProductCollection from "../../components/ProductCollection";
import Wrapper from "../../components/layout/Wrapper";
import request from "../../utilities/request";

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
      collectionResponse: await request(API_URL, GET_COLLECTION, { id: 1 }),
    },
  };
};
