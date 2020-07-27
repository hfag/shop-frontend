import Wrapper from "../../../../components/layout/Wrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import Order from "../../../../components/elements/Order";
import { GET_ORDER_BY_CODE } from "../../../../gql/order";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import useSWR from "swr";
import { locale, messages } from "../../config.json";
import { withApp, AppContext } from "../../../../components/AppWrapper";
import { useContext } from "react";
import request from "../../../../utilities/request";
import { Order as OrderType } from "../../../../schema";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import page from "../../../../i18n/page";

const Page = () => {
  const intl = useIntl();
  const router = useRouter();
  const { token } = useContext(AppContext);

  const { code } = router.query;

  const {
    data,
    error,
  }: { data?: { orderByCode: OrderType }; error?: any } = useSWR(
    [GET_ORDER_BY_CODE, code, token],
    (query, code) => request(intl.locale, query, { code })
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
        {
          name: typeof code === "string" ? code : "",
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }/${
            pathnamesByLanguage.account.pathnames.orders.languages[intl.locale]
          }/${code}`,
        },
      ]}
    >
      <AccountWrapper>
        <Order order={data?.orderByCode}></Order>
      </AccountWrapper>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
