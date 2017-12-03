import React from "react";
import { connect } from "react-redux";

import Link from "components/Link";

//not a container yet but will be one in the future
class Dashboard extends React.PureComponent {
	render = () => {
		return (
			<div>
				<Link styled={false}>unstyled</Link>
				<Link to="/login">Login</Link>
			</div>
		);
	};
}

export default connect()(Dashboard);
