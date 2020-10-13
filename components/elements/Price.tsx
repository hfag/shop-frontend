import React, { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

interface IProps {
  strike?: boolean;
}

const StyledPrice = styled.span<IProps>`
  text-decoration: ${({ strike }) => (strike ? "line-through" : "none")};
  white-space: nowrap;
`;

const Price: FunctionComponent<{
  children: number;
  strike?: boolean;
}> = React.memo(({ strike, children }) => {
  return (
    <StyledPrice strike={strike}>
      CHF {(Math.round(children) / 100).toFixed(2)}
    </StyledPrice>
  );
});

export default Price;
