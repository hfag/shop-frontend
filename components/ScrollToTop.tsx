import React, {
  FunctionComponent,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { pathnamesByLanguage } from "../utilities/urls";
import { useRouter } from "next/router";

const ScrollToTop: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [lastLocation, setLastLocation] = useState(router.pathname);
  useEffect(() => {
    if (lastLocation !== router.pathname) {
      setLastLocation(router.pathname);
      if (
        false &&
        // this.props.burgerMenuOpen &&
        !this.props.location.pathname.includes(
          pathnamesByLanguage[this.props.language].productCategory
        )
      ) {
        // this.props.dispatch(toggleBurgerMenu());
      }
      window.scrollTo({ left: 0, top: 0 });
    }
  }, [router.pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
