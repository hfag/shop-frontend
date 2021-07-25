import { GetStaticProps } from "next";
import { locale, messages } from "../config";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../../components/AppWrapper";
import AccountDashboard from "../../../components/account/AccountDashboard";
import AccountWrapper from "../../../components/account/AccountWrapper";
import Wrapper from "../../../components/layout/Wrapper";
import page from "../../../i18n/page";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.myAccount),
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }`,
        },
      ]}
    >
      <AccountWrapper>
        <AccountDashboard />
      </AccountWrapper>
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
