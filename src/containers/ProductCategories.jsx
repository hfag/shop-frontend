import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";
import Flex from "components/Flex";
import Link from "components/Link";
import Container from "components/Container";
import Pagination from "components/Pagination";
import CategoryItem from "containers/CategoryItem";
import ProductItem from "containers/ProductItem";
import { fetchProductCategories } from "actions/product/categories";
import { fetchProducts } from "actions/product";
import { fetchAttachments } from "actions/attachments";
import {
	getProducts,
	getProductCategoryChildrenIds,
	getProductCategoryById
} from "reducers";

const ITEMS_PER_PAGE = 30;

/**
 * Renders all product categories
 * @returns {Component} The component
 */
class ProductCategories extends React.PureComponent {
	constructor(props) {
		super(props);
		const {
			match: {
				params: { categoryId, page }
			}
		} = props;

		this.state = {
			categoryId,
			page
		};
	}
	componentWillMount = () => {
		this.loadData();
	};
	componentDidUpdate = () => {
		const {
			match: {
				params: { categoryId, page }
			}
		} = this.props;
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
		const {
			match: {
				params: { categoryId, page }
			}
		} = this.props;
		this.props.dispatch(push("/category/" + categoryId + "/" + (selected + 1)));
	};
	render = () => {
		const {
			category,
			categoryIds,
			productIds,
			match: {
				params: { categoryId, page }
			}
		} = this.props;

		return (
			<Container>
				<Flex flexWrap="wrap">
					{categoryIds.map(categoryId => 
						<CategoryItem key={categoryId} id={categoryId} />
					)}
				</Flex>
				{categoryIds.length > 0 && productIds.length > 0 && <hr />}
				<Flex flexWrap="wrap">
					{productIds.map(productId => 
						<ProductItem key={productId} id={productId} />
					)}

					{categoryIds.length === 0 &&
						productIds.length === 0 &&
						new Array(12)
							.fill()
							.map((el, index) => <CategoryItem key={index} id={-1} />)}
				</Flex>
				{productIds.length !== 0 && 
					<Pagination
						pageCount={Math.ceil(productIds.length / ITEMS_PER_PAGE)}
						pageRangeDisplayed={5}
						marginPagesDisplayed={1}
						previousLabel={"<"}
						nextLabel={">"}
						forcePage={parseInt(page) - 1}
						onPageChange={this.onPageChange}
					/>
				}
			</Container>
		);
	};
}

const mapStateToProps = (
	state,
	{
		match: {
			params: { categoryId, page }
		}
	}
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
			.slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page) || [],
	page
});

const mapDispatchToProps = (
	dispatch,
	{
		match: {
			params: { categoryId, page }
		}
	}
) => ({
	dispatch,
	/**
	 * Fetches all product catrgories
	 * @param {number} perPage The amount of items per page
	 * @param {boolean} visualize Whether the progress should be visualized
	 * @returns {Promise} The fetch promise
	 */
	fetchAllProductCategories(perPage = ITEMS_PER_PAGE, visualize = true) {
		return dispatch(fetchProductCategories(perPage, visualize));
	},
	/**
	 * Fetches the matching products
	 * @param {number} perPage The amount of products per page
	 * @param {visualize} visualize Whether the progress should be visualized
	 * @returns {Promise} The fetch promise
	 */
	fetchProducts(perPage = ITEMS_PER_PAGE, visualize = true) {
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

const connectedCategories = connect(mapStateToProps, mapDispatchToProps)(
	ProductCategories
);

export default withRouter(connectedCategories);
