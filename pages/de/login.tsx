import Wrapper from "../../components/layout/Wrapper";
import Login from "../../components/Login";
import { useIntl } from "react-intl";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";
import { GetStaticProps } from "next";
import { withApp } from "../../components/AppWrapper";
import { locale, messages } from "./config";

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
