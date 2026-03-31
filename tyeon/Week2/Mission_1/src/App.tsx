import Todo from "./components/Todo";
import { WorkProvider } from "./context/WorkContext";

function App() {
  return <>
    <WorkProvider>
      <Todo />
    </WorkProvider>
  </>
}

export default App
