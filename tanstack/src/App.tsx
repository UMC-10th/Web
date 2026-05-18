import "./App.css";
import { WelcomeData } from "./component/UserDataDisplay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  );
}

export default App;
