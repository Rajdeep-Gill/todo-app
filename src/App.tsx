import "react";
import { createContext, useState } from "react";
import "./App.css";
import { AddNewTodo } from "./components/add-new-todo";
import { ToDo } from "./components/todo";
import { Button } from "./components/ui/button";

type Todo = {
  title: string;
  color: string;
};

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const ToDoContext = createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
});

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { title: "Zeroth todo", color: "red" },
  ]);

  // set a default list of todos
  // Todos will be of type {title: string, color: string}[]
  const colors = ["red", "blue", "green", "yellow"];

  return (
    <div className="pt-12 min-h-screen w-full flex flex-col flex-wrap gap-4 justify-center items-center bg-slate-500 overflow-hidden">
      <Button
        onClick={() => {
          setTodos((previous) => [
            ...previous,
            {
              title: "New todo" + previous.length,
              color: "Red",
            },
          ]);
          console.log(todos);
        }}
      >
        Test It
      </Button>
      <ToDoContext.Provider value={{ todos, setTodos }}>
        <AddNewTodo />
        <div className="flex flex-col min-h-screen gap-10">
          {todos.map((todo, index) => (
            <ToDo key={index} title={todo.title} color={todo.color} />
          ))}
        </div>
      </ToDoContext.Provider>
    </div>
  );
}

export default App;
