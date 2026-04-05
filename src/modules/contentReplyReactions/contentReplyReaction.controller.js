import service from "./contentReplyReaction.service.js";

const toggleReaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const {replyId} = req.params;
        const {reaction} = req.body;

        const result = await service.toggleReaction({
            replyId,
            userId,
            reaction,
        });

        return res.json({
            message: `Reaction ${result.action}`,
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message,
        });
    }
};

const getReplyReactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const {replyId} = req.params;
        const replyReactions = await service.getReactions({replyId, userId});
        return res.json(replyReactions);
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message,
        });
    }
};


export default {
    toggleReaction,
    getReplyReactions,
};
