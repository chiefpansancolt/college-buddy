"use client";

import { customTheme } from "@/app/theme";
import { ThemeProvider } from "flowbite-react";
import { ToastContainer } from "react-toastify";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider theme={customTheme}>
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
		</ThemeProvider>
	);
}
