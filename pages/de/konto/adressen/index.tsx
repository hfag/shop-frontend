import Wrapper from "../../../../components/layout/Wrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import AccountAddresses from "../../../../components/account/AccountAddresses";
import { useIntl } from "react-intl";
import { locale, messages } from "../../config.json";
import { withApp, AppContext } from "../../../../components/AppWrapper";
import { useContext } from "react";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import page from "../../../../i18n/page";

const Page = () => {
  const intl = useIntl();
  const { user } = useContext(AppContext);

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
        {
          name: intl.formatMessage(page.accountOrders),
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }/${
            pathnamesByLanguage.account.pathnames.address.languages[intl.locale]
          }`,
        },
      ]}
    >
      <AccountWrapper>
        <AccountAddresses addresses={user?.addresses}></AccountAddresses>
      </AccountWrapper>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
