import React, { FunctionComponent } from "react";
import styled from "styled-components";

import { borders, colors } from "../utilities/style";
import UnsafeHTMLContent from "./content/UnsafeHTMLContent";

const InlinePageContainer = styled.div`
  max-height: 200px;
  background-color: #eee;
  overflow: scroll;
  padding: 0 1rem;
  margin-bottom: 1rem;
  border-radius: ${borders.radius};
  border: ${colors.secondary} 1px solid;
`;

const InlinePage: FunctionComponent<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  return (
    <InlinePageContainer>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
      <UnsafeHTMLContent content={content} />
    </InlinePageContainer>
  );
};

export default InlinePage;
