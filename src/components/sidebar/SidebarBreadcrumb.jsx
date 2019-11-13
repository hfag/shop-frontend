import styled from "styled-components";

import { colors, borders } from "../../utilities/style";

const SidebarBreadcrumb = styled.div`
  padding: 0.25rem;
  color: ${({ active }) => (active ? colors.primary : colors.primaryContrast)};
  background-color: ${({ active }) =>
    active ? colors.primaryContrast : colors.primary};
  border-radius: ${borders.radius};

  display: flex;

  svg {
    position: relative;
    top: 50%;
    transform: translateY(-50%);

    width: 0.75rem;
    height: auto;
    max-height: 0.75rem; /*IE11*/
    vertical-align: top !important;
    margin-right: 0.2rem;
  }

  & > div:first-child {
    margin-right: 0.25rem;
  }
`;

export default SidebarBreadcrumb;
