import service from "./messageReaction.service.js";

const toggleReaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;
        const { reaction } = req.body;

        const result = await service.toggleReaction({
            messageId,
            userId,
            reaction,
        });

        return res.json(result);
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message,
        });
    }
};

export default {
    toggleReaction,
};
