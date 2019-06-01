import PushNotification from "react-native-push-notification";
import Deferred from "es6-deferred";
const notifications = [];
let deviceToken = null;
let tokens = [];
const useRequestNotifications = (
  application_id,
  { alert = true, badge = true, sound = true }
) => {
  return useEffect(async () => {
    const deferred = new Deferred();
    await PushNotification.requestPermissions();
    PushNotification.configure({
      onRegister: ({ token }) => {
        deviceToken = token;
        tokens.map(f => f(token));
        deferred.resolve();
      },
      onError: error => deferred.reject(error),
      onNotification: notification => notifications.map(f => f(notification)),
      permissions: { alert, badge, sound },
      senderId: application_id
    });
    return await deferred;
  }, []);
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
      if (i > -1) tokens.splice(i, 1);
    };
  }, []);
  return { notification, token };
};
export { usePushNotification, useRequestNotifications };
