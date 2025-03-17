import { useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuthToken } from ".";
import { toast } from "./use-toast";
// import { ConversationContext } from "./context/conversation";

function useSocket() {
  const { token, userData } = useAuthToken();
  const businessId = userData?.businessId;

  const socket = useMemo(() => {
    return io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
      autoConnect: false, // Disable automatic connection on initialization
    });
  }, [token]);

  useEffect(() => {
    socket.connect();

    // Event listeners
    socket.on("connect", () => {
      console.log("connected to ws");
      // Join the staff room
      if (userData?.businessId) {
        socket.emit("joinStaffRoom", { businessId });
      }
    });

    socket.on("connect_error", (err: any) => {
      console.error("Connection error", err);
    });

    // Listen for nudge notifications
    socket.on("waiterNudged", (data) => {
      toast({
        className: "text-base font-semibold border-2 border-primary-orange bg-background text-primary",
        title: "Nudge Alert",
        description: data,
        duration: 120000, // Toast stays for two minutes
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("waiterNudged");
      socket.disconnect();
    };
  }, [socket, businessId]);

  const nudgeWaiter = (businessId: string, tableNumber: number) => {
    if (businessId) {
      socket.emit("nudgeWaiter", { businessId, tableNumber });
    }
  };
  return { socket, nudgeWaiter };
}

export default useSocket;
