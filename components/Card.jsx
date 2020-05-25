import React from "react";
import styled from "styled-components";

import { colors, borders, shadows } from "../utilities/style";

const CardWrapper = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${colors.backgroundOverlay};

  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};
`;

/**
 * A card component
 * @returns {Component} The component
 */
class Card extends React.PureComponent {
  render = () => {
    return <CardWrapper {...this.props}>{this.props.children}</CardWrapper>;
  };
}

export default Card;
