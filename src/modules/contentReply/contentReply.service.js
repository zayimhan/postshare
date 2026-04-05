import ContentReply from "./contentReply.model.js";
import Content from "../contents/contents.model.js";
import Friendship from "../friendship/friendship.model.js";
import notificationService from "../notifications/notification.service.js";

/**
 * helper – içerik sahibine veya friend’e erişim var mı
 */
const checkContentAccess = async ({ contentId, userId }) => {
  const content = await Content.findById(contentId);

  if (!content) {
    const err = new Error("Content not found");
    err.statusCode = 404;
    throw err;
  }

  // content sahibi her zaman erişebilir
  if (content.user_id === userId) {
    return content;
  }

  const [rows] = await Friendship.findBetweenUsers(
      content.user_id,
      userId
  );

  const friendship = rows[0];

  if (!friendship || friendship.status !== "accepted") {
    const err = new Error("Not allowed");
    err.statusCode = 403;
    throw err;
  }

  return content;
};

/**
 * reply oluştur
 */
const createReply = async ({ contentId, userId, message }) => {
  if (!message) {
    const err = new Error("Message is required");
    err.statusCode = 400;
    throw err;
  }

  await checkContentAccess({ contentId, userId });

  // ✅ Reply oluştur
  const [result] = await ContentReply.create({
    contentId,
    userId,
    message,
  });

  // 🔍 Content sahibini bul
  const contentOwner = await Content.findById(contentId);
  const contentOwnerId = contentOwner.user_id;

  // ❗ Kendi postuna reply attıysa notification YOK
  if (contentOwnerId !== userId) {
    await notificationService.createNotification({
      userId: contentOwnerId,     // bildirimi alan
      type: "reply",
      referenceId: result.insertId, // reply id
    });
  }
};


/**
 * reply'leri getir
 */
const getReplies = async ({ contentId, userId }) => {
  await checkContentAccess({ contentId, userId });

  const [rows] = await ContentReply.getByContentId(contentId);
  return rows;
};

export default {
  createReply,
  getReplies,
};
