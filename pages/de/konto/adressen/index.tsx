import { AppContext, withApp } from "../../../../components/AppWrapper";
import { GetStaticProps } from "next";
import { locale, messages } from "../../config";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import { useContext } from "react";
import { useIntl } from "react-intl";
import AccountAddresses from "../../../../components/account/AccountAddresses";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import Wrapper from "../../../../components/layout/Wrapper";
import page from "../../../../i18n/page";

const Page = () => {
  const intl = useIntl();
  const { customer: user } = useContext(AppContext);

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

//do everything client side
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
