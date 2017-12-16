import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import { colors } from "utilities/style";

const pulse = keyframes`
	0%{
		opacity: 0.3;
	}
	50%{
		opacity: 0.2
	};
	100%{
		opacity: 0.3;
	}
`;

const Placeholder = styled.div`
	background-color: ${({ error }) => (error ? colors.danger : colors.font)};

	padding-top: ${({ block }) => (block ? "100%" : "0")};
	height: ${({ text }) => (text ? "1rem" : "")};

	margin-bottom: ${({ text }) => (text ? "0.25rem" : "")};

	opacity: 0.3;

	animation: ${pulse} 1s ease-in-out infinite;
`;

Placeholder.propTypes = {
	error: PropTypes.bool,
	block: PropTypes.bool,
	text: PropTypes.bool
};

export default Placeholder;
