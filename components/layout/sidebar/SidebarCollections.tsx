import { FunctionComponent, ReactNode } from "react";
import { FaChevronDown as ChevronDown } from "react-icons/fa";

import SidebarListWrapper from "./SidebarListWrapper";
import StyledLink from "../../elements/StyledLink";
import page from "../../../i18n/page";
import SidebarBreadcrumb from "./SidebarBreadcrumb";
import { useIntl } from "react-intl";
import Placeholder from "../../elements/Placeholder";
import { Collection } from "../../../schema";
import styled from "styled-components";
import product from "../../../i18n/product";
import { colors } from "../../../utilities/style";

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
      {collections.map((collection, index) => (
        <SidebarBreadcrumb active={false}>
          <div>{collection.name}</div>
        </SidebarBreadcrumb>
      ))}
    </SidebarListWrapper>
  );
};

export default SidebarCollections;
