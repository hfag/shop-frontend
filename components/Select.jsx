import React from "react";
import styled from "styled-components";
import Select from "react-select";

import { colors, borders } from "../utilities/style";

export default styled(Select)`
  .Select-control {
    border: ${colors.secondary} 1px solid;
    border-radius: ${borders.inputRadius};

    color: ${colors.secondary};
  }
`;
