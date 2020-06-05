import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { useIntl } from "react-intl";
import { Order as OrderType } from "../../schema";
import orderMessages from "../../i18n/order";
import Table from "../elements/Table";
import Price from "../elements/Price";
import StyledLink from "../elements/StyledLink";
import { pathnamesByLanguage } from "../../utilities/urls";
import Placeholder from "../elements/Placeholder";

const OrdersWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const AccountOrders: FunctionComponent<{ orders?: OrderType[] }> = React.memo(
  ({ orders }) => {
    const intl = useIntl();

    return (
      <OrdersWrapper>
        <h2>{intl.formatMessage(orderMessages.orders)}</h2>
        {orders && orders.length === 0 && (
          <div>{intl.formatMessage(orderMessages.noOrders)}</div>
        )}
        <Table>
          <thead>
            <tr>
              <th>{intl.formatMessage(orderMessages.orderNumber)}</th>
              <th>{intl.formatMessage(orderMessages.total)}</th>
              <th>{intl.formatMessage(orderMessages.orderDate)}</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((order) => (
                  <tr>
                    <td>
                      <StyledLink
                        href={`/${intl.locale}/${
                          pathnamesByLanguage.account.languages[intl.locale]
                        }/${
                          pathnamesByLanguage.account.pathnames.orders
                            .languages[intl.locale]
                        }/${order.code}`}
                        underlined
                      >
                        {order.code}
                      </StyledLink>
                    </td>
                    <td>
                      <Price>{order.total}</Price>
                    </td>
                    <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              : new Array(3).fill(undefined).map((_) => (
                  <tr>
                    <td>
                      <Placeholder height={1} text />
                    </td>
                    <td>
                      <Placeholder height={1} text />
                    </td>
                    <td>
                      <Placeholder height={1} text />
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </OrdersWrapper>
    );
  }
);

export default AccountOrders;
