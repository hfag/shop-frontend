import React from "react";
import styled from "styled-components";

import Link from "../Link";
import Dropdown from "../Dropdown";
import RestrictedView from "../../containers/RestrictedView";

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
              <Link to={`/${language}/konto`} active={false}>
                Zum Konto
              </Link>
            </div>
            <RestrictedView>
              <div>
                <Link href="https://api.feuerschutz.ch/wp-admin">
                  Shop-Admin
                </Link>
              </div>
              <div>
                <Link href="https://feuerschutz.ch/wp-login.php?action=login">
                  Netzwerk-Admin
                </Link>
              </div>
            </RestrictedView>
            <div>
              <Link to={`/${language}/logout`} active={false}>
                Abmelden
              </Link>
            </div>
          </UserDropdown>
        )}
      </div>
    ) : (
      <Link to={`/${language}/login`} negative flex>
        <Login>Login</Login>
      </Link>
    );
  }
);

export default NavUser;
