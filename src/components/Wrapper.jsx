import React from "react";
import PropTypes from "prop-types";

import Header from "containers/Header";
import Footer from "components/Footer";

class Wrapper extends React.Component {
	render = () => {
		const { children } = this.props;
		//"outer-container" and "page-wrap" are used by "react-burger-menu"
		return (
			<div id="outer-container">
				<Header />
				<main id="page-wrap">{children}</main>
				<Footer />
			</div>
		);
	};
}

Wrapper.propTypes = {
	children: PropTypes.node
};

export default Wrapper;
