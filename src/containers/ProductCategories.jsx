import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";

import Flex from "components/Flex";

import Link from "components/Link";
import Container from "components/Container";
import Pagination from "components/Pagination";
import Category from "containers/Category";
import Product from "containers/Product";

import { fetchProductCategories } from "actions/product/categories";
import { fetchProducts } from "actions/product";
import { fetchAttachments } from "actions/attachments";

import {
	getProducts,
	getProductCategoryChildrenIds,
	getProductCategoryById
} from "reducers";

class ProductCategories extends React.PureComponent {
	constructor(props) {
		super(props);
		const { match: { params: { categoryId, page } } } = props;

		this.state = {
			categoryId,
			page,
			fetchedCategories: false,
			fetchedProducts: false
		};
	}
	componentWillMount = () => {
		this.loadData();
	};
	componentDidUpdate = () => {
		const { match: { params: { categoryId, page } } } = this.props;
		if (categoryId !== this.state.categoryId || page !== this.state.page) {
			this.setState({ categoryId, page }, this.loadData);
		}
	};
	loadData = () => {
		const {
			dispatch,
			categoryIds,
			productIds,
			fetchAllProductCategories,
			fetchProducts
		} = this.props;

		if (categoryIds.length === 0 && productIds.length === 0) {
			fetchAllProductCategories();
		}

		fetchProducts();
	};
	onPageChange = ({ selected }) => {
		const { match: { params: { categoryId, page } } } = this.props;
		this.props.dispatch(push("/category/" + categoryId + "/" + (selected + 1)));
	};
	render = () => {
		const {
			category,
			categoryIds,
			productIds,
			match: { params: { categoryId, page } }
		} = this.props;

		return (
			<Container>
				<Flex flexWrap="wrap">
					{categoryIds.length > 0
						? categoryIds.map(categoryId => (
								<Category key={categoryId} id={categoryId} />
							))
						: productIds.map(productId => (
								<Product key={productId} id={productId} />
							))}

					{categoryIds.length === 0 &&
						productIds.length === 0 &&
						new Array(12)
							.fill()
							.map((el, index) => <Category key={index} id={-1} />)}
				</Flex>
				{productIds.length !== 0 &&
					category &&
					category.count && (
						<Pagination
							pageCount={Math.ceil(category.count / 10)}
							pageRangeDisplayed={5}
							marginPagesDisplayed={1}
							previousLabel={"<"}
							nextLabel={">"}
							forcePage={parseInt(page) - 1}
							onPageChange={this.onPageChange}
						/>
					)}
			</Container>
		);
	};
}

const mapStateToProps = (
	state,
	{ match: { params: { categoryId, page } } }
) => ({
	category: getProductCategoryById(state, categoryId),
	categoryIds:
		getProductCategoryChildrenIds(
			state,
			categoryId ? parseInt(categoryId) : undefined
		) || [],
	productIds:
		getProducts(state)
			.filter(product => product.categoryIds.includes(parseInt(categoryId)))
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.map(product => product.id)
			.slice(10 * (page - 1), 10 * page) || [],
	page
});

const mapDispatchToProps = (
	dispatch,
	{ match: { params: { categoryId, page } } }
) => ({
	dispatch,
	fetchAllProductCategories() {
		return dispatch(fetchProductCategories());
	},
	fetchProducts(perPage = 10, visualize = false) {
		page = parseInt(page);
		return categoryId
			? dispatch(
					fetchProducts(
						page,
						page,
						perPage,
						visualize,
						[],
						[parseInt(categoryId)]
					)
				)
			: Promise.resolve();
	}
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ProductCategories)
);
