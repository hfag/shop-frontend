import { useIntl } from "react-intl";
import React, { FunctionComponent, ReactNode, useMemo } from "react";
import Router, { useRouter } from "next/router";

import Box from "./Box";
import Breadcrumbs, { Breadcrumb } from "../Breadcrumbs";
import Container from "./Container";
import Flex from "./Flex";
import Footer from "../Footer";
import Header from "../header/Header";
import ScrollToTop from "../helpers/ScrollToTop";
import ScrollToTopButton from "../helpers/ScrollToTopButton";
import Sidebar from "./sidebar/Sidebar";
import SupportButton from "../helpers/SupportButton";

const Wrapper: FunctionComponent<{
  sidebar: ReactNode;
  children: ReactNode;
  breadcrumbs: Breadcrumb[];
}> = React.memo(({ sidebar = null, breadcrumbs = [], children }) => {
  const intl = useIntl();
  const router = useRouter();

  const showBreadcrums = useMemo(
    () => router.pathname !== `/${intl.locale}`,
    [router.pathname, intl.locale]
  );

  return (
    <ScrollToTop>
      <Header />
      <div>
        <Flex>
          <Box widths={[0, 0, 0, 1 / 6, 1 / 6]}>
            {sidebar && <Sidebar>{sidebar}</Sidebar>}
          </Box>
          <Box widths={[1, 1, 1, 5 / 6, 5 / 6]}>
            <Container>
              {showBreadcrums && <Breadcrumbs breadcrumbs={breadcrumbs} />}
              {children}
            </Container>
          </Box>
        </Flex>
      </div>
      <Footer />
      <SupportButton />
      <ScrollToTopButton />
    </ScrollToTop>
  );
});

export default Wrapper;
