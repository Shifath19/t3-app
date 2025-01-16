
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function HomePage() {
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  
  const utils = api.useContext();
  
  const { data: tasks, isLoading } = api.task.list.useQuery();
  
  const addTask = api.task.add.useMutation({
    onSuccess: () => {
      setNewTask("");
      setError("");
      void utils.task.list.invalidate();
    },
    onError: (error) => {
      setError(error.message);
    },
  });
  
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void utils.task.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setError("Task title is required");
      return;
    }
    
    addTask.mutate({ title: newTask });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return(
    <>
    {/* Header */}
    <header className="bg-white bg-opacity-80 backdrop-blur-md p-6 shadow-lg">
      <nav className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 font-roboto mb-4 md:mb-0">Task Manager</h1>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          <li><a href="#" className="text-gray-800 hover:text-blue-600 transition font-roboto">Next.js</a></li>
          <li><a href="#" className="text-gray-800 hover:text-blue-600 transition font-roboto">T3 Stack</a></li>
          <li><a href="#" className="text-gray-800 hover:text-blue-600 transition font-roboto">Tailwind CSS</a></li>
          <li><a href="#" className="text-gray-800 hover:text-blue-600 transition font-roboto">tRPC</a></li>
        </ul>
      </nav>
    </header>

    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 font-roboto">Welcome to Your Task Manager</h1>
          <p className="mb-4 text-gray-700 font-roboto">Organize your tasks efficiently with our intuitive interface.</p>
          {/* Add Task Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task..."
                className="flex-1 rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none font-roboto overflow-hidden text-ellipsis"
              />
              <button
                type="submit"
                disabled={addTask.isLoading}
                className="rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition font-roboto"
              >
                Add Task
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 font-roboto">{error}</p>
            )}
          </form>

          {/* Task List */}
          <div className="space-y-3">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-100 p-4"
              >
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-800 font-roboto overflow-hidden text-ellipsis whitespace-nowrap">{task.title}</p>
                  <p className="text-sm text-gray-500 font-roboto">
                    {task.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask.mutate({ id: task.id })}
                  disabled={deleteTask.isLoading}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:outline-none disabled:opacity-50 transition font-roboto"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-white bg-opacity-80 backdrop-blur-md p-6 shadow-lg">
      <div className="text-center">
        <p className="text-sm text-gray-600 font-roboto">Built with ❤️ using Next.js, T3 Stack, Tailwind CSS, and tRPC.</p>
        <p className="text-sm font-roboto">
          <a href="#" className="text-gray-800 hover:text-blue-600 transition">Privacy Policy</a> | 
          <a href="#" className="text-gray-800 hover:text-blue-600 transition">Terms of Service</a>
        </p>
      </div>
    </footer>
    </>
  );
}