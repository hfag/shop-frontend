import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { getLoggedIn } from "reducers";

class Account extends React.PureComponent {
	componentWillMount = () => {
		const { loggedIn, redirectToLogin } = this.props;
		if (!loggedIn) {
			redirectToLogin();
		}
	};

	render = () => {
		return (
			<div>
				<form>
					<h1>Account</h1>
				</form>
			</div>
		);
	};
}

const mapStateToProps = state => ({
	loggedIn: getLoggedIn(state)
});

const mapDispatchToProps = dispatch => ({
	redirectToLogin() {
		dispatch(push("/login"));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
