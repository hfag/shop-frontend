import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import React, { FunctionComponent, useContext } from "react";
import styled from "@emotion/styled";

import {
  Address as AddressType,
  Order as OrderType,
  Query,
} from "../../schema";
import { AppContext } from "../AppWrapper";
import { GET_CURRENT_CUSTOMER_ORDERS } from "../../gql/user";
import { Unavailable } from "../administrator/Unavailable";
import { pathnamesByLanguage } from "../../utilities/urls";
import Address from "../elements/Address";
import Box from "../layout/Box";
import Flex from "../layout/Flex";
import Order from "../elements/Order";
import Placeholder from "../elements/Placeholder";
import StyledLink from "../elements/StyledLink";
import order from "../../i18n/order";
import request from "../../utilities/request";
import useSWR from "swr";

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
  const { user, customer, token } = useContext(AppContext);
  const intl = useIntl();

  const billing: AddressType | undefined = customer?.addresses.find(
    (a) => a.defaultBillingAddress
  );
  const shipping: AddressType | undefined = customer?.addresses.find(
    (a) => a.defaultShippingAddress
  );

  const { data, error } = useSWR(
    [GET_CURRENT_CUSTOMER_ORDERS, token, 0, 3],
    (query, token, skip, take) =>
      request<{
        activeCustomer: Query["activeCustomer"];
      }>(intl.locale, query, { skip, take })
  );

  if (!customer && user) {
    return (
      <DashboardWrapper>
        <Unavailable />
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <Flex flexWrap="wrap">
        <Box width={[1, 1, 1 / 2, 1 / 2]} paddingRight={3}>
          {customer ? (
            customer.firstName && customer.lastName && customer.emailAddress ? (
              <div>
                <h2 className="no-margin">
                  {customer.firstName} {customer.lastName}
                </h2>
                <div>{customer.emailAddress}</div>
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
            <Box
              width={
                !billing && !shipping ? [1, 1, 1, 1] : [1, 1, 1 / 2, 1 / 2]
              }
              paddingRight={3}
            >
              <h4 className="no-margin">{intl.formatMessage(order.invoice)}</h4>
              {customer ? (
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
            {customer ? (
              shipping && (
                <Box width={[1, 1, 1 / 2, 1 / 2]} paddingRight={3}>
                  <h4 className="no-margin">
                    {intl.formatMessage(order.shipping)}
                  </h4>
                  <Address address={shipping} />
                </Box>
              )
            ) : (
              <Box width={[1, 1, 1 / 2, 1 / 2]} paddingRight={3}>
                <h4 className="no-margin">
                  {intl.formatMessage(order.shipping)}
                </h4>
                <Placeholder block />
              </Box>
            )}
          </Flex>
        </Box>
        <Box width={[1, 1, 1 / 2, 1 / 2]} paddingRight={3}>
          <h2 className="no-margin-top">
            {intl.formatMessage(order.lastThreeOrders)}
          </h2>
          {data?.activeCustomer?.orders.totalItems === 0 && (
            <div>{intl.formatMessage(order.noOrders)}</div>
          )}
          {data?.activeCustomer
            ? data.activeCustomer.orders.items
                .sort(
                  (a: OrderType, b: OrderType) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .map((order: OrderType) => (
                  <Order key={order.id} order={order} compact />
                ))
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
