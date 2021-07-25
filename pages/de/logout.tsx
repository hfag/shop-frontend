import { GetStaticProps } from "next";
import { LOGOUT } from "../../gql/user";
import { Mutation } from "../../schema";
import { defineMessages, useIntl } from "react-intl";
import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { withApp } from "../../components/AppWrapper";
import Card from "../../components/layout/Card";
import React from "react";
import Wrapper from "../../components/layout/Wrapper";
import page from "../../i18n/page";
import request from "../../utilities/request";

const logoutMessages = defineMessages({
  pleaseWait: {
    id: "logout.pleaseWait",
    defaultMessage: "Bitte warten...",
  },
});

const Page = () => {
  const intl = useIntl();
  const router = useRouter();

  useEffect(() => {
    request<{ logout: Mutation["logout"] }>(intl.locale, LOGOUT)
      .catch(() => Promise.resolve()) //always redirect
      .then(() => {
        router.push(`/${intl.locale}`);
      });
  }, []);
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.logout),
          url: `/${intl.locale}/${
            pathnamesByLanguage.logout.languages[intl.locale]
          }`,
        },
      ]}
    >
      <Card>{intl.formatMessage(logoutMessages.pleaseWait)}</Card>
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
