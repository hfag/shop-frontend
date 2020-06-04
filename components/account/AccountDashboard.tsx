import React, { FunctionComponent, useContext } from "react";
import { Flex, Box } from "reflexbox";
import styled from "styled-components";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import order from "../../i18n/order";
import { AppContext } from "../../pages/_app";
import { pathnamesByLanguage } from "../../utilities/urls";
import StyledLink from "../elements/StyledLink";
import { Address as AddressType, Node, Order as OrderType } from "../../schema";
import Link from "next/link";
import Address from "../elements/Address";
import Order from "../elements/Order";
import useSWR from "swr";
import { GET_CURRENT_CUSTOMER_ORDERS } from "../../gql/user";
import request from "../../utilities/request";
import Placeholder from "../elements/Placeholder";

const messages = defineMessages({
  here: {
    id: "AccountDashboard.here",
    defaultMessage: "hier",
  },
});

const DashboardWrapper = styled.div`
  .no-margin {
    margin: 0;
  }
  .no-margin-top {
    margin-top: 0;
  }
`;

const AccountDashboard: FunctionComponent<{}> = React.memo(() => {
  const { user, token } = useContext(AppContext);
  const intl = useIntl();

  const billing: AddressType | undefined = user?.addresses.find(
    (a) => a.defaultBillingAddress
  );
  const shipping: AddressType | undefined = user?.addresses.find(
    (a) => a.defaultShippingAddress
  );

  const {
    data,
    error,
  }: {
    data?: {
      activeCustomer: { orders: { items: OrderType[]; totalItems: number } };
    };
    error?: any;
  } = useSWR(
    [GET_CURRENT_CUSTOMER_ORDERS, token, 0, 3],
    (query, token, skip, take) => request(intl.locale, query, { skip, take })
  );

  return (
    <DashboardWrapper>
      <Flex flexWrap="wrap">
        <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
          {user ? (
            user.firstName && user.lastName && user.emailAddress ? (
              <div>
                <h2 className="no-margin">
                  {user.firstName} {user.lastName}
                </h2>
                <div>{user.emailAddress}</div>
              </div>
            ) : (
              <div>
                <FormattedMessage
                  id="AccountDashboard.provideName"
                  defaultMessage="Wir wissen noch nicht viel über Sie. Wenn Sie mit Ihrem Namen angesprochen werden möchten, können Sie {here} Ihren Namen hinterlegen."
                  values={{
                    here: (
                      <StyledLink
                        href={`/${intl.locale}/${
                          pathnamesByLanguage.account.languages[intl.locale]
                        }/${
                          pathnamesByLanguage.account.pathnames.details
                            .languages[intl.locale]
                        }`}
                      >
                        {intl.formatMessage(messages.here)}
                      </StyledLink>
                    ),
                  }}
                />
              </div>
            )
          ) : (
            <div>
              <h2 className="no-margin">
                <Placeholder height={5} text />
              </h2>
            </div>
          )}
          <br />
          <Flex flexWrap="wrap">
            <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
              <h4 className="no-margin">{intl.formatMessage(order.invoice)}</h4>
              {user ? (
                !billing ? (
                  <div>
                    <FormattedMessage
                      id="AccountDashboard.provideAddress"
                      defaultMessage="Sie haben noch keine Rechnungsaddresse hinterlegt. Falls sie möchten dass diese bei jeder Bestellung von selbst ausgefüllt wird, fügen Sie {here} eine hinzu."
                      values={{
                        here: (
                          <StyledLink
                            href={`/${intl.locale}/${
                              pathnamesByLanguage.account.languages[intl.locale]
                            }/${
                              pathnamesByLanguage.account.pathnames.address
                                .languages[intl.locale]
                            }/`}
                          >
                            {intl.formatMessage(messages.here)}
                          </StyledLink>
                        ),
                      }}
                    />
                  </div>
                ) : (
                  <Address address={billing} />
                )
              ) : (
                <Placeholder block />
              )}
            </Box>
            {user ? (
              shipping && (
                <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                  <h4 className="no-margin">
                    {intl.formatMessage(order.shipping)}
                  </h4>
                  <Address address={shipping} />
                </Box>
              )
            ) : (
              <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                <h4 className="no-margin">
                  {intl.formatMessage(order.shipping)}
                </h4>
                <Placeholder block />
              </Box>
            )}
          </Flex>
        </Box>
        <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
          <h2 className="no-margin-top">
            {intl.formatMessage(order.lastThreeOrders)}
          </h2>
          {data?.activeCustomer.orders.totalItems === 0 && (
            <div>{intl.formatMessage(order.noOrders)}</div>
          )}
          {data
            ? data.activeCustomer.orders.items
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((order) => <Order key={order.id} order={order} compact />)
            : new Array(3)
                .fill(undefined)
                .map((_, index) => (
                  <Order key={index} order={undefined} compact />
                ))}
        </Box>
      </Flex>
    </DashboardWrapper>
  );
});

export default AccountDashboard;
