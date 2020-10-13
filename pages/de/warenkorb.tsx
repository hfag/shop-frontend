import { useIntl } from "react-intl";
import Wrapper from "../../components/layout/Wrapper";
import Cart from "../../components/Cart";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";
import { GetStaticProps } from "next";
import { withApp } from "../../components/AppWrapper";
import { locale, messages } from "./config";

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
