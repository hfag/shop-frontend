import { FunctionComponent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ClientOnlyPortal: FunctionComponent<{
  selector: string;
  children: React.ReactNode;
}> = ({ children, selector }) => {
  const ref = useRef<Element | DocumentFragment>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector) || undefined;
    setMounted(true);
  }, [selector]);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default ClientOnlyPortal;
