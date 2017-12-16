import styled from "styled-components";

import { colors, shadows } from "utilities/style";

const Navbar = styled.div`
	position: relative;
	background-color: ${colors.primary};
	color: ${colors.primaryContrast};
	box-shadow: ${shadows.y};
	padding: 1rem 0;
	height: 5rem;
`;

export default Navbar;
