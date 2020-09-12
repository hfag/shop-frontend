import React, {
  ReactNode,
  FunctionComponent,
  useContext,
  useMemo,
} from "react";
import { AppContext } from "../../pages/_app";
import { Permission } from "../../schema";

const RestrictedView: FunctionComponent<{
  children?: ReactNode;
  permission?: Permission;
  channelId?: string;
}> = ({ children, permission = Permission.SuperAdmin, channelId = "1" }) => {
  const { user } = useContext(AppContext);

  const isAllowed = useMemo(() => {
    if (!user) {
      return false;
    }

    const channel = user.channels.find((c) => c.id === channelId);
    if (!channel) {
      return false;
    }

    return channel.permissions.includes(permission);
  }, [user]);

  return isAllowed ? <>{children}</> : null;
};

export default RestrictedView;
