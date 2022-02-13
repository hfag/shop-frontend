import { IntlShape, defineMessages, useIntl } from "react-intl";
import { MdMenu } from "react-icons/md";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "@emotion/styled";

import { ABSOLUTE_URL, WP_BLOG_URL } from "../../utilities/api";
import { AppContext } from "../AppWrapper";
import { BUSINESS_JSON_LD } from "../../utilities/json-ld";
import { colors } from "../../utilities/style";
import Box from "../layout/Box";
import Card from "../layout/Card";
import Container from "../layout/Container";
import Flex from "../layout/Flex";
import Flexbar from "../layout/Flexbar";
import Head from "next/head";
import JsonLd from "../seo/JsonLd";
import LanguageSwitcher from "./LanguageSwitcher";
import MediaQuery from "../layout/MediaQuery";
import NavCart from "./NavCart";
import NavItem from "./NavItem";
import NavUser from "./NavUser";
import Navbar from "./Navbar";
import Push from "../layout/Push";
import Searchbar from "../Searchbar";
import StyledLink from "../elements/StyledLink";
import page from "../../i18n/page";
import shop from "../../i18n/shop";

const messages = defineMessages({
  siteDescription: {
    id: "Header.siteDescription",
    defaultMessage:
      "Bei der Hauser Feuerschutz AG finden Sie alle Produkte im Bereich Feuerschutz sowie ein kompetenter Kundensupport der Ihnen gerne Ihre Fragen beantwortet.",
  },
});

const SearchMediaQuery = styled(MediaQuery)`
  width: 100%;
  height: auto;
  margin-right: 1rem;
`;

const SearchWrapper = styled.div`
  width: 100%;
  margin-right: 1rem;
`;

const HeaderWrapper = styled.div`
  margin-top: 5rem;
`;

const FullHeightBox = styled(Box)`
  height: 100%;
  position: relative;
`;

const LogoLeft = styled.div`
  padding: 0 0.5rem 0 1rem;
  height: 100%;
`;

const MobileSearchWrapper = styled.div`
  margin-top: 6rem;

  h3 {
    margin-top: 0;
  }
  input {
    background-color: #fff;
    border: ${colors.primary} 1px solid;
  }

  & > div > div > div {
    margin-bottom: 0;
  }
`;

const HtmlHead: FunctionComponent<{ intl: IntlShape }> = React.memo(
  ({ intl }) => (
    <Head>
      <title>{intl.formatMessage(shop.siteTitle)}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content={intl.formatMessage(messages.siteDescription)}
      />
      <link rel="preconnect" href={WP_BLOG_URL} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="no" />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/images/favicon/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/images/favicon/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/images/favicon/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/images/favicon/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/images/favicon/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/images/favicon/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/images/favicon/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/images/favicon/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/favicon/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/images/favicon/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/images/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/images/favicon/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/images/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/images/favicon/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-TileImage"
        content="/images/favicon/ms-icon-144x144.png"
      />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  )
);

const Header: FunctionComponent = React.memo(() => {
  const intl = useIntl();
  const { toggleBurgerMenu } = useContext(AppContext);
  const [dropdown, setDropdown] = useState<string | boolean>(false);

  return (
    <HeaderWrapper>
      <HtmlHead intl={intl} />
      <JsonLd>{BUSINESS_JSON_LD}</JsonLd>
      <header>
        <Navbar>
          <Flex>
            <FullHeightBox widths={[0, 0, 0, 0, 1 / 6]}>
              <MediaQuery xlg up>
                <LogoLeft>
                  <NavItem>
                    <StyledLink href={`/${intl.locale}`} title="Homepage">
                      <img src="/images/logo/logo_negative.svg" alt="Logo" />
                    </StyledLink>
                  </NavItem>
                </LogoLeft>
              </MediaQuery>
            </FullHeightBox>
            <FullHeightBox widths={[1, 1, 1, 1, 5 / 6]} paddingLeft={0}>
              <Container>
                <Flexbar>
                  <MediaQuery lg up>
                    <NavItem>
                      <StyledLink
                        noHover
                        href={`/${intl.locale}`}
                        title="Homepage"
                      >
                        <img
                          src="/images/logo/name_slogan_negative.svg"
                          alt="Slogan"
                        />
                      </StyledLink>
                    </NavItem>
                  </MediaQuery>
                  <MediaQuery lg down>
                    <Flexbar>
                      <NavItem>
                        <StyledLink noHover onClick={toggleBurgerMenu} negative>
                          <MdMenu size="40" />
                        </StyledLink>
                      </NavItem>
                      <NavItem>
                        <StyledLink
                          noHover
                          href={`/${intl.locale}`}
                          title="Homepage"
                        >
                          <img
                            src="/images/logo/logo_negative.svg"
                            alt="Logo"
                          />
                        </StyledLink>
                      </NavItem>
                    </Flexbar>
                  </MediaQuery>
                  <SearchMediaQuery lg up>
                    <SearchWrapper>
                      <Searchbar id="navigation" />
                    </SearchWrapper>
                  </SearchMediaQuery>
                  <Push left>
                    <MediaQuery md down>
                      <Flexbar>
                        <NavItem seperator>
                          <LanguageSwitcher vertical />
                        </NavItem>
                        <NavItem>
                          <NavCart dropdown={false} />
                        </NavItem>
                      </Flexbar>
                    </MediaQuery>
                    <MediaQuery md up>
                      <Flexbar>
                        <NavItem seperator>
                          <LanguageSwitcher />
                        </NavItem>
                        <NavItem seperator>
                          <NavCart
                            dropdown={dropdown}
                            setDropdown={setDropdown}
                          />
                        </NavItem>
                        <NavItem>
                          <NavUser
                            dropdown={dropdown}
                            setDropdown={setDropdown}
                          />
                        </NavItem>
                      </Flexbar>
                    </MediaQuery>
                  </Push>
                </Flexbar>
              </Container>
            </FullHeightBox>
          </Flex>
        </Navbar>
      </header>
      <MobileSearchWrapper>
        <MediaQuery lg down>
          <Container>
            <Card>
              <h3>{intl.formatMessage(page.search)}</h3>
              <Searchbar id="mobile" />
            </Card>
          </Container>
        </MediaQuery>
      </MobileSearchWrapper>
    </HeaderWrapper>
  );
});

export default Header;
