import Wrapper from "../../components/layout/Wrapper";
import { useIntl } from "react-intl";
import page from "../../i18n/page";
import VerifyEmail from "../../components/VerifyEmail";
import { GetStaticPaths, GetStaticProps } from "next";
import { withApp } from "../../components/AppWrapper";
import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.verifyEmail),
          url: `/${intl.locale}/${
            pathnamesByLanguage.verify.languages[intl.locale]
          }`,
        },
      ]}
    >
      <VerifyEmail />
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
