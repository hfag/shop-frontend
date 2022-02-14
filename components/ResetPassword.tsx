import { InputFieldWrapper } from "./form/InputFieldWrapper";
import { IntlShape, defineMessages, useIntl } from "react-intl";
import { Mutation } from "../schema";
import { RESET_PASSWORD, UPDATE_CUSTOMER_EMAIL } from "../gql/user";
import { errorCodeToMessage } from "../utilities/i18n";
import { pathnamesByLanguage } from "../utilities/urls";
import { useRouter } from "next/router";
import Button from "./elements/Button";
import Card from "./layout/Card";
import Message from "./elements/Message";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import page from "../i18n/page";
import request from "../utilities/request";

const messages = defineMessages({
  changePassword: {
    id: "ResetPassword.changePassword",
    defaultMessage: "Passwort ändern",
  },
  newPassword: {
    id: "ResetPassword.newPassword",
    defaultMessage: "Neues Passwort",
  },
});

const ResetPassword: FunctionComponent = (props) => {
  const intl = useIntl();
  const router = useRouter();
  const token: string | null = useMemo(() => {
    return typeof router.query?.token === "string" ? router.query.token : null;
  }, [router.query]);

  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const onReset = async () => {
    const data = await request<{
      resetPassword: Mutation["resetPassword"];
    }>(intl.locale, RESET_PASSWORD, {
      token,
      password: newPassword,
    });
    if ("errorCode" in data.resetPassword) {
      setError(errorCodeToMessage(intl, data.resetPassword));
      return;
    }

    router.push(
      `/${intl.locale}/${pathnamesByLanguage.account.languages[intl.locale]}`
    );
  };

  return (
    <Card>
      <h2>{intl.formatMessage(page.resetPassword)}</h2>
      <InputFieldWrapper>
        <label>{intl.formatMessage(messages.newPassword)}</label>
        <input
          type="password"
          value={newPassword}
          autoFocus
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
      </InputFieldWrapper>
      <Button onClick={onReset} controlled state={error ? "disabled" : ""}>
        {intl.formatMessage(messages.changePassword)}
      </Button>
      {error && (
        <>
          <br />
          <Message>{error}</Message>
        </>
      )}
    </Card>
  );
};

export default ResetPassword;
