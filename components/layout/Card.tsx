import React, { FunctionComponent, ReactNode } from "react";
import styled from "styled-components";

import { colors, borders, shadows } from "../../utilities/style";

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

const Card: FunctionComponent<{ mb?: number; children: ReactNode }> = ({
  mb,
  children,
}) => {
  return <CardWrapper mb={mb}>{children}</CardWrapper>;
};

export default Card;
