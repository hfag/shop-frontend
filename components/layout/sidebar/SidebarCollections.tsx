import { FaChevronDown as ChevronDown } from "react-icons/fa";
import React, { FunctionComponent, ReactNode } from "react";

import { Collection } from "../../../schema";
import { colors } from "../../../utilities/style";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useIntl } from "react-intl";
import Placeholder from "../../elements/Placeholder";
import SidebarBreadcrumb from "./SidebarBreadcrumb";
import SidebarListWrapper from "./SidebarListWrapper";
import StyledLink from "../../elements/StyledLink";
import page from "../../../i18n/page";
import product from "../../../i18n/product";
import styled from "@emotion/styled";

const H4 = styled.h4`
  margin: 1rem 0 0 0;
  padding: 0 0 0.5rem 0;
  width: 100%;
  border-bottom: ${colors.primary} 1px solid;
`;

const SidebarCollections: FunctionComponent<{
  collections: Collection[];
}> = ({ collections, children }) => {
  const intl = useIntl();

  if (collections.length === 0) {
    return null;
  }

  return (
    <SidebarListWrapper>
      <SidebarBreadcrumb>
        <H4>{intl.formatMessage(product.categories)}</H4>
      </SidebarBreadcrumb>
      <ul>
        {collections
          .sort((a, b) => a.position - b.position)
          .map((collection, index) => (
            <li key={index}>
              <SidebarBreadcrumb active={false}>
                <StyledLink
                  href={`/${intl.locale}/${
                    pathnamesByLanguage.productCategory.languages[intl.locale]
                  }/${collection.slug}`}
                >
                  {collection.name}
                </StyledLink>
              </SidebarBreadcrumb>
            </li>
          ))}
      </ul>
    </SidebarListWrapper>
  );
};

export default SidebarCollections;
