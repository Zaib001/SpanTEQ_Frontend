import apiClient from '../config/api.config';

export interface ChatMessage {
    _id: string;
    senderId: {
        _id: string;
        name: string;
        email: string;
    };
    receiverId: {
        _id: string;
        name: string;
        email: string;
    };
    message: string;
    createdAt: string;
    readAt: string | null;
}

export interface Conversation {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    lastMessage: {
        _id: string;
        message: string;
        createdAt: string;
        readAt: string | null;
    };
    unreadCount: number;
}

class ChatService {
    /**
     * Get all conversations (Inbox)
     * Maps to GET /api/chat/inbox
     */
    async getConversations(): Promise<Conversation[]> {
        const response = await apiClient.get('/api/chat/inbox');
        return response.data.data.conversations;
    }

    /**
     * Get message thread with a specific user
     * Maps to GET /api/chat/conversations/:userId
     */
    async getMessages(userId: string): Promise<{ otherUser: any; messages: ChatMessage[] }> {
        const response = await apiClient.get(`/api/chat/conversations/${userId}`);
        return response.data.data;
    }

    /**
     * Send a message to a user
     * Maps to POST /api/chat/send
     */
    async sendMessage(receiverId: string, message: string): Promise<ChatMessage> {
        const response = await apiClient.post('/api/chat/send', {
            receiverId,
            message
        });
        return response.data.data;
    }

    /**
     * Search users to start a new chat
     * Maps to GET /api/admin/users
     */
    async searchUsers(query: string): Promise<any[]> {
        const response = await apiClient.get(`/api/admin/users?search=${query}&limit=10`);
        return response.data.users || [];
    }
}

export default new ChatService();
