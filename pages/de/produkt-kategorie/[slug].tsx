import { GetStaticPaths, GetStaticProps } from "next";
import request from "../../../utilities/request";
import { GET_ALL_COLLECTIONS, GET_COLLECTION } from "../../../gql/collection";
import { Collection } from "../../../schema";
import { locale } from "../config.json";
import { FunctionComponent } from "react";
import Wrapper from "../../../components/layout/Wrapper";
import ProductCollection from "../../../components/collection/ProductCollection";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { pathnamesByLanguage } from "../../../utilities/urls";

const Page: FunctionComponent<{
  slug: string;
  collectionResponse: { collection: Collection };
}> = ({ slug, collectionResponse }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_COLLECTION, slug],
    (query, collectionId) => request(intl.locale, query, { id: collectionId }),
    {
      initialData: collectionResponse,
    }
  );

  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={
        data
          ? [
              {
                name: data.collection.name,
                url: `/${intl.locale}/${
                  pathnamesByLanguage.productCategory.languages[intl.locale]
                }/${slug}`,
              },
            ]
          : []
      }
    >
      <ProductCollection collection={data?.collection} showDescription={true} />
    </Wrapper>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const data: { collections: { items: Collection[] } } = await request(
    locale,
    GET_ALL_COLLECTIONS
  );

  return {
    paths: data.collections.items.map((collection) => ({
      params: { slug: collection.id },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      slug: context.params.slug,
      collectionResponse: await request(locale, GET_COLLECTION, {
        id: context.params.slug,
      }),
    },
  };
};
