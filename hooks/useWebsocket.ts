"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  websocketService,
  ConnectionStatus,
  MessageHandler,
} from "@/services/websocket.service";
import { WebSocketMessage } from "@/types/websocket.types";

// ============================================
// Cookie helper (mirrors services/config.ts)
// ============================================

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return "";
}

// ============================================
// useWebsocket — Primary hook
// ============================================

/**
 * Core WebSocket hook that connects to the Socket.io backend.
 *
 * Returns both the new Socket.io API and a backward-compatible `lastMessage`
 * for consumers that haven't migrated yet.
 */
export const useWebsocket = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const connectedRef = useRef(false);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    const token = getCookie("authToken");
    if (!token) {
      setConnectionStatus("disconnected");
      return;
    }

    // Connect (idempotent if already connected)
    websocketService.connect(token);

    // Listen for connection status changes
    const unsubConnection = websocketService.onConnectionChange((status) => {
      setConnectionStatus(status);
      connectedRef.current = status === "connected";
    });

    // Listen for "message" events from the server and update lastMessage
    const handleMessage = (msg: WebSocketMessage) => {
      setLastMessage({ ...msg, timestamp: Date.now() } as any);
    };
    const unsubMessage = websocketService.subscribe("message", handleMessage);

    // Also listen for "notification" events
    const handleNotification = (data: any) => {
      setLastMessage({
        type: "NOTIFICATION",
        payload: data,
        timestamp: Date.now(),
      } as any);
    };
    const unsubNotification = websocketService.subscribe(
      "notification",
      handleNotification
    );

    return () => {
      unsubConnection();
      unsubMessage();
      unsubNotification();
      // Don't disconnect here — other components may still be using the service.
      // The service is a singleton; it stays alive for the SPA session.
    };
  }, []);

  const subscribe = useCallback(
    (event: string, callback: MessageHandler) => {
      return websocketService.subscribe(event, callback);
    },
    []
  );

  const unsubscribe = useCallback(
    (event: string, callback: MessageHandler) => {
      websocketService.unsubscribe(event, callback);
    },
    []
  );

  const joinProject = useCallback((projectId: string) => {
    websocketService.joinProject(projectId);
  }, []);

  const leaveProject = useCallback((projectId: string) => {
    websocketService.leaveProject(projectId);
  }, []);

  const isConnected = connectionStatus === "connected";

  return {
    connectionStatus,
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    joinProject,
    leaveProject,
  };
};

// ============================================
// useProjectWebSocket — Auto-join/leave a project room
// ============================================

/**
 * Automatically joins a project room when mounted and leaves on unmount.
 * Also connects if not already connected.
 */
export function useProjectWebSocket(projectId: string) {
  const ws = useWebsocket();

  useEffect(() => {
    if (!projectId) return;

    ws.joinProject(projectId);

    return () => {
      ws.leaveProject(projectId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return ws;
}

// ============================================
// useRealtimeLogs — Subscribe to new log events for a project
// ============================================

/**
 * Subscribes to `log:new` / `NEW_LOG` events for a given project.
 * Calls `onLog` whenever a new log arrives for the specified project.
 */
export function useRealtimeLogs(
  projectId: string,
  onLog: (log: any) => void
) {
  const onLogRef = useRef(onLog);
  onLogRef.current = onLog;

  // Join the project room
  useEffect(() => {
    if (!projectId) return;

    const token = getCookie("authToken");
    if (token) {
      websocketService.connect(token);
    }

    websocketService.joinProject(projectId);

    return () => {
      websocketService.leaveProject(projectId);
    };
  }, [projectId]);

  // Listen for NEW_LOG messages
  useEffect(() => {
    if (!projectId) return;

    const handleMessage = (msg: WebSocketMessage) => {
      if (msg.type === "NEW_LOG" && msg.payload?.log) {
        const log = msg.payload.log;
        // Only handle logs for this project
        if (log.projectId === projectId || !log.projectId) {
          onLogRef.current(log);
        }
      }
    };

    const unsub = websocketService.subscribe("message", handleMessage);
    return unsub;
  }, [projectId]);
}
