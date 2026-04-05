import Conversation from "../conversation/conversation.model.js";
import Message from "./message.model.js";
import notificationService from "../../notifications/notification.service.js";

const sendMessage = async ({conversationId, userId, type, content}) => {
    if (!type || !content) {
        throw new Error("Type and content are required");
    }

    if (!["text", "link"].includes(type)) {
        throw new Error("Invalid message type");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        const err = new Error("Conversation not found");
        err.statusCode = 404;
        throw err;
    }

    const isParticipant =
        conversation.user1_id === userId ||
        conversation.user2_id === userId;

    if (!isParticipant) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }

    const [result] = await Message.create({
        conversationId,
        userId,
        type,
        content,
    });

    // 🔍 Karşı tarafı bul
    const receiverId =
        conversation.user1_id === userId
            ? conversation.user2_id
            : conversation.user1_id;

    // 🔔 NOTIFICATION
    await notificationService.createNotification({
        userId: receiverId,
        type: "message",
        referenceId: result.insertId, // message id
    });


};

const getMessages = async ({conversationId, userId, limit, offset}) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        const err = new Error("Conversation not found");
        err.statusCode = 404;
        throw err;
    }

    const isParticipant =
        conversation.user1_id === userId ||
        conversation.user2_id === userId;

    if (!isParticipant) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }

    const [rows] = await Message.getByConversationIdWithReactions({
        conversationId,
        userId,
        limit,
        offset,
    });

    return rows.map(row => ({
        id: row.id,
        type: row.type,
        content: row.content,
        created_at: row.created_at,
        sender_id: row.sender_id,
        sender: row.sender,
        reactions: row.reactions || {},
        my_reactions: row.my_reactions
            ? row.my_reactions.split(",")
            : [],
    }));
};

export default {
    sendMessage,
    getMessages,
};
