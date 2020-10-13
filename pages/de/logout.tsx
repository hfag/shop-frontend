import { useEffect } from "react";
import { useRouter } from "next/router";
import request from "../../utilities/request";
import { useIntl, defineMessages } from "react-intl";
import { LOGOUT } from "../../gql/user";
import Wrapper from "../../components/layout/Wrapper";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";
import Card from "../../components/layout/Card";
import { GetStaticProps } from "next";
import { withApp } from "../../components/AppWrapper";
import { locale, messages } from "./config";

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
    request(intl.locale, LOGOUT)
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
