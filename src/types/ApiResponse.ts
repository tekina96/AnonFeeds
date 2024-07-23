import { Message } from "@/model/User";

// standardized API
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}