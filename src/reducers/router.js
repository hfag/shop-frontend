import { connectRouter } from "connected-react-router";

import history from "../redux-history";

const router = connectRouter(history);
export default router;
