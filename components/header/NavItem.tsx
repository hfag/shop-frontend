import { colors } from "../../utilities/style";
import styled from "@emotion/styled";

interface IProps {
  seperator?: boolean;
}

const NavItem = styled.div<IProps>`
  position: relative;

  height: 100%;

  margin-right: 0.75rem;
  padding-right: 0.8rem;

  display: inline-block;

  &:after {
    position: absolute;
    top: 50%;
    right: 0;
    height: 2.5rem;

    transform: translateY(-50%);

    content: "";
    display: block;
    ${({ seperator }) =>
      seperator ? `border-right: ${colors.primaryContrast} 1px solid;` : ""};
  }

  img {
    height: 100%;
    /*width: auto;*/
    max-width: none;
  }
`;

export default NavItem;
