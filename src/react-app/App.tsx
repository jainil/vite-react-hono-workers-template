import { ErrorBoundary } from "./app/error-boundary";
import { AppRoutes } from "./app/routes";

const App = () => (
  <ErrorBoundary>
    <AppRoutes />
  </ErrorBoundary>
);

export default App;
