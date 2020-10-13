import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { borders, colors } from "../utilities/style";
import UnsafeHTMLContent from "./content/UnsafeHTMLContent";
import { Page, WP_Page, mapPage } from "../utilities/wordpress";
import { getWordpressUrl } from "../utilities/api";
import { useIntl } from "react-intl";
import useSWR from "swr";
import Placeholder from "./elements/Placeholder";

const InlinePageContainer = styled.div`
  max-height: 200px;
  background-color: #eee;
  overflow: scroll;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: ${borders.radius};
  border: ${colors.secondary} 1px solid;
`;

const InlinePage: FunctionComponent<{ slug: string }> = ({ slug }) => {
  const intl = useIntl();

  const { data: page, error } = useSWR(
    `${getWordpressUrl(intl.locale)}/wp-json/wp/v2/pages?slug=${slug}`,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((pages: WP_Page[]) => mapPage(pages[0]))
  );

  return (
    <InlinePageContainer>
      {page ? (
        <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
      ) : (
        <Placeholder text height={3} />
      )}
      {page ? (
        <UnsafeHTMLContent content={page.content} />
      ) : (
        <Placeholder text height={15} />
      )}
    </InlinePageContainer>
  );
};

export default InlinePage;
