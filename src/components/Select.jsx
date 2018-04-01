import React from "react";
import styled from "styled-components";

import { colors } from "utilities/style";

import Select from "react-select";

export default styled(Select)`
	.Select-control {
		border: ${colors.secondary} 1px solid;
		border-radius: 0;

		color: ${colors.secondary};
	}
`;
