import React from "react";
import styled from "@emotion/styled";

interface IProps {
  size: string;
  color: string;
}

export default styled.div<IProps>`
  margin: 0 0.5rem;
  width: 0;
  height: 0;
  border-left: ${({ size }) => size} solid transparent;
  border-right: ${({ size }) => size} solid transparent;

  border-top: ${({ color, size }) => color + " " + size} solid;
`;
