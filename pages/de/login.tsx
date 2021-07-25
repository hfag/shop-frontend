import { GetStaticProps } from "next";
import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../components/AppWrapper";
import Login from "../../components/Login";
import React from "react";
import Wrapper from "../../components/layout/Wrapper";
import page from "../../i18n/page";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.login),
          url: `/${intl.locale}/${
            pathnamesByLanguage.login.languages[intl.locale]
          }`,
        },
      ]}
    >
      <Login />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

//do everything client side
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
