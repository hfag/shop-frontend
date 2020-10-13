import Wrapper from "../../../components/layout/Wrapper";
import { useIntl } from "react-intl";
import page from "../../../i18n/page";
import { pathnamesByLanguage } from "../../../utilities/urls";
import AccountWrapper from "../../../components/account/AccountWrapper";
import AccountDashboard from "../../../components/account/AccountDashboard";
import { GetStaticProps } from "next";
import { withApp } from "../../../components/AppWrapper";
import { locale, messages } from "../config";

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
