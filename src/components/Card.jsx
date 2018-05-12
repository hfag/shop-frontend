import React from "react";
import styled from "styled-components";
import { colors, shadows } from "utilities/style";

const CardWrapper = styled.div`
	margin: 1rem 0;
	padding: 1rem;
	background-color: ${colors.backgroundOverlay};
	box-shadow: ${shadows.y};
`;

/**
 * A card component
 * @returns {Component} The component
 */
class Card extends React.PureComponent {
	render = () => {
		return <CardWrapper>{this.props.children}</CardWrapper>;
	};
}

export default Card;
