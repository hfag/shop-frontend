import React from "react";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import Container from "components/Container";
import MapMarker from "react-icons/lib/fa/map-marker";
import Phone from "react-icons/lib/fa/phone";
import Envelope from "react-icons/lib/fa/envelope";

import { colors } from "../utilities/style";
import Link from "./Link";
import LogoNegative from "../../img/logo/logo_negative.svg";
import NameSloganNegative from "../../img/logo/name_slogan_negative.svg";

const StyledFooter = styled.footer`
  padding: 1rem;
  background-color: ${colors.primary};
  color: #fff;

  img {
    width: 100%;
    height: auto;

    display: block;
  }

  .logo {
    width: 50%;
  }

  .title {
    font-variant: small-caps;
  }

  h4 {
    margin: 0 0 0.25rem 0;
  }
`;

const IconList = styled.table`
  width: 100%;
  td:first-child {
    width: 15%;
    padding: 0.25rem 0;
  }
  td:last-child {
    padding-left: 1rem;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.span`
  padding: 0.5rem;
  border: #fff 1px solid;
  border-radius: 50%;
  display: inline-block;

  & > svg {
    width: 100%;
    height: auto;

    display: block;
    margin: 0 auto;
  }
`;

/**
 * The page footer
 * @returns {Component} The component
 */
class Footer extends React.PureComponent {
  render = () => {
    return (
      <StyledFooter>
        <Container>
          <Flex flexWrap="wrap">
            <Box width={[1, 1, 1 / 3, 1 / 3]} px={3}>
              <p>
                <img className="logo" src={LogoNegative} alt="Logo" />
              </p>
              Hauser Feuerschutz AG
              <br />
              Safety Signs and Security Products
            </Box>
            <Box width={[1, 1, 1 / 3, 1 / 3]} px={3}>
              <IconList>
                <tbody>
                  <tr>
                    <td>
                      <Icon>
                        <MapMarker />
                      </Icon>
                    </td>
                    <td>
                      <Link
                        target="_blank"
                        href="https://www.google.ch/maps/place/Sonnmattweg+6,+5000+Aarau/@47.3971534,8.0412625,17z/data=!3m1!4b1!4m5!3m4!1s0x47903be72641ef39:0x35e802ea186c4a2d!8m2!3d47.3971534!4d8.0434512"
                        rel="noopener"
                        negative
                      >
                        Sonnmattweg 6<br />CH 5000 Aarau
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Icon>
                        <Phone />
                      </Icon>
                    </td>
                    <td>
                      <Link href="tel:+41628340540" negative>
                        062 834 05 40
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Icon>
                        <Envelope />
                      </Icon>
                    </td>
                    <td>
                      <Link href="mailto:info@feuerschutz.ch" negative>
                        info@feuerschutz.ch
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </IconList>
            </Box>
            <Box width={[1, 1, 1 / 3, 1 / 3]} px={3}>
              <h4>Über die Hauser Feuerschutz AG</h4>
              Die 1970 gegründete Firma bietet Ihnen Dienstleistungen und
              Produkte in den Bereichen Sicherheitskennzeichnung und
              Feuerschutz.
            </Box>
          </Flex>
        </Container>
      </StyledFooter>
    );
  };
}

export default Footer;
