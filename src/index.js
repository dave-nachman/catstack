import React from "react";
import ReactDOM from "react-dom";

import App from "./ui/App";
import ReactGA from "react-ga";

import "semantic-ui-css/semantic.min.css";
import "./index.css";

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
  gaOptions: { siteSpeedSampleRate: 100 }
});
ReactGA.pageview("/index");

ReactDOM.render(<App />, document.getElementById("root"));
