import { GetStaticProps } from "next";
import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../components/AppWrapper";
import Cart from "../../components/Cart";
import Wrapper from "../../components/layout/Wrapper";
import page from "../../i18n/page";

const Page = (props) => {
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

//do everything client side
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
