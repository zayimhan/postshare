import ContentReply from "../contentReply/contentReply.model.js";
import Content from "../contents/contents.model.js";
import Friendship from "../friendship/friendship.model.js";
import ContentReplyReaction from "./contentReplyReaction.model.js";

const VALID_REACTIONS = ["like", "laugh", "eyes", "think", "fire"];

const checkReplyAccess = async ({replyId, userId}) => {
    const reply = await ContentReply.getById(replyId);

    if (!reply) {
        const err = new Error("Reply not found");
        err.statusCode = 404;
        throw err;
    }

    const content = await Content.findById(reply.content_id);
    if (!content) {
        const err = new Error("content not found");
        err.statusCode = 404;
        throw err;
    }

    if (content.user_id !== userId) {

        const [rows] = await Friendship.findBetweenUsers(userId, content.user_id)
        const friendship = rows[0];
        if (!friendship || friendship.status !== "accepted") {
            const err = new Error("Access denied");
            err.statusCode = 403;
            throw err;
        }
    }

    return reply;
}

const toggleReaction = async ({replyId, userId, reaction}) => {
    if (!VALID_REACTIONS.includes(reaction)) {
        const err = new Error("Invalid reaction");
        err.statusCode = 400;
        throw err;
    }

    await checkReplyAccess({replyId,userId});

    // toggle
    const existing = await ContentReplyReaction.findOne({
        replyId,
        userId,
        reaction,
    });

    if (existing) {
        await ContentReplyReaction.remove({replyId, userId, reaction});
        return {action: "removed"};
    }

    await ContentReplyReaction.create({replyId, userId, reaction});
    return {action: "added"};
};


const getReactions = async ({replyId, userId}) => {
    await checkReplyAccess({replyId, userId});
    const [rows] = await ContentReplyReaction.getByReplyId(replyId);
    return rows;
}


export default {
    toggleReaction,
    getReactions,
};
