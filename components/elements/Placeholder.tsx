import { keyframes } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";

import { borders, colors } from "../../utilities/style";

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

interface IProps {
  error?: boolean; //defaults to false
  block?: boolean; //defaults to false
  inline?: boolean; //defaults to false
  text?: boolean; //defaults to false
  height?: number;
  mb?: number;
  mr?: number;
  minWidth?: number;
}

const Placeholder = styled.div<IProps>`
  background-color: ${({ error }) => (error ? colors.danger : colors.font)};
  border-radius: ${borders.radius};

  padding-top: ${({ block }) => (block ? "100%" : "0")};
  height: ${({ height, text }) =>
    height ? height + "rem" : text ? "1rem" : ""};

  margin-bottom: ${({ mb }) => (mb ? mb + "rem" : "")};
  margin-right: ${({ mr }) => (mr ? mr + "rem" : "")};

  display: ${({ inline }) => (inline ? "inline-block" : "block")};

  min-width: ${({ minWidth }) => (minWidth ? minWidth + "rem" : "0")};

  opacity: 0.3;

  animation: ${pulse} 1s ease-in-out infinite;
`;

export default Placeholder;
