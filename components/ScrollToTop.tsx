import React, {
  FunctionComponent,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { pathnamesByLanguage } from "../utilities/urls";
import { useRouter } from "next/router";
import { AppContext } from "../pages/_app";
import { useIntl } from "react-intl";

const ScrollToTop: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const intl = useIntl();
  const { burgerMenuOpen, toggleBurgerMenu } = useContext(AppContext);

  const [lastLocation, setLastLocation] = useState(router.pathname);
  useEffect(() => {
    if (lastLocation !== router.pathname) {
      setLastLocation(router.pathname);
      if (
        burgerMenuOpen &&
        !router.pathname.includes(
          pathnamesByLanguage.productCategory.languages[intl.locale]
        )
      ) {
        toggleBurgerMenu();
      }
      window.scrollTo({ left: 0, top: 0 });
    }
  }, [router.pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
