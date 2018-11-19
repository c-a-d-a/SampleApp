import "node_modules/normalize.css/normalize.css";
import "node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "node_modules/@blueprintjs/table/lib/css/table.css";

import "./index.css";
import "src/common/components/panel.module.css";
import "src/common/components/errorFiller.module.css";
import "src/common/components/singleSelect.module.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import registerServiceWorker from "./registerServiceWorker";
import { configureStore } from "src/redux/store";
import { IApplicationState } from "src/redux/rootReducer";
import App from "./App";

const store = configureStore({} as IApplicationState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
