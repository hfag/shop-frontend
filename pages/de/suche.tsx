import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { withApp } from "../../components/AppWrapper";
import React, { FunctionComponent } from "react";
import SearchResults from "../../components/SearchResults";
import SidebarBreadcrumb from "../../components/layout/sidebar/SidebarBreadcrumb";
import SidebarBreadcrumbs from "../../components/layout/sidebar/SidebarBreadcrumbs";
import Wrapper from "../../components/layout/Wrapper";
import search from "../../i18n/search";

const Page: FunctionComponent = () => {
  const intl = useIntl();
  const router = useRouter();

  return (
    <Wrapper
      sidebar={
        <>
          <SidebarBreadcrumbs breadcrumbs={[]}>
            <SidebarBreadcrumb active>
              {intl.formatMessage(search.search)}
            </SidebarBreadcrumb>
          </SidebarBreadcrumbs>
        </>
      }
      breadcrumbs={[
        {
          name: intl.formatMessage(search.search),
          url: `/${intl.locale}/${
            pathnamesByLanguage.search.languages[intl.locale]
          }`,
        },
      ]}
    >
      <SearchResults
        term={Array.isArray(router.query.query) ? "" : router.query.query}
      />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
