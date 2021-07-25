import { FaChevronDown as ChevronDown } from "react-icons/fa";
import { FunctionComponent, ReactNode } from "react";

import { Product } from "../../../schema";
import { colors } from "../../../utilities/style";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useIntl } from "react-intl";
import SidebarBreadcrumb from "./SidebarBreadcrumb";
import SidebarListWrapper from "./SidebarListWrapper";
import StyledLink from "../../elements/StyledLink";
import product from "../../../i18n/product";
import styled from "@emotion/styled";

const H4 = styled.h4`
  margin: 1rem 0 0 0;
  padding: 0 0 0.5rem 0;
  width: 100%;
  border-bottom: ${colors.primary} 1px solid;
`;

const SidebarProducts: FunctionComponent<{
  products: Product[];
}> = ({ products, children }) => {
  const intl = useIntl();

  if (products.length === 0) {
    return null;
  }

  return (
    <SidebarListWrapper>
      <SidebarBreadcrumb>
        <H4>{intl.formatMessage(product.products)}</H4>
      </SidebarBreadcrumb>
      {products.map((product, index) => (
        <StyledLink
          key={index}
          href={`/${intl.locale}/${
            pathnamesByLanguage.product.languages[intl.locale]
          }/${product.slug}`}
        >
          <SidebarBreadcrumb active={false}>
            <div>{product.name}</div>
          </SidebarBreadcrumb>
        </StyledLink>
      ))}
    </SidebarListWrapper>
  );
};

export default SidebarProducts;
