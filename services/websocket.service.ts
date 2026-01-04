// import { io, Socket } from "";
// import Cookies from "js-cookie";
// import { WebSocketMessage, WebSocketEventType } from "@/types/websocket.types";

// // ============================================
// // WEBSOCKET SERVICE
// // ============================================

// class WebSocketService {
//   private socket: Socket | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 1000;
//   private eventHandlers: Map<WebSocketEventType, Set<(data: any) => void>> =
//     new Map();

//   /**
//    * Initialize WebSocket connection
//    */
//   connect(): void {
//     const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";
//     const token = Cookies.get("authToken");

//     if (!token) {
//       console.error("No auth token found. Cannot connect to WebSocket.");
//       return;
//     }

//     this.socket = io(wsUrl, {
//       auth: {
//         token,
//       },
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: this.maxReconnectAttempts,
//       reconnectionDelay: this.reconnectDelay,
//     });

//     this.setupEventListeners();
//   }

//   /**
//    * Setup socket event listeners
//    */
//   private setupEventListeners(): void {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("WebSocket connected");
//       this.reconnectAttempts = 0;
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("WebSocket disconnected:", reason);
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("WebSocket connection error:", error);
//       this.reconnectAttempts++;

//       if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//         console.error("Max reconnection attempts reached");
//         this.socket?.close();
//       }
//     });

//     // Listen for all message types
//     this.socket.on("message", (message: WebSocketMessage) => {
//       this.handleMessage(message);
//     });

//     // Listen for specific events
//     this.socket.on("notification", (notification) => {
//       this.emit("NOTIFICATION", notification);
//     });
//   }

//   /**
//    * Handle incoming WebSocket messages
//    */
//   private handleMessage(message: WebSocketMessage): void {
//     const handlers = this.eventHandlers.get(message.type);
//     if (handlers) {
//       handlers.forEach((handler) => handler(message.payload));
//     }
//   }

//   /**
//    * Emit event to registered handlers
//    */
//   private emit(type: WebSocketEventType, data: any): void {
//     const handlers = this.eventHandlers.get(type);
//     if (handlers) {
//       handlers.forEach((handler) => handler(data));
//     }
//   }

//   /**
//    * Subscribe to a specific event type
//    */
//   on<T = any>(
//     event: WebSocketEventType,
//     handler: (data: T) => void
//   ): () => void {
//     if (!this.eventHandlers.has(event)) {
//       this.eventHandlers.set(event, new Set());
//     }
//     this.eventHandlers.get(event)!.add(handler);

//     // Return unsubscribe function
//     return () => {
//       this.off(event, handler);
//     };
//   }

//   /**
//    * Unsubscribe from a specific event type
//    */
//   off<T = any>(event: WebSocketEventType, handler: (data: T) => void): void {
//     const handlers = this.eventHandlers.get(event);
//     if (handlers) {
//       handlers.delete(handler);
//     }
//   }

//   /**
//    * Subscribe to project updates
//    */
//   subscribeToProject(projectId: string): void {
//     if (!this.socket) {
//       console.error("Socket not connected");
//       return;
//     }

//     this.socket.emit("message", {
//       type: "SUBSCRIBE_TO_PROJECT",
//       payload: { projectId },
//     });
//   }

//   /**
//    * Unsubscribe from project updates
//    */
//   unsubscribeFromProject(projectId: string): void {
//     if (!this.socket) {
//       console.error("Socket not connected");
//       return;
//     }

//     this.socket.emit("message", {
//       type: "UNSUBSCRIBE_FROM_PROJECT",
//       payload: { projectId },
//     });
//   }

//   /**
//    * Check if socket is connected
//    */
//   isConnected(): boolean {
//     return this.socket?.connected || false;
//   }

//   /**
//    * Disconnect from WebSocket
//    */
//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       this.eventHandlers.clear();
//     }
//   }
// }

// // Export singleton instance
// export const websocketService = new WebSocketService();
