import React from "react";
import styled from "styled-components";
import { colors } from "utilities/style";

const Breadcrumb = styled.div`
	position: relative;
	display: inline-block;
	margin: 0 1rem 0 0;

	& > div {
		color: ${colors.fontLight};
	}

	&:after {
		position: absolute;
		top: 0;
		right: -0.6rem;

		content: "/";
		display: inline-block;
		color: ${colors.primary};
	}

	&:last-child {
		font-weight: bold;

		& > div {
			color: ${colors.primary};
		}

		:after {
			content: "";
		}
	}
`;

export default Breadcrumb;
