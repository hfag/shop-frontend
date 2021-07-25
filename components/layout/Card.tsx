import React, { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

import { borders, colors, shadows } from "../../utilities/style";

interface IProps {
  mb?: number;
}

const CardWrapper = styled.div<IProps>`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${colors.backgroundOverlay};

  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};
  ${({ mb }) => (mb ? `margin-bottom: ${mb}rem;` : "")}
`;

const Card: FunctionComponent<{
  mb?: number;
  className?: string;
  children: ReactNode;
}> = ({ mb, className, children }) => {
  return (
    <CardWrapper className={className} mb={mb}>
      {children}
    </CardWrapper>
  );
};

export default Card;
