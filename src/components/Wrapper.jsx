import React from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { Flex, Box } from "grid-styled";
import { Route, Switch } from "react-router-dom";

import Header from "../containers/Header";
import Breadcrumbs from "../containers/Breadcrumbs";
import Footer from "../components/Footer";
import Container from "./Container";
import CategoriesSidebar from "../containers/sidebar/CategoriesSidebar";
import ProductSidebar from "../containers/sidebar/ProductSidebar";
import Card from "./Card";
import MediaQuery from "./MediaQuery";

const SidebarWrapper = styled.div`
  height: 100%;
  padding-bottom: 2rem;

  & > div {
    /* card */
    height: 100%;
  }
`;

/**
 * The global wrapper component
 * @returns {Component} The component
 */
class Wrapper extends React.Component {
  render = () => {
    const { children } = this.props;
    return (
      <ThemeProvider
        theme={{
          breakpoints: ["36rem", "48rem", "62rem", "75rem"]
        }}
      >
        <div>
          <Header />
          <main>
            <Flex>
              <Box width={[0, 0, 0, 1 / 6]}>
                <MediaQuery lg up>
                  <SidebarWrapper>
                    <Card>
                      <Switch>
                        <Route path="/produkte" component={CategoriesSidebar} />
                        <Route
                          path="/produkt/:productSlug"
                          component={ProductSidebar}
                        />
                        <Route path="/" component={CategoriesSidebar} />
                      </Switch>
                    </Card>
                  </SidebarWrapper>
                </MediaQuery>
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
        </div>
      </ThemeProvider>
    );
  };
}

Wrapper.propTypes = {
  children: PropTypes.node
};

export default Wrapper;
