import Wrapper from "../../components/layout/Wrapper";
import { useIntl } from "react-intl";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";
import VerifyNewEmail from "../../components/VerifyNewEmail";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.verifyEmail),
          url: `/${intl.locale}/${
            pathnamesByLanguage.verifyNewEmail.languages[intl.locale]
          }`,
        },
      ]}
    >
      <VerifyNewEmail />
    </Wrapper>
  );
};

export default Page;
