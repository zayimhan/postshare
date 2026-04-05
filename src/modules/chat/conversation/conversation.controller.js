import conversationService from "./conversation.service.js";

const createConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.body;

        const conversation =
            await conversationService.getOrCreateConversation({
                userId,
                targetUserId,
            });

        return res.status(200).json(conversation);
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }
};

export default {
    createConversation,
};
