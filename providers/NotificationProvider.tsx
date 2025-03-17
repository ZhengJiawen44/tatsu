import React, { SetStateAction, useEffect, useState } from "react";
import { useContext, createContext } from "react";
import { useToast } from "@/hooks/use-toast";

type Notificaton = {
  title: undefined | string;
  description: undefined | string;
};
interface NotificationProviderContextProps {
  notification: Notificaton;
  setNotification: React.Dispatch<SetStateAction<Notificaton>>;
}

const NotificationProviderContext = createContext<
  NotificationProviderContextProps | undefined
>(undefined);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [notification, setNotification] = useState<Notificaton>({
    title: undefined,
    description: undefined,
  });

  useEffect(() => {
    if (notification.description || notification.title) {
      console.log(notification);

      toast({
        title: notification.title,
        description: notification.description,
      });
    }
  }, [notification]);

  return (
    <NotificationProviderContext.Provider
      value={{ notification, setNotification }}
    >
      {children}
    </NotificationProviderContext.Provider>
  );
};

export default NotificationProvider;

export const useNotificaton = () => {
  const context = useContext(NotificationProviderContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within notification provider context"
    );
  }

  return context;
};
