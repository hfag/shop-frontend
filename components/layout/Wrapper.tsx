import React, { useMemo, FunctionComponent, ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Flex, Box } from "reflexbox";
import Router, { useRouter } from "next/router";

import { useIntl } from "react-intl";
import Header from "../Header";
import Breadcrumbs, { Breadcrumb } from "../Breadcrumbs";
import Footer from "../Footer";
import Container from "./Container";
import Sidebar from "../Sidebar";
import ScrollToTop from "../ScrollToTop";
import ScrollToTopButton from "../buttons/ScrollToTopButton";
import SupportButton from "../buttons/SupportButton";

const Wrapper: FunctionComponent<{
  sidebar: ReactNode;
  children: ReactNode;
  breadcrumbs: Breadcrumb[];
}> = React.memo(({ sidebar = null, breadcrumbs = [], children }) => {
  const intl = useIntl();
  const router = useRouter();

  const showBreadcrums = useMemo(() => router.pathname !== `/${intl.locale}`, [
    router.pathname,
    intl.locale
  ]);

  return (
    <ThemeProvider
      theme={{
        breakpoints: ["36rem", "48rem", "62rem", "75rem"]
      }}
    >
      <ScrollToTop>
        <Header />
        <div>
          <Flex>
            <Box width={[0, 0, 0, 1 / 6]}>
              {sidebar && <Sidebar>{sidebar}</Sidebar>}
            </Box>
            <Box width={[1, 1, 1, 5 / 6]}>
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
    </ThemeProvider>
  );
});

export default Wrapper;
