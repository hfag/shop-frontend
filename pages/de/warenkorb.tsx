import { useIntl } from "react-intl";
import Wrapper from "../../components/layout/Wrapper";
import Cart from "../../components/Cart";
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
          name: intl.formatMessage(page.cart),
          url: `/${intl.locale}/${
            pathnamesByLanguage.cart.languages[intl.locale]
          }`,
        },
      ]}
    >
      <Cart />
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);
