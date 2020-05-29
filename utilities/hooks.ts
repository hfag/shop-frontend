import { isClient } from "./ssr";

export const useLocalStorage = (
  key: string
): [string | null, (value: string) => void] => {
  if (isClient) {
    return [
      localStorage.getItem(key),
      (value: string) => localStorage.setItem(key, value),
    ];
  } else {
    return [null, () => {}];
  }
};
