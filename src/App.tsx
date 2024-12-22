import "./App.css";
import { TestComponent } from "./components/memo-text";

function App() {

  return (
    <div className="pt-12 w-full flex flex-col flex-wrap gap-4 justify-center items-center bg-black text-white">
      Hello World
      <TestComponent />
    </div>
  );
}

export default App;
