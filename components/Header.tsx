import React, {
  useState,
  useEffect,
  FunctionComponent,
  useContext,
} from "react";
import styled from "styled-components";
import { MdMenu } from "react-icons/md";
import { Flex, Box } from "reflexbox";
import { defineMessages, useIntl, IntlShape } from "react-intl";

import Container from "./layout/Container";
import Flexbar from "./layout/Flexbar";
import Push from "./layout/Push";
import MediaQuery from "./layout/MediaQuery";
import NavItem from "./header/NavItem";
import Navbar from "./layout/Navbar";
import Searchbar from "./Searchbar";
import LogoNegative from "../public/images/logo/logo_negative.svg";
import NameSloganNegative from "../public/images/logo/name_slogan_negative.svg";
import JsonLd from "./JsonLd";
import { BUSINESS_JSON_LD } from "../utilities/json-ld";
import LanguageSwitcher from "./header/LanguageSwitcher";
import NavCart from "./header/NavCart";
import NavUser from "./header/NavUser";
import shop from "../i18n/shop";
import Card from "./Card";
import { colors } from "../utilities/style";
import page from "../i18n/page";
import { ABSOLUTE_URL } from "../utilities/api";
import Head from "next/head";
import StyledLink from "./StyledLink";
import { AppContext } from "../pages/_app";

const messages = defineMessages({
  siteDescription: {
    id: "Header.siteDescription",
    defaultMessage:
      "Bei der Hauser Feuerschutz AG finden Sie alle Produkte im Bereich Feuerschutz sowie ein kompetenter Kundensupport der Ihnen gerne Ihre Fragen beantwortet.",
  },
});

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
  margin-top: 1.5rem;
  h3 {
    margin-top: 0;
  }
  input {
    background-color: #fff;
    border: ${colors.primary} 1px solid;
  }
`;

const HtmlHead: FunctionComponent<{ intl: IntlShape }> = React.memo(
  ({ intl }) => (
    <Head>
      <title>{intl.formatMessage(shop.siteTitle)}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Nico Hauser" />
      <meta name="format-detection" content="telephone=no" />
      <meta
        name="description"
        content={intl.formatMessage(messages.siteDescription)}
      />
      <link rel="canonical" href={ABSOLUTE_URL} />
    </Head>
  )
);

const Header: FunctionComponent<{}> = React.memo(({}) => {
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
            <FullHeightBox width={[0, 0, 0, 1 / 6]}>
              <MediaQuery lg up>
                <LogoLeft>
                  <NavItem>
                    <StyledLink href={`/${intl.locale}`} title="Homepage">
                      <img src={LogoNegative} alt="Logo" />
                    </StyledLink>
                  </NavItem>
                </LogoLeft>
              </MediaQuery>
            </FullHeightBox>
            <FullHeightBox width={[1, 1, 1, 5 / 6]} pl={2}>
              <Container>
                <Flexbar>
                  <MediaQuery lg up>
                    <NavItem>
                      <StyledLink
                        noHover
                        href={`/${intl.locale}`}
                        title="Homepage"
                      >
                        <img src={NameSloganNegative} alt="Slogan" />
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
                          <img src={LogoNegative} alt="Logo" />
                        </StyledLink>
                      </NavItem>
                    </Flexbar>
                  </MediaQuery>
                  <SearchWrapper>
                    <MediaQuery lg up>
                      <Searchbar />
                    </MediaQuery>
                  </SearchWrapper>
                  <Push left>
                    <MediaQuery md down>
                      <NavItem>
                        <LanguageSwitcher />
                      </NavItem>
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
              <Searchbar />
            </Card>
          </Container>
        </MediaQuery>
      </MobileSearchWrapper>
    </HeaderWrapper>
  );
});

export default Header;
