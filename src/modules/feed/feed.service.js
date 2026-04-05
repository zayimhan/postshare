import Feed from "./feed.model.js";
import Friendship from "../friendship/friendship.model.js";
import MessageService from "../chat/message/message.service.js";
import ConversationService from "../chat/conversation/conversation.service.js";



const getFeed = async (filters) => {
    const { userId } = filters;

    const [rows] = await Friendship.getFriendsOfUser(userId);
    const friendIds = rows.map((f) => f.friend_id);

    return Feed.getFeed({
        ...filters,
        friendIds, // 🔥 TEK VE NET İSİM
    });
};

const getFeedById = async (feedId) => {
    const feed = await Feed.findById(feedId);
    if (!feed) {
        throw new Error("Feed not found");
    }
    return feed;
};

const sendToFriend = async ({
                                contentId,
                                userId,
                                targetUserId,
                            }) => {
    // 1️⃣ Feed item var mı?
    const content = await Feed.findById(contentId);
    if (!content) {
        throw new Error("Content not found");
    }

    // 2️⃣ Conversation al / oluştur
    const conversation =
        await ConversationService.getOrCreateConversation({
            userId,
            targetUserId,
        });

    // 3️⃣ Link message gönder
    await MessageService.sendMessage({
        conversationId: conversation.id,
        userId,
        type: "link",
        content: content.url, // feed’de link alanın neyse
    });
};

export default {
    getFeed,
    sendToFriend,
    getFeedById,
};
