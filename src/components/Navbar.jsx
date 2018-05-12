import styled from "styled-components";
import { colors, shadows } from "utilities/style";

const Navbar = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;

	background-color: ${colors.primary};
	color: ${colors.primaryContrast};
	box-shadow: ${shadows.y};
	padding: 1rem 0;
	height: 5rem;

	z-index: 99;
`;

export default Navbar;
