import { io, Socket } from "socket.io-client";
import { WebSocketMessage, WebSocketEventType } from "@/types/websocket.types";

// ============================================
// TYPES
// ============================================

type ConnectionStatus = "connecting" | "connected" | "disconnected";
type ConnectionChangeCallback = (status: ConnectionStatus) => void;
type MessageHandler = (data: any) => void;

// ============================================
// WEBSOCKET SERVICE (Socket.io Client)
// ============================================

class WebSocketService {
  private socket: Socket | null = null;
  private connectionChangeListeners: Set<ConnectionChangeCallback> = new Set();
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private _status: ConnectionStatus = "disconnected";
  private joinedProjects: Set<string> = new Set();

  /**
   * Current connection status
   */
  get status(): ConnectionStatus {
    return this._status;
  }

  /**
   * Connect to the Socket.io server.
   * @param token JWT auth token
   */
  connect(token: string): void {
    // Already connected or connecting with the same socket
    if (this.socket?.connected) {
      return;
    }

    // Clean up any stale socket before creating a new one
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    // Derive WebSocket URL: prefer NEXT_PUBLIC_WS_URL, fallback to API base URL
    // stripped of /api/v1 suffix (Socket.io connects to the server root)
    const wsUrl = this.getServerUrl();

    if (!wsUrl) {
      console.warn(
        "[WebSocketService] No WebSocket URL configured. Set NEXT_PUBLIC_WS_URL or NEXT_PUBLIC_API_BASE_URL."
      );
      return;
    }

    this.setStatus("connecting");

    this.socket = io(wsUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    this.setupListeners();
  }

  /**
   * Disconnect from the Socket.io server.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.joinedProjects.clear();
    this.setStatus("disconnected");
  }

  /**
   * Subscribe to a Socket.io event (e.g. "message", "notification").
   * Returns an unsubscribe function.
   */
  subscribe(event: string, callback: MessageHandler): () => void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)!.add(callback);

    // Also attach to the live socket if connected
    if (this.socket) {
      this.socket.on(event, callback);
    }

    return () => this.unsubscribe(event, callback);
  }

  /**
   * Unsubscribe from a Socket.io event.
   */
  unsubscribe(event: string, callback: MessageHandler): void {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.messageHandlers.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Join a project room to receive project-scoped events.
   */
  joinProject(projectId: string): void {
    this.joinedProjects.add(projectId);
    if (this.socket?.connected) {
      this.socket.emit("message", {
        type: "SUBSCRIBE_TO_PROJECT",
        payload: { projectId },
      });
    }
  }

  /**
   * Leave a project room.
   */
  leaveProject(projectId: string): void {
    this.joinedProjects.delete(projectId);
    if (this.socket?.connected) {
      this.socket.emit("message", {
        type: "UNSUBSCRIBE_FROM_PROJECT",
        payload: { projectId },
      });
    }
  }

  /**
   * Check if the socket is currently connected.
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Register a listener for connection status changes.
   * Returns an unsubscribe function.
   */
  onConnectionChange(callback: ConnectionChangeCallback): () => void {
    this.connectionChangeListeners.add(callback);
    // Immediately notify with current status
    callback(this._status);
    return () => {
      this.connectionChangeListeners.delete(callback);
    };
  }

  // ----------------------------------------
  // Private helpers
  // ----------------------------------------

  private getServerUrl(): string | null {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (wsUrl) return wsUrl;

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (apiUrl) {
      // Strip trailing /api/v1 or /api/v1/ to get the server root
      return apiUrl.replace(/\/api\/v1\/?$/, "");
    }

    // Local development fallback
    return "http://localhost:5000";
  }

  private setStatus(status: ConnectionStatus): void {
    if (this._status === status) return;
    this._status = status;
    this.connectionChangeListeners.forEach((cb) => {
      try {
        cb(status);
      } catch (e) {
        console.error("[WebSocketService] Connection change listener error:", e);
      }
    });
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("[WebSocketService] Connected");
      this.setStatus("connected");

      // Re-join any project rooms that were active before reconnect
      this.joinedProjects.forEach((projectId) => {
        this.socket?.emit("message", {
          type: "SUBSCRIBE_TO_PROJECT",
          payload: { projectId },
        });
      });

      // Re-attach all registered message handlers to the new socket
      this.messageHandlers.forEach((handlers, event) => {
        handlers.forEach((handler) => {
          this.socket?.on(event, handler);
        });
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[WebSocketService] Disconnected:", reason);
      this.setStatus("disconnected");
    });

    this.socket.on("reconnect_attempt", () => {
      this.setStatus("connecting");
    });

    this.socket.on("connect_error", (error) => {
      console.error("[WebSocketService] Connection error:", error.message);
      this.setStatus("disconnected");
    });
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const websocketService = new WebSocketService();
export type { ConnectionStatus, MessageHandler };
