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

const InnerForm = ({ isValid, intl }: IProps & FormikProps<FormValues>) => (
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
      const data = await request(intl.locale, VERIFY_ACCOUNT, {
        token,
        password,
      });
      if (data?.verifyCustomerAccount?.user) {
        setStatus("success");
        router.push(
          `/${intl.locale}/${pathnamesByLanguage.login.languages[intl.locale]}`
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      setErrors({ password: intl.formatMessage(messages.invalidLink) });
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
