import React from "react";
import { connect } from "react-redux";

import Link from "components/Link";

import { fetch as fetchCategories } from "actions/product/categories";

import { getProductCategories } from "reducers";

import Categories from "components/Categories";

//not a container yet but will be one in the future
class Dashboard extends React.PureComponent {
	componentWillMount = () => {
		const { dispatch } = this.props;

		dispatch(fetchCategories());
	};
	render = () => {
		const { categories } = this.props;
		return (
			<div>
				<Categories categories={categories} />
				<Link styled={false}>unstyled</Link>
				<Link to="/login">Login</Link>
			</div>
		);
	};
}

const mapStateToProps = state => ({
	categories: getProductCategories(state)
});

export default connect(mapStateToProps)(Dashboard);
