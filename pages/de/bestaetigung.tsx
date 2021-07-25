import { FunctionComponent } from "react";
import { GetStaticProps } from "next";
import { locale, messages } from "./config";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import { withApp } from "../../components/AppWrapper";
import Card from "../../components/layout/Card";
import OrderConfirmation from "../../components/OrderConfirmation";
import Wrapper from "../../components/layout/Wrapper";
import page from "../../i18n/page";

const Page: FunctionComponent<{}> = () => {
  const intl = useIntl();

  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.confirmation),
          url: `/${pathnamesByLanguage.confirmation.languages[intl.locale]}`,
        },
      ]}
    >
      <Card>
        <OrderConfirmation />
      </Card>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};
