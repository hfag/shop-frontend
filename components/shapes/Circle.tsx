import { colors } from "../../utilities/style";
import React, { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

interface IProps {
  padding?: string;
  w?: string;
  h?: string;
  negative?: boolean;
  inline?: boolean;
  filled?: boolean;
  thickness?: string;
  centerChildren?: boolean;
}

const CircleWrapper = styled.div<IProps>`
  position: relative;
  padding: ${({ padding }) => (padding ? padding : "0.25rem")};
  border-radius: 50%;
  text-align: center;
  border: ${({ negative }) =>
      negative ? colors.primaryContrast : colors.primary}
    ${({ thickness }) => (thickness ? thickness : "1px")} solid;

  color: ${({ filled, negative }) =>
    negative
      ? filled
        ? colors.primary
        : colors.primaryContrast
      : filled
      ? colors.primaryContrast
      : colors.primary};

  background-color: ${({ filled, negative }) =>
    filled
      ? negative
        ? colors.primaryContrast
        : colors.primary
      : "transparent"};

  width: ${({ w }) => (w ? w : "auto")};
  height: ${({ h }) => (h ? h : "auto")};

  display: ${({ inline }) => (inline ? "inline-block" : "block")};

  ${({ centerChildren }) =>
    centerChildren
      ? `
      & > div{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-51%);
	    }`
      : ""}
`;

const Circle: FunctionComponent<{ children?: ReactNode } & IProps> = (
  props
) => {
  return (
    <CircleWrapper {...props}>
      <div>{props.children}</div>
    </CircleWrapper>
  );
};

export default Circle;
