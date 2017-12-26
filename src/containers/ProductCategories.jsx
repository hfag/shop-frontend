import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";

import { Flex, Box } from "grid-styled";

import Link from "components/Link";
import Container from "components/Container";
import Pagination from "../components/Pagination";
import Category from "containers/Category";
import Product from "containers/Product";

import { fetchAll as fetchProductCategories } from "actions/product/categories";
import { fetchItems as fetchProductPage } from "actions/product";

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
			fetchProducts();
		}
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
				<Flex wrap>
					{categoryIds.length > 0 &&
						categoryIds.map(categoryId => (
							<Box
								key={categoryId}
								width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
								pr={2}
								pt={2}
							>
								<Link to={"/category/" + categoryId + "/1"}>
									<Category id={categoryId} />
								</Link>
							</Box>
						))}
					{productIds.length > 0 &&
						productIds.map(productId => (
							<Box
								key={productId}
								width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
								pr={2}
								pt={2}
							>
								<Link to={"/product/" + productId}>
									<Product id={productId} />
								</Link>
							</Box>
						))}
					{categoryIds.length === 0 &&
						productIds.length === 0 &&
						new Array(12).fill().map((el, index) => (
							<Box
								key={index}
								width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
								pr={2}
								pt={2}
							>
								<Category id={-1} />
							</Box>
						))}
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
	fetchProducts() {
		page = parseInt(page);
		return categoryId
			? dispatch(
					fetchProductPage(page, page, {
						categoryIds: [parseInt(categoryId)]
					})
				)
			: Promise.resolve();
	}
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ProductCategories)
);
