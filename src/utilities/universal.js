import * as React from "react";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { connect } from "react-redux";
import universal from "react-universal-component";

import Wrapper from "../components/Wrapper";
import Card from "../components/Card";

/**
 * Injects a component with the loading bar
 * @param {Component} Component The component to inject the loading bar into
 * @returns {Component} The injected component
 */
export const injectLoadingBar = Component =>
  connect()(props => (
    <Component
      onBefore={() => props.dispatch(showLoading())}
      onAfter={() => setTimeout(() => props.dispatch(hideLoading()), 500)}
      {...props}
    />
  ));

/**
 * Adds custom default values to the options object
 * @param {Object} options The universal options
 * @returns {Object} The options object
 */
export const universalOptions = ({
  loading = props => <Wrapper />,
  error = (props, error) => (
    <Wrapper>
      <Card>
        Es ist ein unerwarteter Fehler aufgetreten. Bitte melde dies dem
        Support!
      </Card>
    </Wrapper>
  ),
  timeout = 15000,
  onError = (error, info) => {
    console.error(error);
  },
  onLoad = (module, info, props, context) => {},
  minDelay = 0,
  alwaysDelay = false,
  loadingTransition = true
} = {}) => ({
  loading,
  error,
  timeout,
  onError,
  onLoad,
  minDelay,
  alwaysDelay,
  loadingTransition
});

const defaultOptions = universalOptions();

/**
 * Combines the two functions injectLoadingBar() and universal()
 * @param {Promise} promise The code splitting promise
 * @param {Object} options The universal options
 * @returns {Component} The react component
 */
export const universalWithLoadingBar = (promise, options = defaultOptions) =>
  injectLoadingBar(universal(promise, options));
