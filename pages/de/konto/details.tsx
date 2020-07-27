import Wrapper from "../../../components/layout/Wrapper";
import AccountForm from "../../../components/account/AccountForm";
import AccountWrapper from "../../../components/account/AccountWrapper";
import { useIntl, defineMessages } from "react-intl";
import { useState, useContext } from "react";
import { locale, messages as appMessages } from "../config.json";
import { withApp, AppContext } from "../../../components/AppWrapper";
import Placeholder from "../../../components/elements/Placeholder";
import Message from "../../../components/elements/Message";
import { pathnamesByLanguage } from "../../../utilities/urls";
import page from "../../../i18n/page";

const messages = defineMessages({
  newEmail: {
    id: "account.details.newEmail",
    defaultMessage:
      "Sie haben eine neue E-Mail angegeben, bestätigen Sie die erhaltene E-Mail auf der neuen Adresse.",
  },
});

const Page = () => {
  const intl = useIntl();
  const [message, setMessage] = useState<string | null>(null);
  const { user, token } = useContext(AppContext);

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
        {user ? (
          <>
            <AccountForm
              intl={intl}
              token={token}
              values={{
                email: user.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
              }}
              newEmailCallback={() =>
                setMessage(intl.formatMessage(messages.newEmail))
              }
            />
            {message && (
              <>
                <br />
                <Message>{message}</Message>
              </>
            )}
          </>
        ) : (
          <Placeholder block />
        )}
      </AccountWrapper>
    </Wrapper>
  );
};

export default withApp(locale, appMessages)(Page);
