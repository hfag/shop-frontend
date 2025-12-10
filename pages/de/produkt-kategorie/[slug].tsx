import { Collection, Query } from "../../../schema";
import {
  GET_COLLECTION_BY_SLUG,
  GET_COLLECTION_SLUGS,
} from "../../../gql/collection";
import { GetStaticPaths, GetStaticProps } from "next";
import { locale, messages } from "../config";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../../components/AppWrapper";
import ProductCollection from "../../../components/collection/ProductCollection";
import React, { FunctionComponent, useMemo } from "react";
import SidebarBreadcrumb from "../../../components/layout/sidebar/SidebarBreadcrumb";
import SidebarBreadcrumbs from "../../../components/layout/sidebar/SidebarBreadcrumbs";
import SidebarCollections from "../../../components/layout/sidebar/SidebarCollections";
import SidebarProducts from "../../../components/layout/sidebar/SidebarProducts";
import Wrapper from "../../../components/layout/Wrapper";
import request from "../../../utilities/request";
import useSWR from "swr";

const Page: FunctionComponent<{
  slug: string;
  collectionResponse: { collection: Collection };
}> = ({ slug, collectionResponse }) => {
  const intl = useIntl();

  const { data /*, error*/ } = useSWR(
    [GET_COLLECTION_BY_SLUG, slug],
    ([query, slug]) =>
      request<{ collection: Query["collection"] }>(intl.locale, query, {
        slug,
      }),
    {
      fallbackData: collectionResponse,
    }
  );

  const breadcrumbs = useMemo(() => {
    const collection = data?.collection;

    return collection
      ? collection.breadcrumbs
          .filter(
            (b) =>
              !["1", collection.id].includes(b.id) /* remove root collection */
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
              <>
                <SidebarBreadcrumb active>
                  {data.collection?.name}
                </SidebarBreadcrumb>
                <SidebarCollections
                  collections={data.collection?.children || []}
                />
                <SidebarProducts products={data.collection?.products || []} />
              </>
            ) : null}
          </SidebarBreadcrumbs>
        </>
      }
      breadcrumbs={
        data?.collection
          ? [
              ...breadcrumbs,
              {
                name: data.collection.name,
                url: `/${intl.locale}/${
                  pathnamesByLanguage.productCategory.languages[intl.locale]
                }/${data.collection?.slug}`,
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
  const data: { collections: Query["collections"] } = await request(
    locale,
    GET_COLLECTION_SLUGS,
    { options: { take: 100, skip: 0 } }
  );
  const { items, totalItems }: { items: Collection[]; totalItems: number } =
    data.collections;

  while (items.length < totalItems) {
    const data: { collections: Query["collections"] } = await request(
      locale,
      GET_COLLECTION_SLUGS,
      { options: { take: 100, skip: items.length } }
    );

    items.push(...data.collections.items);
  }

  return {
    paths: items.map((collection) => ({
      params: { slug: collection.slug },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const collectionResponse = await request<{ collection: Query["collection"] }>(
    locale,
    GET_COLLECTION_BY_SLUG,
    {
      slug: context.params?.slug,
    }
  );

  return {
    revalidate: 60 * 60 * 12,
    notFound: collectionResponse?.collection ? false : true,
    props: {
      slug: context.params?.slug,
      collectionResponse,
    },
  };
};
