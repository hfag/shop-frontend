import { useContext, useMemo } from "react";
import { AppContext } from "../pages/_app";
import { Permission } from "../schema";
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

export const useAuthenticate = (
  permission = Permission.SuperAdmin,
  channelId = "1"
) => {
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

  return isAllowed;
};
