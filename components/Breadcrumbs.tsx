import { ABSOLUTE_URL } from "../utilities/api";
import { stripTags } from "../utilities/decode";
import { useIntl } from "react-intl";
import Breadcrumb from "./Breadcrumb";
import Card from "./layout/Card";
import JsonLd from "./seo/JsonLd";
import Placeholder from "./elements/Placeholder";
import React, { FunctionComponent } from "react";
import StyledLink from "./elements/StyledLink";
import page from "../i18n/page";

export interface Breadcrumb {
  name: string;
  url: string;
}

/**
 * Renders all breadcrumbs
 */
const Breadcrumbs: FunctionComponent<{
  breadcrumbs: Breadcrumb[];
}> = ({ breadcrumbs }) => {
  const intl = useIntl();

  return (
    <Card>
      <div>
        <Breadcrumb>
          <StyledLink href={`/${intl.locale}`}>
            <span
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(page.home),
              }}
            />
          </StyledLink>
        </Breadcrumb>
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb key={index}>
              {index === breadcrumbs.length - 1 ? (
                <span dangerouslySetInnerHTML={{ __html: breadcrumb.name }} />
              ) : (
                <StyledLink href={breadcrumb.url}>
                  <span dangerouslySetInnerHTML={{ __html: breadcrumb.name }} />
                </StyledLink>
              )}
            </Breadcrumb>
          ))
        ) : (
          <Breadcrumb>
            <Placeholder text inline minWidth={5} />
          </Breadcrumb>
        )}
      </div>
      <JsonLd>
        {{
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map(({ name, url }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@id": ABSOLUTE_URL + url, name: stripTags(name) },
          })),
        }}
      </JsonLd>
    </Card>
  );
};

export default Breadcrumbs;
