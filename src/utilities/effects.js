import { useEffect } from "react";

/**
 * Display the compass
 * @returns {void}
 */
export const useCompass = () => {
  useEffect(() => {
    document.body.classList.add("compass");

    return () => {
      document.body.classList.remove("compass");
    };
  });
};
