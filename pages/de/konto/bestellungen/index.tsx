import Wrapper from "../../../../components/layout/Wrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import AccountOrders from "../../../../components/account/AccountOrders";
import { useIntl } from "react-intl";
import { GET_CURRENT_CUSTOMER_ALL_ORDERS } from "../../../../gql/user";
import { locale, messages } from "../../config.json";
import { withApp, AppContext } from "../../../../components/AppWrapper";
import { useContext } from "react";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import page from "../../../../i18n/page";
import useSWR from "swr";
import request from "../../../../utilities/request";
import { Order } from "../../../../schema";

const Page = () => {
  const intl = useIntl();
  const { token } = useContext(AppContext);
  const {
    data,
    error,
  }: {
    data?: { activeCustomer: { orders: { items: Order[] } } };
    error?: any;
  } = useSWR([GET_CURRENT_CUSTOMER_ALL_ORDERS, token], (query) =>
    request(intl.locale, query)
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
          orders={data?.activeCustomer.orders.items}
        ></AccountOrders>
      </AccountWrapper>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
