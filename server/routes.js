import Frontpage from "../src/containers/Frontpage";
import ProductCategories from "../src/containers/ProductCategories";
import Product from "../src/containers/Product";
import Account from "../src/containers/Account";
import Cart from "../src/containers/Cart";
import Login from "../src/containers/Login";
import Logout from "../src/containers/Logout";
import { fetchCountriesIfNeeded } from "../src/actions/countries";
import { fetchProductIfNeeded } from "../src/actions/product";
import { fetchAllProductCategoriesIfNeeded } from "../src/actions/product/categories";
import Page404 from "../src/containers/404";
import Post from "../src/containers/Post";
import Page from "../src/containers/Page";
import { fetchSalesIfNeeded } from "../src/actions/sales";
import { fetchPostIfNeeded } from "../src/actions/posts";
import { fetchPageIfNeeded } from "../src/actions/pages";

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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
      ]);
    }
  },
  {
    path: "/produkt-kategorie",
    component: ProductCategories,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(
      store,
      route,
      {
        params: { productSlug }
      },
      languageFetchString
    ) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchProductIfNeeded(productSlug, languageFetchString, false)
        ),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
      ]);
    }
  },
  {
    path: "/beitrag/:postSlug",
    component: Post,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(
      store,
      route,
      {
        params: { postSlug }
      },
      languageFetchString
    ) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(fetchPostIfNeeded(postSlug, languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
      ]);
    }
  },
  {
    path: "/seite/:pageSlug",
    component: Page,
    exact: true,
    /**
     * Fetches the required data for this route
     * @param {Object} store The redux store
     * @param {Object} route The react-router route object
     * @param {Object} match The react-router match object
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(
      store,
      route,
      {
        params: { pageSlug }
      },
      languageFetchString
    ) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(fetchPageIfNeeded(pageSlug, languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
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
     * @param {string} languageFetchString The language fetch string
     * @returns {Promise} The fetch promise
     */
    fetchData(store, route, match, languageFetchString) {
      return Promise.all([
        store.dispatch(fetchSalesIfNeeded(languageFetchString, false)),
        store.dispatch(
          fetchAllProductCategoriesIfNeeded(100, languageFetchString, false)
        ),
        store.dispatch(fetchCountriesIfNeeded(languageFetchString, false))
      ]);
    }
  }
];

export default routes;
