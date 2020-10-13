import Wrapper from "../components/layout/Wrapper";
import { useIntl } from "react-intl";
import page from "../i18n/page";
import VerifyNewEmail from "../components/VerifyNewEmail";
import { GetStaticPaths, GetStaticProps } from "next";
import { withApp } from "../components/AppWrapper";
import { locale, messages } from "./de/config";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.verifyEmail),
          url: `/${intl.locale}/verify-new-email`,
        },
      ]}
    >
      <VerifyNewEmail />
    </Wrapper>
  );
};

//do everything client side
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default withApp(locale, messages)(Page);
