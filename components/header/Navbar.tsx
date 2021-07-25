import { colors, shadows } from "../../utilities/style";
import styled from "@emotion/styled";

const Navbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  background-color: ${colors.primary};
  color: ${colors.primaryContrast};
  border-bottom: ${colors.primaryContrast} 1px solid;
  box-shadow: ${shadows.y};

  padding: 1rem 0;
  height: 5rem;

  z-index: 99;

  & > * {
    height: 100%;
  }
`;

export default Navbar;
