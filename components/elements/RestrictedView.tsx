import React, { ReactNode, FunctionComponent } from "react";

const RestrictedView: FunctionComponent<{
  userRole?: string;
  children?: ReactNode;
}> = ({ children, userRole = "administrator" }) => {
  const account = false;

  return account ? (
    <>{children}</>
  ) : null; /*&& userRole === account.role ? children : null*/
};

export default RestrictedView;
