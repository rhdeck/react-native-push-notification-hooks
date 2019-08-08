import PushNotification from "react-native-push-notification";
import { useState, useEffect } from "react";
import useAsyncEffect from "@raydeck/useasynceffect";
const notifications = [];
let deviceToken = null;
let tokens = [];
const useRequestNotifications = (
  application_id,
  { alert = true, badge = true, sound = true } = {}
) => {
  [token, setToken] = useState();
  [error, setError] = useState();
  useAsyncEffect(async () => {
    tokens.push(setToken);
    if (deviceToken) setToken(deviceToken);
    await PushNotification.requestPermissions();
    PushNotification.configure({
      onRegister: ({ token }) => {
        deviceToken = token;
        tokens.map(f => f(token));
      },
      onError: error => setError(error),
      onNotification: notification => notifications.map(f => f(notification)),
      permissions: { alert, badge, sound },
      senderID: application_id
    });
    tokens.push(setToken);
    if (deviceToken) setToken(deviceToken);
    return () => {
      const j = tokens.indexOf(setToken);
      if (j > -1) tokens.splice(j, 1);
    };
  }, []);
  return { token, error };
};
const usePushNotification = () => {
  [notification, setNotification] = useState();
  [token, setToken] = useState();
  useEffect(() => {
    tokens.push(setToken);
    if (deviceToken) setToken(deviceToken);
    notifications.push(setNotification);
    return () => {
      const i = notifications.indexOf(setNotification);
      if (i > -1) notifications.splice(i, 1);
      const j = tokens.indexOf(setToken);
      if (j > -1) tokens.splice(j, 1);
    };
  }, []);
  return { notification, token };
};
export { usePushNotification, useRequestNotifications };
