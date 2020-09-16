import React from "react";
import styled from "styled-components";

const Flexbar = styled.div<{ spaceBetween?: boolean; marginBottom?: number }>`
  position: relative;
  height: 100%;

  display: flex;
  align-items: center;
  align-content: center;

  ${({ spaceBetween }) =>
    spaceBetween ? "justify-content: space-between;" : ""}

  ${({ marginBottom }) =>
    marginBottom ? `margin-bottom: ${marginBottom}rem;` : ""}
`;

export default Flexbar;
