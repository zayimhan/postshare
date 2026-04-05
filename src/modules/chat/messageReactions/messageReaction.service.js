import MessageReaction from "./messageReaction.model.js";
import Message from "../message/message.model.js";
import Conversation from "../conversation/conversation.model.js";

const VALID_REACTIONS = ["like", "laugh", "eyes", "think", "fire"];

const toggleReaction = async ({ messageId, userId, reaction }) => {
    if (!VALID_REACTIONS.includes(reaction)) {
        throw new Error("Invalid reaction type");
    }

    const message = await Message.getById(messageId);

    if (!message) {
        const err = new Error("Message not found");
        err.statusCode = 404;
        throw err;
    }

    const conversation = await Conversation.findById(
        message.conversation_id
    );

    const isParticipant =
        conversation.user1_id === userId ||
        conversation.user2_id === userId;

    if (!isParticipant) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }

    const existing = await MessageReaction.find({
        messageId,
        userId,
        reaction,
    });

    if (existing) {
        await MessageReaction.delete({
            messageId,
            userId,
            reaction,
        });
        return { toggled: "removed" };
    }

    await MessageReaction.create({
        messageId,
        userId,
        reaction,
    });

    return { toggled: "added" };
};

export default {
    toggleReaction,
};
