import Conversation from "./conversation.model.js";
import Friendship from "../../friendship/friendship.model.js";

const getOrCreateConversation = async ({ userId, targetUserId }) => {
    if (!targetUserId) {
        throw new Error("Target user is required");
    }

    if (userId === targetUserId) {
        throw new Error("Cannot start conversation with yourself");
    }

    const [rows] = await Friendship.findBetweenUsers(
        userId,
        targetUserId
    );

    const friendship = rows[0];

    if (!friendship || friendship.status !== "accepted") {
        throw new Error("Not allowed to start conversation");
    }

    let conversation = await Conversation.findBetweenUsers(
        userId,
        targetUserId
    );

    if (!conversation) {
        conversation = await Conversation.create(
            userId,
            targetUserId
        );
    }

    return conversation;
};

export default {
    getOrCreateConversation,
};
