import { ABSOLUTE_URL } from "../utilities/api";
import { Page as PageType } from "../utilities/wordpress";
import { pathnamesByLanguage } from "../utilities/urls";
import { stripTags } from "../utilities/decode";
import { useIntl } from "react-intl";
import Block from "./content/Block";
import Card from "./layout/Card";
import H1 from "./elements/H1";
import Head from "next/head";
import Placeholder from "./elements/Placeholder";
import React, { FunctionComponent, useEffect } from "react";
import UnsafeHTMLContent from "./content/UnsafeHTMLContent";

const Page: FunctionComponent<{ page?: PageType }> = React.memo(({ page }) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <Head>
        <title>{stripTags(page.title)} - Hauser Feuerschutz AG</title>
        <meta name="description" content={stripTags(page.excerpt)} />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.post[intl.locale]
          }/${page.slug}`}
        />
      </Head>
      <Card>
        {page ? (
          <H1 dangerouslySetInnerHTML={{ __html: page.title }} />
        ) : (
          <Placeholder text height={3} />
        )}
        {page && page.blocks ? (
          page.blocks.map((block, index) => (
            <Block key={index} block={block}></Block>
          ))
        ) : (
          <Placeholder text height={15} />
        )}
      </Card>
    </React.Fragment>
  );
});

export default Page;
