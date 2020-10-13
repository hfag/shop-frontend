import React from "react";
import styled from "@emotion/styled";
import Color from "color";

import { colors } from "../../utilities/style";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  thead {
    border-bottom: ${Color(colors.background).darken(0.2).rgb().string()} 2px
      solid;
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
