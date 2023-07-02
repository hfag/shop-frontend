import * as yup from "yup";
import { Form, FormikProps, withFormik } from "formik";
import { IntlShape, defineMessages, useIntl } from "react-intl";
import { Mutation } from "../schema";
import { NextRouter, useRouter } from "next/router";
import { VERIFY_ACCOUNT } from "../gql/authentication";
import { errorCodeToMessage } from "../utilities/i18n";
import { pathnamesByLanguage } from "../utilities/urls";
import Button from "./elements/Button";
import Card from "./layout/Card";
import InputField from "./form/InputField";
import React, { FunctionComponent, useMemo } from "react";
import page from "../i18n/page";
import request from "../utilities/request";
import user from "../i18n/user";

const messages = defineMessages({
  instructions: {
    id: "VerifyEmail.instructions",
    defaultMessage:
      "Geben Sie hier ein Passwort an mit dem Sie sich später bei ihrem Benutzerkonto anmelden möchten. Danach kann das Konto angelegt werden und Sie können sich wie gewohnt anmelden.",
  },
  verifyEmail: {
    id: "VerifyEmail.verifyEmail",
    defaultMessage: "Email verifizieren und Benutzerkonto anlegen",
  },
  invalidLink: {
    id: "VerifyEmail.invalidLink",
    defaultMessage: "Der Link aus der E-Mail ist abgelaufen.",
  },
});

interface IProps {
  intl: IntlShape;
  token?: string;
  router: NextRouter;
}

interface FormValues {
  password?: string;
}

const InnerForm = ({
  isValid,
  status,
  intl,
}: IProps & FormikProps<FormValues>) => (
  <Form>
    <InputField
      type="password"
      label={intl.formatMessage(user.password)}
      name="password"
      required={true}
    />
    <br />
    <Button fullWidth controlled state={isValid ? status : "disabled"}>
      {intl.formatMessage(messages.verifyEmail)}
    </Button>
  </Form>
);

const VerifyEmailForm = withFormik<IProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: (/*props*/) => ({}),
  validationSchema: () =>
    yup.object().shape({
      password: yup.string().min(7).required(),
    }),
  handleSubmit: async (
    { password },
    { props: { intl, router, token }, setStatus, setErrors }
  ) => {
    setStatus("loading");
    try {
      const data = await request<{
        verifyCustomerAccount: Mutation["verifyCustomerAccount"];
      }>(intl.locale, VERIFY_ACCOUNT, {
        token,
        password,
      });
      if ("errorCode" in data.verifyCustomerAccount) {
        throw new Error(errorCodeToMessage(intl, data.verifyCustomerAccount));
      }

      setStatus("success");
      router.push(
        `/${intl.locale}/${pathnamesByLanguage.login.languages[intl.locale]}`
      );
    } catch (e) {
      const msg = "message" in e ? e.message : JSON.stringify(e);

      setErrors({ password: msg });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }
  },
})(InnerForm);

const VerifyEmail: FunctionComponent = () => {
  const intl = useIntl();
  const router = useRouter();
  const token: string | undefined = useMemo(() => {
    return typeof router.query?.token === "string"
      ? router.query.token
      : undefined;
  }, [router.query]);

  return (
    <Card>
      <h2>{intl.formatMessage(page.verifyEmail)}</h2>
      <p>{intl.formatMessage(messages.instructions)}</p>
      <VerifyEmailForm intl={intl} router={router} token={token} />
    </Card>
  );
};

export default VerifyEmail;
