import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "style-utilities";

const NavItem = styled.div`
	height: 100%;
	width: auto;
	padding-right: 0.75rem;
	${({ seperator }) =>
		seperator
			? `border-right: ${colors.primaryContrast} 1px solid;`
			: ""} margin-right: 0.75rem;
	display: inline-block;

	overflow: hidden;

	img,
	svg {
		height: 100%;
		width: auto;
	}
`;

NavItem.propTypes = {
	seperator: PropTypes.bool
};

export default NavItem;
