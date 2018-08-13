import styled from "styled-components";

import { colors, borders } from "../../utilities/style";

const SidebarBreadcrumb = styled.div`
  padding: 0.25rem;
  color: ${({ active }) => (active ? "#fff" : colors.primary)};
  background-color: ${({ active }) => (active ? colors.primary : "#fff")};
  border-radius: ${borders.radius};

  display: flex;

  & > div:first-child {
    margin-right: 0.25rem;
  }
`;

export default SidebarBreadcrumb;
