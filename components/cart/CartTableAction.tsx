import styled from "styled-components";
import { colors } from "../../utilities/style";

const CartTableAction = styled.span`
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: 50% 50%;
  display: inline-block;
  &:hover {
    color: ${colors.danger};
    transform: scale(1.1);
  }
`;

export default CartTableAction;
