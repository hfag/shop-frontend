import { AppContext } from "../../../../components/AppContext";
import { GET_ORDER_BY_CODE } from "../../../../gql/order";
import { GetStaticPaths, GetStaticProps } from "next";
import { Query } from "../../../../schema";
import { locale, messages } from "../../config";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { withApp } from "../../../../components/AppWrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import Order from "../../../../components/elements/Order";
import React, { useContext } from "react";
import Wrapper from "../../../../components/layout/Wrapper";
import page from "../../../../i18n/page";
import request from "../../../../utilities/request";
import useSWR from "swr";

const Page = () => {
  const intl = useIntl();
  const router = useRouter();
  const { token } = useContext(AppContext);

  const { code } = router.query;

  const { data /*, error*/ } = useSWR(
    [GET_ORDER_BY_CODE, code, token],
    ([query, code]) =>
      request<{ orderByCode: Query["orderByCode"] }>(intl.locale, query, {
        code,
      })
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

//do everything client side
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};
