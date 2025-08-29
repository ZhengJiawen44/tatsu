import React from "react";
import TodoFormProvider from "@/providers/TodoFormProvider";
import TodoForm from "./TodoForm";
import { TodoItemType } from "@/types";

interface TodoFormContainerProps {
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
  todo?: TodoItemType;
}
const TodoFormContainer = ({
  displayForm,
  setDisplayForm,
  todo,
}: TodoFormContainerProps) => {
  return (
    <TodoFormProvider todoItem={todo}>
      <TodoForm displayForm={displayForm} setDisplayForm={setDisplayForm} />
    </TodoFormProvider>
  );
};

export default TodoFormContainer;
