/**
 * The burger menu reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const burgerMenuReducer = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_BURGER_MENU":
      return !state;
    default:
      return state;
  }
};

export default burgerMenuReducer;

/**
 * Gets all countries
 * @param {Object} state The redux state
 * @returns {Object} Whether the burger menu is open
 */
export const getBurgerMenuOpen = state => state;
