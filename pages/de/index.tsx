import { GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { GET_ALL_COLLECTIONS, GET_COLLECTION } from "../../gql/collection";
import { API_URL } from "../../utilities/api";
import ProductCollection from "../../components/collection/ProductCollection";
import { Collection } from "../../schema";
import Wrapper from "../../components/layout/Wrapper";
import request from "../../utilities/request";
import breadcrumbs from "../../i18n/breadcrumbs";
import { useIntl } from "react-intl";

const Home: FunctionComponent<{
  collectionResponse: { collection: Collection };
}> = ({ collectionResponse }) => {
  const intl = useIntl();

  return (
    <Wrapper
      sidebar={<>hi</>}
      breadcrumbs={[
        { name: intl.formatMessage(breadcrumbs.homepage), url: "/" },
      ]}
    >
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
