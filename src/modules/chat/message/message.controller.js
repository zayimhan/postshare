import messageService from "./message.service.js";

const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const { type, content } = req.body;

        await messageService.sendMessage({
            conversationId,
            userId,
            type,
            content,
        });

        return res.status(201).json({ message: "Message sent" });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message,
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const messages = await messageService.getMessages({
            conversationId,
            userId,
            limit,
            offset,
        });

        return res.json(messages);
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message,
        });
    }
};

export default {
    sendMessage,
    getMessages,
};
