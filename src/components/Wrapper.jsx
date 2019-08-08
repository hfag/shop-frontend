import React from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { Flex, Box } from "reflexbox";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Header from "../containers/Header";
import Breadcrumbs from "../containers/Breadcrumbs";
import Footer from "../components/Footer";
import Container from "./Container";
import CategoriesSidebar from "../containers/sidebar/CategoriesSidebar";
import ProductSidebar from "../containers/sidebar/ProductSidebar";
import Card from "./Card";
import MediaQuery from "./MediaQuery";
import Sidebar from "../containers/Sidebar";
import ScrollToTop from "./ScrollToTop";
import { getLanguage } from "../reducers";
import { pathnamesByLanguage } from "../utilities/urls";

const Wrapper = React.memo(({ language, children }) => {
  return (
    <ThemeProvider
      theme={{
        breakpoints: ["36rem", "48rem", "62rem", "75rem"]
      }}
    >
      <ScrollToTop>
        <Header />
        <main>
          <Flex>
            <Box width={[0, 0, 0, 1 / 6]}>
              <Sidebar>
                <Switch>
                  <Route
                    path={`/${language}/${
                      pathnamesByLanguage[language].productCategory
                    }`}
                    component={CategoriesSidebar}
                  />
                  <Route
                    path={`/${language}/${
                      pathnamesByLanguage[language].product
                    }/:productSlug`}
                    component={ProductSidebar}
                  />
                  <Route path="*" component={CategoriesSidebar} />
                </Switch>
              </Sidebar>
            </Box>
            <Box width={[1, 1, 1, 5 / 6]}>
              <Container>
                <Breadcrumbs />
                {children}
              </Container>
            </Box>
          </Flex>
        </main>
        <Footer />
      </ScrollToTop>
    </ThemeProvider>
  );
});

Wrapper.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = state => ({ language: getLanguage(state) });
const ConnectedWrapper = connect(mapStateToProps)(Wrapper);
export default withRouter(ConnectedWrapper);
