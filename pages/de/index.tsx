import { GetStaticProps, GetStaticPaths } from "next";
import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { GET_COLLECTION } from "../../gql/collection";
import ProductCollection from "../../components/collection/ProductCollection";
import { Collection } from "../../schema";
import Wrapper from "../../components/layout/Wrapper";
import request from "../../utilities/request";
import { locale } from "./config.json";

const Home: FunctionComponent<{
  collectionResponse: { collection: Collection };
}> = ({ collectionResponse }) => {
  const intl = useIntl();

  return (
    <Wrapper sidebar={null} breadcrumbs={[]}>
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
      collectionResponse: await request(locale, GET_COLLECTION, { id: 1 }),
    },
  };
};
