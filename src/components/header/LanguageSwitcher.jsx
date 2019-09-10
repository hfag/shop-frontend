import React, { useMemo } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";

import Link from "../Link";
import { getLanguageFromLocation } from "../../utilities/i18n";
import Flexbar from "../Flexbar";

const LANGUAGES = {
  de: {
    label: "DE"
  },
  fr: {
    label: "FR"
  }
};

const Language = styled.div`
  margin-right: 0.5rem;
`;

const LanguageSwitcher = React.memo(({ dropdown, setDropdown, location }) => {
  const language = useMemo(() => getLanguageFromLocation(location), [location]);

  return (
    <React.Fragment>
      <Flexbar>
        {Object.keys(LANGUAGES).map(languageKey => (
          <Language key={languageKey}>
            <Link
              active={languageKey === language}
              styled={languageKey === language}
              negative
              onClick={() => {
                window.location.href = `/${languageKey}/`; /*`/${languageKey}/${location.pathname
                    .split("/")
                    .slice(2)
                    .join("/")}`;*/
              }}
            >
              {LANGUAGES[languageKey].label}
            </Link>
          </Language>
        ))}
      </Flexbar>
    </React.Fragment>
  );
});

export default withRouter(LanguageSwitcher);
