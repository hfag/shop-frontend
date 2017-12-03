import React from "react";
import { connect } from "react-redux";

import { push } from "react-router-redux";

import Page from "components/Page";

import { login } from "actions/authentication-token";

class Login extends React.PureComponent {
	constructor() {
		super();

		this.state = { email: "", password: "" };
	}
	onChangeEmail = e => this.setState({ email: e.currentTarget.value });
	onChangePassword = e => this.setState({ password: e.currentTarget.value });

	onSubmit = e => {
		e.preventDefault();
		e.stopPropagation();

		this.props
			.dispatch(login(this.state.email, this.state.password))
			.then(() => {
				this.props.dispatch(push("/"));
			});
	};

	render = () => {
		return (
			<Page>
				<form onSubmit={this.onSubmit}>
					<h1>Login</h1>
					<label>E-Mail Adresse</label>
					<input
						type="email"
						onChange={this.onChangeEmail}
						value={this.state.email}
					/>
					<label>Passwort</label>
					<input
						type="password"
						onChange={this.onChangePassword}
						value={this.state.password}
					/>
					<input type="submit" />
				</form>
			</Page>
		);
	};
}

export default connect()(Login);
