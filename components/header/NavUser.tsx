import React, { FunctionComponent, useContext } from "react";
import styled from "styled-components";
import { defineMessages, useIntl } from "react-intl";

import StyledLink from "../elements/StyledLink";
import Dropdown from "../elements/Dropdown";
import RestrictedView from "../elements/RestrictedView";
import { pathnamesByLanguage } from "../../utilities/urls";
import Triangle from "../shapes/Triangle";
import userMessages from "../../i18n/user";
import page from "../../i18n/page";
import { AppContext } from "../../pages/_app";

const messages = defineMessages({
  toAccount: {
    id: "NavUser.toAccount",
    defaultMessage: "Zum Konto",
  },
});

const UserDropdown = styled(Dropdown)`
  left: 0;
  right: 0;
`;

const Login = styled.span`
  font-weight: normal;
  white-space: nowrap;
`;

const NavUser: FunctionComponent<{
  dropdown: boolean | string;
  setDropdown: (dropdown: string | boolean) => void;
}> = React.memo(({ dropdown, setDropdown }) => {
  const intl = useIntl();
  const { customer, user } = useContext(AppContext);

  return customer ? (
    <div>
      <StyledLink
        onClick={() => setDropdown(dropdown === "user" ? false : "user")}
        negative
        flex
      >
        <Login>
          {customer.firstName.length > 0 || customer.lastName.length > 0
            ? `${customer.firstName} ${customer.lastName}`
            : customer.emailAddress}
        </Login>
        <Triangle color="#fff" size="0.5rem" />
      </StyledLink>
      {dropdown === "user" && (
        <UserDropdown>
          <div>
            <StyledLink
              href={`/${intl.locale}/${
                pathnamesByLanguage.account.languages[intl.locale]
              }`}
              active={false}
            >
              {intl.formatMessage(messages.toAccount)}
            </StyledLink>
          </div>
          <div>
            <StyledLink
              href={`/${intl.locale}/${
                pathnamesByLanguage.logout.languages[intl.locale]
              }`}
              active={false}
            >
              {intl.formatMessage(userMessages.logout)}
            </StyledLink>
          </div>
        </UserDropdown>
      )}
    </div>
  ) : user ? (
    <div>
      <StyledLink
        onClick={() => setDropdown(dropdown === "user" ? false : "user")}
        negative
        flex
      >
        <Login>{user.identifier}</Login>
        <Triangle color="#fff" size="0.5rem" />
      </StyledLink>
      {dropdown === "user" && (
        <UserDropdown>
          <div>
            <StyledLink external href="https://api.feuerschutz.ch/wp-admin">
              {intl.formatMessage(page.shopAdmin)}
            </StyledLink>
          </div>
          <div>
            <StyledLink
              href={`/${intl.locale}/${
                pathnamesByLanguage.logout.languages[intl.locale]
              }`}
              active={false}
            >
              {intl.formatMessage(userMessages.logout)}
            </StyledLink>
          </div>
        </UserDropdown>
      )}
    </div>
  ) : (
    <StyledLink
      href={`/${intl.locale}/${
        pathnamesByLanguage.login.languages[intl.locale]
      }`}
      negative
      flex
    >
      <Login>{intl.formatMessage(userMessages.login)}</Login>
    </StyledLink>
  );
});

export default NavUser;
