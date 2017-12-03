import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "style-utilities";

const Circle = styled.div`
	padding: ${({ padding }) => (padding ? padding : "0.25rem")};
	border-radius: 50%;
	border: ${({ negative }) =>
			negative ? colors.primaryContrast : colors.primary}
		${({ thickness }) => (thickness ? thickness : "1px")} solid;
`;

Circle.propTypes = {
	padding: PropTypes.string,
	negative: PropTypes.bool,
	thickness: PropTypes.string,
	children: PropTypes.node
};

export default Circle;
