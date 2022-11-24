import { defineMessages, useIntl } from "react-intl";
import React, { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

import { ABSOLUTE_URL } from "../../utilities/api";
import { pathnamesByLanguage } from "../../utilities/urls";
import Box from "../layout/Box";
import Card from "../layout/Card";
import Flex from "../layout/Flex";
import Head from "next/head";
import StyledLink from "../elements/StyledLink";
import order from "../../i18n/order";
import userMessages from "../../i18n/user";

const messages = defineMessages({
  siteTitle: {
    id: "Account.siteTitle",
    defaultMessage: "Mein Kundenkonto bei der Hauser Feuerschutz AG",
  },
  siteDescription: {
    id: "Account.siteDescription",
    defaultMessage:
      "Verwalten Sie hier Ihr Kundenkonto bei der Hauser Feuerschutz AG. Beispielsweise können Sie die Lieferadresse anpassen.",
  },
  myAccount: {
    id: "Account.myAccount",
    defaultMessage: "Mein Kundenkonto",
  },
  overview: {
    id: "Account.overview",
    defaultMessage: "Übersicht",
  },
  details: {
    id: "Account.details",
    defaultMessage: "Details",
  },
  addresses: {
    id: "Account.addresses",
    defaultMessage: "Adressen",
  },
});

const ProfileNavigation = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;

  border: #eee 1px solid;
  border-radius: 5px;

  li {
    padding: 0.25rem 0.5rem;
    border-bottom: #eee 1px solid;

    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const AccountContainer = styled.div`
  h1 {
    margin-top: 0;
  }
`;

/**
 * The account wrapper
 */
const AccountWrapper: FunctionComponent<{ children: ReactNode }> = React.memo(
  ({ children }) => {
    const intl = useIntl();

    return (
      <AccountContainer>
        <Head>
          <title>
            {`${intl.formatMessage(
              messages.siteTitle
            )} - Hauser Feuerschutz AG`}
          </title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${intl.locale}/${
              pathnamesByLanguage.account.languages[intl.locale]
            }`}
          />
        </Head>
        <Flex flexWrap="wrap">
          <Box
            widths={[1, 1, 1 / 2, 1 / 3, 1 / 3]}
            paddingRight={1 /* TODO: [0, 4, 4, 4] */}
          >
            <Card>
              <h1>{intl.formatMessage(messages.myAccount)}</h1>
              <ProfileNavigation>
                <li>
                  <StyledLink
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.account.languages[intl.locale]
                    }`}
                  >
                    {intl.formatMessage(messages.overview)}
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.account.languages[intl.locale]
                    }/${
                      pathnamesByLanguage.account.pathnames.details.languages[
                        intl.locale
                      ]
                    }`}
                  >
                    {intl.formatMessage(messages.details)}
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.account.languages[intl.locale]
                    }/${
                      pathnamesByLanguage.account.pathnames.address.languages[
                        intl.locale
                      ]
                    }`}
                  >
                    {intl.formatMessage(messages.addresses)}
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.account.languages[intl.locale]
                    }/${
                      pathnamesByLanguage.account.pathnames.orders.languages[
                        intl.locale
                      ]
                    }`}
                  >
                    {intl.formatMessage(order.orders)}
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.logout.languages[intl.locale]
                    }`}
                  >
                    {intl.formatMessage(userMessages.logout)}
                  </StyledLink>
                </li>
              </ProfileNavigation>
            </Card>
          </Box>
          <Box widths={[1, 1, 1 / 2, 2 / 3, 2 / 3]}>
            <Card>{children}</Card>
          </Box>
        </Flex>
      </AccountContainer>
    );
  }
);

export default AccountWrapper;
