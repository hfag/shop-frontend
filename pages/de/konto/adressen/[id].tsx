import { AVAILABLE_COUNTRIES } from "../../../../gql/country";
import {
  Address,
  Country,
  Order as OrderType,
  Query,
} from "../../../../schema";
import { AppContext, withApp } from "../../../../components/AppWrapper";
import { GetStaticPaths, GetStaticProps } from "next";
import { locale, messages } from "../../config";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import AddressForm from "../../../../components/account/AddressForm";
import Placeholder from "../../../../components/elements/Placeholder";
import React, { useContext, useMemo } from "react";
import Wrapper from "../../../../components/layout/Wrapper";
import page from "../../../../i18n/page";
import request from "../../../../utilities/request";
import useSWR from "swr";

const Page = () => {
  const intl = useIntl();
  const router = useRouter();
  const { customer: user, token } = useContext(AppContext);

  const { id } = router.query;

  const address: Address | undefined = useMemo(
    () => user?.addresses.find((a) => a.id === id),
    [user, id]
  );

  const { data: countryData } = useSWR(AVAILABLE_COUNTRIES, (query) =>
    request<{ availableCountries: Query["availableCountries"] }>(
      intl.locale,
      query
    )
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
          name: intl.formatMessage(page.accountAddresses),
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }/${
            pathnamesByLanguage.account.pathnames.address.languages[intl.locale]
          }`,
        },
      ]}
    >
      <AccountWrapper>
        {address || id === "new" ? (
          <AddressForm
            id={typeof id === "string" ? id : "new"}
            intl={intl}
            router={router}
            token={token}
            countries={countryData ? countryData.availableCountries : []}
            values={
              id === "new"
                ? {}
                : {
                    fullName: address.fullName,
                    company: address.company,
                    country: address.country.code,
                    streetLine1: address.streetLine1,
                    streetLine2: address.streetLine2,
                    // post_office_box,
                    postalCode: address.postalCode,
                    city: address.city,
                    province: address.province,
                    phone: address.phoneNumber,

                    defaultShippingAddress: address.defaultShippingAddress
                      ? true
                      : false,
                    defaultBillingAddress: address.defaultBillingAddress
                      ? true
                      : false,
                  }
            }
          />
        ) : (
          <Placeholder />
        )}
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
