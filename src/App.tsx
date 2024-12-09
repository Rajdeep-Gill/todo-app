import "react";
import { createContext, useState } from "react";
import "./App.css";
import { AddNewTodo } from "./components/add-new-todo";
import { ToDo } from "./components/todo";
import { Button } from "./components/ui/button";
import { createId } from "@paralleldrive/cuid2";
import { GlobalTodo } from "./components/global-todo";

type Todo = {
  title: string;
  color: string;
  id: string;
  days: boolean[];
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
  const [todos, setTodos] = useState<Todo[]>([]);

  // set a default list of todos
  // Todos will be of type {title: string, color: string}[]
  return (
    <div className="pt-12 w-full flex flex-col flex-wrap gap-4 justify-center items-center bg-black">
      <ToDoContext.Provider value={{ todos, setTodos }}>
        <div className="flex flex-col gap-10">
          <GlobalTodo />
          {todos.map((todo, index) => (
            <ToDo
              key={index}
              title={todo.title}
              color={todo.color}
              id={todo.id}
              days={todo.days}
            />
          ))}
        </div>
        <AddNewTodo />
        <Button
          onClick = {() => {
            setTodos([
              ...todos,
              {
                title: "Test Todo",
                color: "red",
                id: createId(),
                days: Array.from({ length: 365 }).map(() => false),
              },
            ]);
          }}
        >
          Test Todo add
        </Button>
      </ToDoContext.Provider>
    </div>
  );
}

export default App;
