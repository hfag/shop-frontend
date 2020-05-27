import React, { ReactNode, FunctionComponent } from "react";
import styled from "styled-components";
import { colors } from "../../utilities/style";

interface IProps {
  padding?: string;
  width?: string;
  height?: string;
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
      : colors.primary}};

	${({ filled, negative }) =>
    filled
      ? `background-color: ${
          negative ? colors.primaryContrast : colors.primary
        };`
      : ""} ${({ width }) => (width ? `width: ${width};` : "")} ${({
  height
}) => (height ? `height: ${height};` : "")} ${({ inline }) =>
  inline ? `display: inline-block;` : ""};

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
