import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import Page from "components/Page";

import queryString from "query-string";

import { receiveWoocommerceCredentials } from "actions/authentication-woocommerce";

class Login extends React.PureComponent {
	componentWillMount = () => {
		const params = queryString.parse(location.search);
		const { dispatch } = this.props;

		if (params.consumerKey && params.consumerSecret) {
			//store and redirect
			dispatch(
				receiveWoocommerceCredentials(params.consumerKey, params.consumerKey)
			);
			dispatch(push("/"));
		} else {
			window.location =
				"https://shop.feuerschutz.ch/wc-auth/v1/login?" +
				"app_name=react-frontend" +
				"&user_id=" +
				Math.random()
					.toString(36)
					.substring(2) +
				"&return_url=https://shop.feuerschutz.ch/wp-json/hfag/wc-callback/development" +
				"&callback_url=https://shop.feuerschutz.ch/wp-json/hfag/wc-callback" +
				"&scope=read_write";
		}
	};

	render = () => {
		return <Page />;
	};
}

export default connect()(Login);
