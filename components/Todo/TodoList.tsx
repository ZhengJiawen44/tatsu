import React, { useEffect, useState } from "react";

interface TodoItem {
  title: string;
  description?: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("/api/todo", { method: "GET" });
      const { todos } = await res.json();

      setTodos(todos);
      console.log(todos);
    };
    fetchTodos();
  }, []);

  return (
    <>
      {todos &&
        todos.map(({ id, title, description }) => {
          return <TodoItem key={id} title={title} description={description} />;
        })}
    </>
  );
};

const TodoItem = ({ title, description }: TodoItem) => {
  return (
    <div className="flex flex-col gap-3">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  );
};
export default TodoList;
