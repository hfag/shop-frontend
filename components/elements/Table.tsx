import React from "react";
import styled from "@emotion/styled";

import { colors } from "../../utilities/style";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  thead {
    border-bottom: ${colors.backgroundDark} 2px solid;
    text-align: left;
  }
  tbody {
    background-color: ${colors.background};
  }

  td,
  th {
    padding: 0.5rem;
  }
`;

export default Table;
