import "./App.css";
import { useCallback, useEffect, useReducer } from "react";

import { TodoItem } from "@/components/todo-item";
import { Button } from "@/components/ui/button";
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

const colors = ["red", "blue", "green", "yellow"];

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
            id: (state.todos.length + 1).toString(),
            title: action.title,
            days: Array.from({ length: 365 }).map(() => false),
            color: getColorStyles(
              colors[Math.floor(Math.random() * colors.length)]
            ),
          },
        ],
      };
    case "TEMP_ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: (state.todos.length + 1).toString(),
            title: `New Todo ${state.todos.length + 1}`,
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

  const tempAdd = useCallback(() => {
    dispatch({ type: "TEMP_ADD_TODO" });
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
    <div className="pt-12 w-full flex flex-col flex-wrap gap-4 items-center bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-white rounded-lg shadow-lg">
        Todo App
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
      <Button
        onClick={tempAdd}
        className="bg-white border-blue-600 border-2 text-black"
      >
        Add
      </Button>

      <div className = "absolute top-0 right-0 m-4">
        <AddTodoForm addNew={addNew} />
      </div>
    </div>
  );
};

export default App;
