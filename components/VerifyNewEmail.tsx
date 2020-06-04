import { FunctionComponent, useMemo, useCallback, useState } from "react";
import { IntlShape, defineMessages, useIntl } from "react-intl";
import page from "../i18n/page";
import { UPDATE_CUSTOMER_EMAIL } from "../gql/user";
import Button from "./elements/Button";
import request from "../utilities/request";
import { useRouter } from "next/router";
import Card from "./layout/Card";
import Message from "./elements/Message";
import { pathnamesByLanguage } from "../utilities/urls";

const messages = defineMessages({
  verifyNewEmail: {
    id: "VerifyNewEmail.verifyNewEmail",
    defaultMessage: "Neue Email verifizieren und Benutzerkonto anlegen",
  },
  invalidLink: {
    id: "VerifyNewEmail.invalidLink",
    defaultMessage: "Der Link aus der E-Mail ist abgelaufen.",
  },
});

const VerifyNewEmail: FunctionComponent<{}> = (props) => {
  const intl = useIntl();
  const router = useRouter();
  const token: string | null = useMemo(() => {
    return typeof router.query?.token === "string" ? router.query.token : null;
  }, [router.query]);

  const [error, setError] = useState(false);

  const onVerify = useCallback(async () => {
    try {
      const response = await request(intl.locale, UPDATE_CUSTOMER_EMAIL, {
        token,
      });
      if (!response.updateCustomerEmailAddress) {
        throw new Error("updateCustomerEmailAddress: false");
      }

      router.push(
        `/${intl.locale}/${pathnamesByLanguage.account.languages[intl.locale]}`
      );
    } catch (e) {
      setError(true);
      console.error(e);
    }
  }, [token, intl.locale, router]);

  return (
    <Card>
      <h2>{intl.formatMessage(page.verifyNewEmail)}</h2>
      <Button onClick={onVerify} controlled state={error ? "disabled" : ""}>
        {intl.formatMessage(messages.verifyNewEmail)}
      </Button>
      {error && (
        <>
          <br />
          <Message>{intl.formatMessage(messages.invalidLink)}</Message>
        </>
      )}
    </Card>
  );
};

export default VerifyNewEmail;
