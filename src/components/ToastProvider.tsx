"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        closeButton={false}
        hideProgressBar
        newestOnTop
        draggable
        stacked
        className={"mt-14 lg:mt-0 lg:mr-24"}
        toastClassName={
          "shadow-md rounded-lg text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800 p-0"
        }
      />
    </>
  );
}
