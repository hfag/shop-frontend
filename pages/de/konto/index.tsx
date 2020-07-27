import Wrapper from "../../../components/layout/Wrapper";
import { useIntl } from "react-intl";
import page from "../../../i18n/page";
import { locale, messages } from "../config.json";
import { pathnamesByLanguage } from "../../../utilities/urls";
import AccountWrapper from "../../../components/account/AccountWrapper";
import AccountDashboard from "../../../components/account/AccountDashboard";
import { withApp } from "../../../components/AppWrapper";

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
        <AccountDashboard></AccountDashboard>
      </AccountWrapper>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
