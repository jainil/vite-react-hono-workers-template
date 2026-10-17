import { Route, Switch } from "wouter";

import HomePage from "~/features/home/pages/home-page";

export const AppRoutes = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route>
      <h1>Page not found</h1>
    </Route>
  </Switch>
);
