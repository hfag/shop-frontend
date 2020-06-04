import Wrapper from "../../../components/layout/Wrapper";
import { useIntl } from "react-intl";
import page from "../../../i18n/page";
import { pathnamesByLanguage } from "../../../utilities/urls";
import AccountWrapper from "../../../components/account/AccountWrapper";
import AccountDashboard from "../../../components/account/AccountDashboard";

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

export default Page;
