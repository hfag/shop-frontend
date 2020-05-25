import React from "react";
import styled from "styled-components";
import { defineMessages, useIntl } from "react-intl";

import Link from "../Link";
import Dropdown from "../Dropdown";
import RestrictedView from "../../containers/RestrictedView";
import { pathnamesByLanguage } from "../../utilities/urls";
import Triangle from "../Triangle";
import user from "../../i18n/user";
import page from "../../i18n/page";

const messages = defineMessages({
  toAccount: {
    id: "NavUser.toAccount",
    defaultMessage: "Zum Konto"
  }
});

const UserDropdown = styled(Dropdown)`
  left: 0;
  right: 0;
`;

const Login = styled.span`
  font-weight: normal;
  white-space: nowrap;
`;

const NavUser = React.memo(
  ({ language, account, isAuthenticated, dropdown, setDropdown }) => {
    const intl = useIntl();

    return isAuthenticated ? (
      <div>
        <Link
          onClick={() => setDropdown(dropdown === "user" ? false : "user")}
          negative
          flex
        >
          <Login>
            {account.firstName.length > 0 || account.lastName.length > 0
              ? `${account.firstName} ${account.lastName}`
              : account.email}
          </Login>
          <Triangle color="#fff" size="0.5rem" />
        </Link>
        {dropdown === "user" && (
          <UserDropdown>
            <div>
              <Link
                to={`/${language}/${pathnamesByLanguage[language].account}`}
                active={false}
              >
                {intl.formatMessage(messages.toAccount)}
              </Link>
            </div>
            <RestrictedView>
              <div>
                <Link href="https://api.feuerschutz.ch/wp-admin">
                  {intl.formatMessage(page.shopAdmin)}
                </Link>
              </div>
              <div>
                <Link href="https://feuerschutz.ch/wp-login.php?action=login">
                  {intl.formatMessage(page.networkAdmin)}
                </Link>
              </div>
            </RestrictedView>
            <div>
              <Link
                to={`/${language}/${pathnamesByLanguage[language].logout}`}
                active={false}
              >
                {intl.formatMessage(user.logout)}
              </Link>
            </div>
          </UserDropdown>
        )}
      </div>
    ) : (
      <Link
        to={`/${language}/${pathnamesByLanguage[language].login}`}
        negative
        flex
      >
        <Login>{intl.formatMessage(user.login)}</Login>
      </Link>
    );
  }
);

export default NavUser;
