import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { useIntl } from "react-intl";
import Flexbar from "../layout/Flexbar";
import Link from "../elements/StyledLink";

const LANGUAGES = {
  de: {
    label: "DE",
  },
  fr: {
    label: "FR",
  },
};

const Language = styled.div`
  margin-right: 0.5rem;
`;

const LanguageSwitcher: FunctionComponent<{}> = React.memo(() => {
  const intl = useIntl();

  return (
    <>
      <Flexbar>
        {Object.keys(LANGUAGES).map((languageKey) => (
          <Language key={languageKey}>
            <Link
              active={languageKey === intl.locale}
              underlined={languageKey === intl.locale}
              negative
              onClick={() => {
                window.location.href = `/${languageKey}`; /*`/${languageKey}/${location.pathname
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
    </>
  );
});

export default LanguageSwitcher;
