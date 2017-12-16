import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "utilities/style";

const Circle = styled.div`
	padding: ${({ padding }) => (padding ? padding : "0.25rem")};
	border-radius: 50%;
	text-align: center;
	border: ${({ negative }) =>
			negative ? colors.primaryContrast : colors.primary}
		${({ thickness }) => (thickness ? thickness : "1px")} solid;

	color: ${({ filled, negative }) =>
		negative
			? filled ? colors.primary : colors.primaryContrast
			: filled ? colors.primaryContrast : colors.primary}};

	${({ filled, negative }) =>
		filled
			? `background-color: ${
					negative ? colors.primaryContrast : colors.primary
				};`
			: ""} ${({ width }) => (width ? `width: ${width};` : "")} ${({
			height
		}) => (height ? `height: ${height};line-height: ${height};` : "")} ${({
			inline
		}) => (inline ? `display: inline-block;` : "")};
`;

Circle.propTypes = {
	padding: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	negative: PropTypes.bool,
	filled: PropTypes.bool,
	thickness: PropTypes.string,
	children: PropTypes.node
};

export default Circle;
