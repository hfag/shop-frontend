import { createBrowserHistory, createMemoryHistory } from "history";

import { isServer } from "./utilities/ssr";

const history = isServer
  ? createMemoryHistory({
      initialEntries: ["/"]
    })
  : createBrowserHistory();

export default history;
