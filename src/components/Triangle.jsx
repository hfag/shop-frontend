import React from "react";
import styled from "styled-components";

export default styled.div`
  margin: 0 0.5rem;
  width: 0;
  height: 0;
  border-left: ${({ size }) => size} solid transparent;
  border-right: ${({ size }) => size} solid transparent;

  border-top: ${({ color, size }) => color + " " + size} solid;
`;
