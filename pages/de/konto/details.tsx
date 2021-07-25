import { AppContext, withApp } from "../../../components/AppWrapper";
import { GetStaticProps } from "next";
import { Unavailable } from "../../../components/administrator/Unavailable";
import { defineMessages, useIntl } from "react-intl";
import { locale, messages } from "../config";
import { pathnamesByLanguage } from "../../../utilities/urls";
import { useContext, useState } from "react";
import AccountForm from "../../../components/account/AccountForm";
import AccountWrapper from "../../../components/account/AccountWrapper";
import Message from "../../../components/elements/Message";
import Placeholder from "../../../components/elements/Placeholder";
import Wrapper from "../../../components/layout/Wrapper";
import page from "../../../i18n/page";

const detailMessages = defineMessages({
  newEmail: {
    id: "account.details.newEmail",
    defaultMessage:
      "Sie haben eine neue E-Mail angegeben, bestätigen Sie die erhaltene E-Mail auf der neuen Adresse.",
  },
});

const Page = () => {
  const intl = useIntl();
  const [message, setMessage] = useState<string | null>(null);
  const { customer, user, token } = useContext(AppContext);

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
          name: intl.formatMessage(page.accountDetails),
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.pathnames.details.languages[intl.locale]
          }`,
        },
      ]}
    >
      <AccountWrapper>
        {customer ? (
          <>
            <AccountForm
              intl={intl}
              token={token}
              values={{
                email: customer.emailAddress,
                firstName: customer.firstName,
                lastName: customer.lastName,
              }}
              newEmailCallback={() =>
                setMessage(intl.formatMessage(detailMessages.newEmail))
              }
            />
            {message && (
              <>
                <br />
                <Message>{message}</Message>
              </>
            )}
          </>
        ) : user ? (
          <Unavailable />
        ) : (
          <Placeholder block />
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
