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
import { AppContext } from "../AppWrapper";

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
  const { user } = useContext(AppContext);

  return user ? (
    <div>
      <StyledLink
        onClick={() => setDropdown(dropdown === "user" ? false : "user")}
        negative
        flex
      >
        <Login>
          {user.firstName.length > 0 || user.lastName.length > 0
            ? `${user.firstName} ${user.lastName}`
            : user.emailAddress}
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
          <RestrictedView>
            <div>
              <StyledLink external href="https://api.feuerschutz.ch/wp-admin">
                {intl.formatMessage(page.shopAdmin)}
              </StyledLink>
            </div>
            <div>
              <StyledLink
                external
                href="https://feuerschutz.ch/wp-login.php?action=login"
              >
                {intl.formatMessage(page.networkAdmin)}
              </StyledLink>
            </div>
          </RestrictedView>
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
