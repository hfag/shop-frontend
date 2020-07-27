import { GetStaticPaths, GetStaticProps } from "next";
import request from "../../../utilities/request";
import {
  GET_ALL_COLLECTIONS,
  GET_COLLECTION_BY_SLUG,
} from "../../../gql/collection";
import { Collection } from "../../../schema";
import { locale, messages } from "../config.json";
import { FunctionComponent, useMemo } from "react";
import Wrapper from "../../../components/layout/Wrapper";
import ProductCollection from "../../../components/collection/ProductCollection";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { pathnamesByLanguage } from "../../../utilities/urls";
import SidebarCollections from "../../../components/layout/sidebar/SidebarCollections";
import SidebarProducts from "../../../components/layout/sidebar/SidebarProducts";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";
import { withApp } from "../../../components/AppWrapper";

const Page: FunctionComponent<{
  slug: string;
  collectionResponse: { collection: Collection };
}> = ({ slug, collectionResponse }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_COLLECTION_BY_SLUG, slug],
    (query, collectionId) => request(intl.locale, query, { id: collectionId }),
    {
      initialData: collectionResponse,
    }
  );

  const breadcrumbs = useMemo(() => {
    return data
      ? data.collection.breadcrumbs
          .filter(
            (b) =>
              !["1", data.collection.id].includes(
                b.id
              ) /* remove root collection */
          )
          .map((b) => ({
            name: b.name,
            url: `/${intl.locale}/${
              pathnamesByLanguage.productCategory.languages[intl.locale]
            }/${b.slug}`,
          }))
      : [];
  }, [data]);

  return (
    <Wrapper
      sidebar={
        <>
          <SidebarBreadcrumbs breadcrumbs={breadcrumbs}>
            {data ? (
              <SidebarBreadcrumb active>
                {data.collection.name}
              </SidebarBreadcrumb>
            ) : null}
          </SidebarBreadcrumbs>
          <SidebarCollections
            collections={data ? data.collection.children : []}
          />
          <SidebarProducts products={data ? data.collection.products : []} />
        </>
      }
      breadcrumbs={
        data
          ? [
              ...breadcrumbs,
              {
                name: data.collection.name,
                url: `/${intl.locale}/${
                  pathnamesByLanguage.productCategory.languages[intl.locale]
                }/${data.collection.slug}`,
              },
            ]
          : breadcrumbs
      }
    >
      <ProductCollection collection={data?.collection} showDescription={true} />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

export const getStaticPaths: GetStaticPaths = async () => {
  const data: { collections: { items: Collection[] } } = await request(
    locale,
    GET_ALL_COLLECTIONS
  );

  return {
    paths: data.collections.items
      .filter((p) => p.translations.find((t) => t.languageCode === locale))
      .map((collection) => ({
        params: {
          slug: collection.translations.find((t) => t.languageCode === locale)
            .slug,
        },
      })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      slug: context.params.slug,
      collectionResponse: await request(locale, GET_COLLECTION_BY_SLUG, {
        slug: context.params.slug,
      }),
    },
  };
};
