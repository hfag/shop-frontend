import React, { useMemo } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";

import Dropdown from "../Dropdown";
import Link from "../Link";
import Triangle from "../Triangle";
import { getLanguageFromLocation } from "../../utilities/i18n";

const LanguageSelection = styled(Dropdown)`
  left: -1rem;
  right: -1rem;
`;

const CurrentLanguage = styled.div``;

const LANGUAGES = {
  de: {
    label: "Deutsch"
  },
  fr: {
    label: "Français"
  }
};

const LanguageSwitcher = React.memo(({ dropdown, setDropdown, location }) => {
  const language = useMemo(() => getLanguageFromLocation(location), [location]);

  return (
    <React.Fragment>
      <Link
        onClick={() =>
          setDropdown(dropdown === "language" ? false : "language")
        }
        negative
        flex
      >
        <CurrentLanguage>{LANGUAGES[language].label}</CurrentLanguage>
        <Triangle color="#fff" size="0.5rem" />
      </Link>
      {dropdown === "language" && (
        <LanguageSelection>
          {Object.keys(LANGUAGES)
            .filter(languageKey => languageKey !== language)
            .map(languageKey => (
              <div key={languageKey}>
                <Link
                  onClick={() => {
                    window.location.href = `/${languageKey}/`; /*`/${languageKey}/${location.pathname
                    .split("/")
                    .slice(2)
                    .join("/")}`;*/
                  }}
                >
                  {LANGUAGES[languageKey].label}
                </Link>
              </div>
            ))}
        </LanguageSelection>
      )}
    </React.Fragment>
  );
});

export default withRouter(LanguageSwitcher);
