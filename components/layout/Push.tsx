import React, { ReactNode } from "react";
import styled from "@emotion/styled";

interface IProps {
  left?: boolean;
  right?: boolean;
  children?: ReactNode;
}

const Push = styled.div<IProps>`
  ${(props) => (props.left ? "margin-left: auto;" : "")}
  ${(props) => (props.right ? "margin-right: auto;" : "")};
`;

export default Push;
