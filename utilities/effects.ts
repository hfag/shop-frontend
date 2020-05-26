import { useEffect } from "react";

/**
 * Display the compass
 */
export const useCompass = () => {
  useEffect(() => {
    document.body.classList.add("compass");

    return () => {
      document.body.classList.remove("compass");
    };
  });
};
