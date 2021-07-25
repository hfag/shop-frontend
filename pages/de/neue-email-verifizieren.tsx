import { GetStaticPaths, GetStaticProps } from "next";
import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../components/AppWrapper";
import VerifyNewEmail from "../../components/VerifyNewEmail";
import Wrapper from "../../components/layout/Wrapper";
import page from "../../i18n/page";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.verifyEmail),
          url: `/${intl.locale}/${
            pathnamesByLanguage.verifyNewEmail.languages[intl.locale]
          }`,
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
