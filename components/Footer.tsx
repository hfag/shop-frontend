import {
  FaEnvelope as Envelope,
  FaDownload,
  FaMapMarkerAlt as MapMarker,
  FaPhone as Phone,
} from "react-icons/fa";
import { defineMessages, useIntl } from "react-intl";
import Container from "./layout/Container";
import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { colors, media } from "../utilities/style";
import { pageSlugsByLanguage, pathnamesByLanguage } from "../utilities/urls";
import Box from "./layout/Box";
import Flex from "./layout/Flex";
import StyledLink from "./elements/StyledLink";

const messages = defineMessages({
  aboutTitle: {
    id: "Footer.aboutTitle",
    defaultMessage: "Über die Hauser Feuerschutz AG",
  },
  about: {
    id: "Footer.about",
    defaultMessage:
      "Die 1970 gegründete Firma bietet Ihnen Dienstleistungen und Produkte an in den Bereichen Sicherheitskennzeichnung, Trittschutz und Feuerschutz.",
  },
  moreAbout: {
    id: "Footer.moreAbout",
    defaultMessage: "Weitere Informationen",
  },
  downloads: {
    id: "Footer.downloads",
    defaultMessage: "Downloads",
  },
  socialMedia: {
    id: "Footer.socialMedia",
    defaultMessage: "Soziale Medien",
  },
  tos: {
    id: "Footer.tos",
    defaultMessage: "Allgemeine Geschäftsbedingungen",
  },
});

const StyledFooter = styled.footer`
  padding: 1rem;
  border-top: ${colors.primaryContrast} 1px solid;
  background-color: ${colors.primary};
  color: ${colors.primaryContrast};
  z-index: 1;

  img {
    width: 100%;
    height: auto;

    display: block;
  }

  .logo {
    width: 50%;
  }

  .slogan {
    width: 75%;
  }

  .about-header {
    margin: 0 0 0.25rem 0;
    font-weight: 500;
  }
`;

const BorderBox = styled(Box)`
  padding: 1rem 0;
  margin-bottom: 1rem;

  ${media.maxMedium} {
    border-bottom: #fff 1px solid;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const IconList = styled.table`
  width: 100%;
  td:first-of-type {
    width: 15%;
    padding: 0.25rem 0;
  }
  td:last-of-type {
    padding-left: 1rem;
  }
`;

const Icon = styled.span<{ margin?: boolean }>`
  ${({ margin }) => (margin ? "margin: 0.5rem 0.5rem 0.5rem 0;" : "")}
  padding: 0.5rem;
  border: ${colors.primaryContrast} 1px solid;
  border-radius: 50%;
  display: inline-block;

  & > svg {
    display: block;
    margin: 0 auto;
  }
`;

const Footer: FunctionComponent = React.memo(() => {
  const intl = useIntl();

  return (
    <StyledFooter>
      <Flex>
        <Box widths={[0, 0, 0, 0, 1 / 6]} />
        <Box widths={[1, 1, 1, 1, 5 / 6]}>
          <Container>
            <Flex flexWrap="wrap">
              <BorderBox widths={[1, 1, 1, 1 / 3, 1 / 3]} paddingX={3}>
                <img
                  src="/images/logo/logo_negative.svg"
                  loading="lazy"
                  alt="Logo"
                  className="logo"
                />
                <br />
                <img
                  src="/images/logo/name_slogan_negative.svg"
                  loading="lazy"
                  alt="Slogan"
                  className="slogan"
                />
              </BorderBox>
              <BorderBox widths={[1, 1, 1 / 3, 1 / 3]} paddingX={3}>
                <IconList>
                  <tbody>
                    <tr>
                      <td>
                        <Icon>
                          <MapMarker />
                        </Icon>
                      </td>
                      <td>
                        <StyledLink
                          underlined
                          target="_blank"
                          external
                          href="https://www.google.ch/maps/place/Laurenzenvorstadt+85,+5000+Aarau/@47.3944942,8.0486031,16z/data=!3m1!4b1!4m6!3m5!1s0x47903be525e9b93f:0x651cd1fe9a322e4a!8m2!3d47.3944942!4d8.051178!16s%2Fg%2F11q2vvx459?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D"
                          rel="noopener"
                          negative
                        >
                          Laurenzenvorstadt 85
                          <br />
                          CH 5000 Aarau
                        </StyledLink>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Icon>
                          <Phone />
                        </Icon>
                      </td>
                      <td>
                        <StyledLink
                          underlined
                          external
                          href="tel:+41628340540"
                          negative
                        >
                          062 834 05 40
                        </StyledLink>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Icon>
                          <Envelope />
                        </Icon>
                      </td>
                      <td>
                        <StyledLink
                          underlined
                          external
                          href="mailto:info@feuerschutz.ch"
                          negative
                        >
                          info@feuerschutz.ch
                        </StyledLink>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Icon>
                          <FaDownload />
                        </Icon>
                      </td>
                      <td>
                        <StyledLink
                          underlined
                          href={`/${intl.locale}/${
                            pathnamesByLanguage.page.languages[intl.locale]
                          }/${
                            pageSlugsByLanguage.downloads.languages[intl.locale]
                          }`}
                          negative
                        >
                          {intl.formatMessage(messages.downloads)}
                        </StyledLink>
                      </td>
                    </tr>
                  </tbody>
                </IconList>
              </BorderBox>
              <BorderBox widths={[1, 1, 1, 1 / 3, 1 / 3]} paddingX={3}>
                <p className="about-header">
                  {intl.formatMessage(messages.aboutTitle)}
                </p>
                <p>
                  {intl.formatMessage(messages.about)}{" "}
                  <StyledLink
                    underlined
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.page.languages[intl.locale]
                    }/${
                      pageSlugsByLanguage.companyAbout.languages[intl.locale]
                    }`}
                    negative
                  >
                    {intl.formatMessage(messages.moreAbout)}
                  </StyledLink>
                </p>
                <p>
                  <StyledLink
                    underlined
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.page.languages[intl.locale]
                    }/${pageSlugsByLanguage.tos.languages[intl.locale]}`}
                    negative
                  >
                    {intl.formatMessage(messages.tos)}
                  </StyledLink>
                </p>
              </BorderBox>
            </Flex>
          </Container>
        </Box>
      </Flex>
    </StyledFooter>
  );
});

export default Footer;
