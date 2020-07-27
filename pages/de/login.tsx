import Wrapper from "../../components/layout/Wrapper";
import Login from "../../components/Login";
import { useIntl } from "react-intl";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";
import { locale, messages } from "./config.json";
import { withApp } from "../../components/AppWrapper";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.login),
          url: `/${intl.locale}/${
            pathnamesByLanguage.login.languages[intl.locale]
          }`,
        },
      ]}
    >
      <Login />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
