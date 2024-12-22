import "./App.css";
import { useCallback, useReducer } from "react";

import { TodoItem } from "@/components/todo-item";
import { Button } from "@/components/ui/button";
import { AddTodoForm } from "./components/add-todo-form";

type Todo = {
  id: string;
  title: string;
  days: boolean[];
};

type State = {
  todos: Todo[];
};

type Action =
  | { type: "TOGGLE_DAY"; id: string; index: number }
  | { type: "DELETE_TODO"; id: string }
  | { type: "ADD_TODO"; title: string}
  | { type: "TEMP_ADD_TODO" };

const initialState: State = {
  todos: [],
};

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
          },
        ],
      }
    case "TEMP_ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: (state.todos.length + 1).toString(),
            title: `New Todo ${state.todos.length + 1}`,
            days: Array.from({ length: 365 }).map(() => false),
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

  return (
    <div className="pt-12 w-full flex flex-col flex-wrap gap-4 justify-center items-center bg-black text-white min-h-screen">
      {state.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          days={todo.days}
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
      <Button onClick={() => console.log(state.todos)}>Log info</Button>
      <AddTodoForm 
        addNew = {addNew}
      />
    </div>
  );
};

export default App;
