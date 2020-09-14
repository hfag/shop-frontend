import styled from "styled-components";
import { colors } from "../utilities/style";

const ActionButton = styled.span<{
  marginLeft?: number;
  hoverColor?: string;
}>`
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: 50% 50%;
  display: inline-block;
  ${({ marginLeft }) => (marginLeft ? `margin-left:${marginLeft}rem;` : "")}

  &:hover {
    color: ${({ hoverColor }) => (hoverColor ? hoverColor : colors.danger)};
  }
`;

export default ActionButton;
