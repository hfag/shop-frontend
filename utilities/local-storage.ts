/**
 * Loads the previously stored state from localStorage
 */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

/**
 * Stores the current redux state in the localStorage
 */
export const saveState = (state: { [key: string]: any }) => {
  try {
    const serializedState = JSON.stringify(state);

    localStorage.setItem("state", serializedState);
  } catch (err) {
    throw err;
  }
};
