import { WebSocketCode } from "../enums/webSocketCode";

export interface WebSocketMessage {
    webSocketCode: WebSocketCode,
    message: string,
}
  