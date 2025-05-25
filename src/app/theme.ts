import { createTheme, theme } from "flowbite-react";
import { twMerge } from "flowbite-react/helpers/tailwind-merge";
import type { CustomFlowbiteTheme } from "flowbite-react/types";

export const customTheme: CustomFlowbiteTheme = createTheme({
  button: {
    base: twMerge(theme.button.base, "cursor-pointer"),
  },
  dropdown: {
    inlineWrapper: twMerge(theme.dropdown.inlineWrapper, "cursor-pointer"),
  },
  toast: {
    toggle: {
      base: twMerge(theme.toast.toggle.base, "cursor-pointer"),
    },
  },
  spinner: {
    color: {
      primary: "fill-primary",
      secondary: "fill-secondary",
      accent: "fill-accent",
    },
  },
  tabs: {
    tablist: {
      tabitem: {
        base: twMerge(theme.tabs.tablist.tabitem.base, "cursor-pointer"),
      },
    },
  },
});
