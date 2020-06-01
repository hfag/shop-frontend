import { useIntl } from "react-intl";
import Wrapper from "../../components/layout/Wrapper";
import Cart from "../../components/Cart";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";

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

export default Page;
