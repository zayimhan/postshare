import contentReplyService from "./contentReply.service.js";

/**
 * POST /contents/:contentId/replies
 */
const createReply = async (req, res) => {
    try {
        const userId = req.user.id;
        const { contentId } = req.params;
        const { message } = req.body;

        await contentReplyService.createReply({
            contentId,
            userId,
            message,
        });

        return res.status(201).json({
            message: "Reply added",
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message,
        });
    }
};

/**
 * GET /contents/:contentId/replies
 */
const getReplies = async (req, res) => {
    try {
        const userId = req.user.id;
        const { contentId } = req.params;

        const replies = await contentReplyService.getReplies({
            contentId,
            userId,
        });

        return res.json(replies);
    } catch (error) {
        return res.status(error.statusCode || 403).json({
            message: error.message,
        });
    }
};

export default {
    createReply,
    getReplies,
};
