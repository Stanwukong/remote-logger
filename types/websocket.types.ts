// WebSocket Event Types

import { LogEntry } from "./analytics";
import { AlertEvent } from "./alert.types";
import { Notification } from "./notification.types";
import { Project } from "./project.types";

export type WebSocketEventType =
  | "INITIAL_DATA"
  | "NEW_LOG"
  | "ALERT_TRIGGERED"
  | "NOTIFICATION"
  | "PROJECT_UPDATED"
  | "SUBSCRIBE_TO_PROJECT"
  | "UNSUBSCRIBE_FROM_PROJECT";

export interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  payload: T;
}

export interface InitialDataPayload {
  projects: Project[];
}

export interface NewLogPayload extends LogEntry {}

export interface AlertTriggeredPayload extends AlertEvent {}

export interface NotificationPayload extends Notification {}

export interface ProjectUpdatedPayload extends Project {}

export interface SubscribeToProjectPayload {
  projectId: string;
}

export interface UnsubscribeFromProjectPayload {
  projectId: string;
}

export interface WebSocketContextType {
  connected: boolean;
  subscribeToProject: (projectId: string) => void;
  unsubscribeFromProject: (projectId: string) => void;
  on: <T = any>(event: WebSocketEventType, handler: (data: T) => void) => void;
  off: <T = any>(event: WebSocketEventType, handler: (data: T) => void) => void;
}
