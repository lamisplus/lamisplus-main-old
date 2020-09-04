import React from "react";
import componentQueries from "react-component-queries";
import { Provider } from "react-redux";
import store from "./../src/main/webapp/store";
import Routes from "./../src/main/webapp/routes";
import { Route, Router } from "react-router-dom";
import { history } from "./main/webapp/history"


//import { ToastProvider } from 'react-toast-notifications'

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <Router history={history}>
          <Routes/>
          <Route path="/login" />
        </Router>
      </Provider>
    </div>
  );
};

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: "xs" };
  }

  if (576 < width && width < 767) {
    return { breakpoint: "sm" };
  }

  if (768 < width && width < 991) {
    return { breakpoint: "md" };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: "lg" };
  }

  if (width > 1200) {
    return { breakpoint: "xl" };
  }

  return { breakpoint: "xs" };
};

export default componentQueries(query)(App);