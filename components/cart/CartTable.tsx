import styled from "styled-components";
import { colors } from "../../utilities/style";
import Table from "../elements/Table";
import { FunctionComponent, ReactNode } from "react";

const StyledCartTable = styled(Table)<{ actions?: boolean }>`
  table-layout: auto;

  col.image {
    width: 10%;
  }
  col.description {
    width: 35%;
  }
  col.sku {
    width: 20%;
  }
  col.price {
    width: 10%;
  }
  col.quantity {
    width: 10%;
  }
  col.subtotal {
    width: ${({ actions }) => (actions ? "10%" : "15%")};
  }
  col.actions {
    width: ${({ actions }) => (actions ? "5%" : "0")};
  }

  h4 {
    margin: 0 0 0.25rem 0;
  }

  tr.total {
    border-top: ${colors.secondary} 1px solid;
    font-weight: bold;
  }
`;

const TableScroll = styled.div`
  max-width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const CartTable: FunctionComponent<{
  actions?: boolean;
  children: ReactNode;
}> = ({ actions, children }) => {
  return (
    <TableScroll>
      <StyledCartTable actions={actions}>{children}</StyledCartTable>
    </TableScroll>
  );
};

export default CartTable;
