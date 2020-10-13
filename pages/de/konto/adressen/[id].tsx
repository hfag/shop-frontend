import { GetStaticPaths, GetStaticProps } from "next";
import Wrapper from "../../../../components/layout/Wrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useContext, useMemo } from "react";
import request from "../../../../utilities/request";
import { Order as OrderType, Country, Address } from "../../../../schema";
import Placeholder from "../../../../components/elements/Placeholder";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import page from "../../../../i18n/page";
import AddressForm from "../../../../components/account/AddressForm";
import { AVAILABLE_COUNTRIES } from "../../../../gql/country";
import { AppContext, withApp } from "../../../../components/AppWrapper";
import { locale, messages } from "../../config";

const Page = () => {
  const intl = useIntl();
  const router = useRouter();
  const { customer: user, token } = useContext(AppContext);

  const { id } = router.query;

  const address: Address | undefined = useMemo(
    () => user?.addresses.find((a) => a.id === id),
    [user, id]
  );

  const {
    data: countryData,
  }: {
    data?: { availableCountries: Country[] };
    error?: any;
  } = useSWR(AVAILABLE_COUNTRIES, (query) => request(intl.locale, query));

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
