import { FunctionComponent, useMemo } from "react";
import { withFormik, Form, FormikProps } from "formik";
import * as yup from "yup";
import { IntlShape, defineMessages, useIntl } from "react-intl";
import InputField from "./form/InputField";
import user from "../i18n/user";
import page from "../i18n/page";
import { VERIFY_ACCOUNT } from "../gql/authentication";
import Button from "./elements/Button";
import request from "../utilities/request";
import { mutate } from "swr";
import { useRouter, NextRouter } from "next/router";
import Card from "./layout/Card";
import { pathnamesByLanguage } from "../utilities/urls";
import { Mutation } from "../schema";
import { errorCodeToMessage } from "../utilities/i18n";

const messages = defineMessages({
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
  router?: NextRouter;
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
  mapPropsToValues: (props) => ({}),
  validationSchema: ({ intl }: IProps) =>
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

const VerifyEmail: FunctionComponent<{}> = (props) => {
  const intl = useIntl();
  const router = useRouter();
  const token: string | null = useMemo(() => {
    return typeof router.query?.token === "string" ? router.query.token : null;
  }, [router.query]);

  return (
    <Card>
      <h2>{intl.formatMessage(page.verifyEmail)}</h2>
      <VerifyEmailForm intl={intl} router={router} token={token} />
    </Card>
  );
};

export default VerifyEmail;
