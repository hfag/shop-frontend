import Frontpage from "../src/containers/Frontpage";
import ProductCategories from "../src/containers/ProductCategories";
import Product from "../src/containers/Product";
import Account from "../src/containers/Account";
import Cart from "../src/containers/Cart";
import Login from "../src/containers/Login";
import Logout from "../src/containers/Logout";
import { fetchProductCategories } from "../src/actions/product/categories";
import { getProductCategories } from "../src/reducers";

const routes = [
  {
    path: "/",
    component: Frontpage,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @returns {Promise} The fetch promise
     */
    fetchData(store) {
      return store.dispatch(fetchProductCategories(100, false));
    },
    /**
     * Checks whether the data needs to be (re-)fetched
     * @param {Object} store The redux store
     * @returns {boolean} Whether to fetch the data
     */
    shouldFetch(store) {
      return getProductCategories(store.getState()).length === 0;
    }
  },
  {
    path: "/produkte",
    component: ProductCategories
  },
  {
    path: "/produkt/:productSlug",
    component: Product,
    exact: true
  },
  {
    path: "/login",
    component: Login,
    exact: true
  },
  {
    path: "/logout",
    component: Logout,
    exact: true
  },
  {
    path: "/konto",
    component: Account
  },
  {
    path: "/warenkorb",
    component: Cart,
    exact: true
  }
];

export default routes;
