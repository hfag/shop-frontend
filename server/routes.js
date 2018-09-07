import Frontpage from "../src/containers/Frontpage";
import ProductCategories from "../src/containers/ProductCategories";
import Product from "../src/containers/Product";
import Account from "../src/containers/Account";
import Cart from "../src/containers/Cart";
import Login from "../src/containers/Login";
import Logout from "../src/containers/Logout";
import { fetchCountries } from "../src/actions/countries";
import { fetchProductIfNeeded } from "../src/actions/product";
import { fetchAllProductCategoriesIfNeeded } from "../src/actions/product/categories";
import Page404 from "../src/containers/404";

const routes = [
  {
    path: "/",
    component: Frontpage,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    path: "/produkte",
    component: ProductCategories,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    path: "/produkt/:productSlug",
    component: Product,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(
      store,
      route,
      {
        params: { productSlug }
      }
    ) {
      return Promise.all([
        store.dispatch(fetchProductIfNeeded(productSlug, false)),
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    path: "/login",
    component: Login,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    path: "/logout",
    component: Logout,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    path: "/konto",
    component: Account,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    path: "/warenkorb",
    component: Cart,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  },
  {
    component: Page404,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match) {
      return Promise.all([
        store.dispatch(fetchAllProductCategoriesIfNeeded(100, false)),
        store.dispatch(fetchCountries())
      ]);
    }
  }
];

export default routes;
