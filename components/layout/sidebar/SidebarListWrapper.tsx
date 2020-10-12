import styled from "styled-components";

import { colors } from "../../../utilities/style";

const SidebarListWrapper = styled.div`
  ul {
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;

    h4 {
      margin: 0;
    }

    li {
      padding: 0.25rem 0;
      border-bottom: #eee 1px solid;
      margin: 0.25rem 0;

      &.header {
        border-bottom-color: ${colors.primary};
      }
    }
  }
`;

export default SidebarListWrapper;
