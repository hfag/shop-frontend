import { AppContext } from "../../../../components/AppContext";
import { GET_CURRENT_CUSTOMER_ALL_ORDERS } from "../../../../gql/user";
import { GetStaticProps } from "next";
import { Query } from "../../../../schema";
import { locale, messages } from "../../config";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../../../components/AppWrapper";
import AccountOrders from "../../../../components/account/AccountOrders";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import React, { useContext } from "react";
import Wrapper from "../../../../components/layout/Wrapper";
import page from "../../../../i18n/page";
import request from "../../../../utilities/request";
import useSWR from "swr";

const Page = () => {
  const intl = useIntl();
  const { token } = useContext(AppContext);
  const { data /*, error*/ } = useSWR(
    [GET_CURRENT_CUSTOMER_ALL_ORDERS, token],
    ([query]) =>
      request<{ activeCustomer: Query["activeCustomer"] }>(intl.locale, query)
  );

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
            pathnamesByLanguage.account.pathnames.orders.languages[intl.locale]
          }`,
        },
      ]}
    >
      <AccountWrapper>
        <AccountOrders
          orders={data?.activeCustomer?.orders.items}
        ></AccountOrders>
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
