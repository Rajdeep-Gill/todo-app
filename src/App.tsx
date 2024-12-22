import "./App.css";
import { useCallback, useEffect, useReducer } from "react";

import { createId } from "@paralleldrive/cuid2";

import { TodoItem } from "@/components/todo-item";

import { AddTodoForm } from "./components/add-todo-form";
import { colorObj, getColorStyles } from "./lib/utils";
import { GlobalTodo } from "./components/global-todo";

export type Todo = {
  id: string;
  title: string;
  days: boolean[];
  color: colorObj;
};

type State = {
  todos: Todo[];
};

type Action =
  | { type: "TOGGLE_DAY"; id: string; index: number }
  | { type: "DELETE_TODO"; id: string }
  | { type: "ADD_TODO"; title: string }
  | { type: "TEMP_ADD_TODO" };

const initialState: State = {
  todos: JSON.parse(localStorage.getItem("todos") || "[]") || [],
};

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "teal", "gray"];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_DAY":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id
            ? {
                ...todo,
                days: todo.days.map((day, i) =>
                  i === action.index ? !day : day
                ),
              }
            : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: createId(),
            title: action.title,
            days: Array.from({ length: 365 }).map(() => false),
            color: getColorStyles(
              colors[Math.floor(Math.random() * colors.length)]
            ),
          },
        ],
      };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleDay = useCallback((id: string, index: number) => {
    dispatch({ type: "TOGGLE_DAY", id, index });
  }, []);

  const handleDelete = useCallback((id: string) => {
    dispatch({ type: "DELETE_TODO", id });
  }, []);

  const addNew = useCallback((title: string) => {
    dispatch({ type: "ADD_TODO", title });
  }, []);

  // if state ever changes, update save state to local storage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
    console.log("State updated");
  }, [state]);

  return (
    <div className="mt-12 w-full flex flex-col flex-wrap gap-4 items-center bg-black text-white min-h-screen mb-12">
      <h1 className="text-4xl font-bold text-center text-white rounded-lg shadow-lg pb-6">
        Todo List
      </h1>      
      <GlobalTodo 
        allTodos = {state.todos}
      />
      {state.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          days={todo.days}
          color={todo.color}
          handleDelete={handleDelete}
          toggleDay={toggleDay}
        />
      ))}
      <div className = "absolute top-0 right-0 m-4">
        <AddTodoForm addNew={addNew} />
      </div>
      <footer className="relative bottom-0 w-full">
        <p className="text-center text-white text-sm">
          Go back to {" "}
          <a
            href="
            https://rajdeepgill.me"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            portfolio
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
