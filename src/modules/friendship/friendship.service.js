import Friendship from "./friendship.model.js";
import User from "../user/user.model.js";
import notificationService from "../notifications/notification.service.js";

const sendRequest = async (fromUserId, toUserId) => {
  if (!toUserId) {
    throw new Error("UserId is required");
  }

  if (fromUserId === toUserId) {
    throw new Error("You cannot send a request to yourself");
  }

  // 🔍 Kullanıcı var mı?
  const user = await User.findById(toUserId);
  if (!user) {
    throw new Error("User not found");
  }

  // 🔁 Zaten ilişki var mı?
  const [rows] = await Friendship.findBetweenUsers(
      fromUserId,
      toUserId
  );

  if (rows.length > 0) {
    const status = rows[0].status;
    if (status === "pending") {
      throw new Error("Friend request already sent");
    }
    if (status === "accepted") {
      throw new Error("You are already friends");
    }
  }

  const [result] = await Friendship.create(fromUserId, toUserId);

  await notificationService.createNotification({
    userId: toUserId,          // bildirimi alan
    type: "friend_request",    // enum’a ekleyeceğiz
    referenceId: result.insertId, // friendship id
  });

  return { message: "Friend request sent" };
};

const cancelRequest = async (fromUserId, toUserId) => {
  const [rows] = await Friendship.findBetweenUsers(
      fromUserId,
      toUserId
  );

  if (!rows.length) {
    throw new Error("Friend request not found");
  }

  const friendship = rows[0];

  if (friendship.status !== "pending") {
    throw new Error("Cannot cancel accepted friendship");
  }

  if (friendship.requester_id !== fromUserId) {
    throw new Error("Not allowed to cancel this request");
  }

  await Friendship.cancel(fromUserId, toUserId);

  return { message: "Friend request cancelled" };
};

const acceptRequest = async (currentUserId, requesterId) => {
  const [rows] = await Friendship.findBetweenUsers(currentUserId, requesterId);

  if (rows.length === 0) {
    throw new Error("Friend request not found");
  }

  const request = rows[0];

  if (request.addressee_id !== currentUserId || request.status !== "pending") {
    throw new Error("Invalid friend request");
  }

  const [result] =  await Friendship.accept(requesterId, currentUserId);

  await notificationService.createNotification({
    userId: requesterId,
    type: "friend_accept",
    referenceId: result.insertId,
  });

  return { message: "Friend request accepted" };
};

const rejectRequest = async (currentUserId, requesterId) => {
  const [rows] = await Friendship.findBetweenUsers(currentUserId, requesterId);

  if (rows.length === 0) {
    throw new Error("Friend request not found");
  }

  const request = rows[0];

  if (request.addressee_id !== currentUserId || request.status !== "pending") {
    throw new Error("Invalid friend request");
  }

  await Friendship.reject(requesterId, currentUserId);

  return { message: "Friend request rejected" };
};

const getFriends = async (userId) => {
  const [rows] = await Friendship.getFriendsOfUser(userId);
  return rows.map((r) => r.friend_id);
};

const getPendingRequests = async (userId) => {
  const [rows] = await Friendship.getPendingRequestsForUser(userId);
  return rows;
};

export default {
  sendRequest,
  acceptRequest,
  getFriends,
  getPendingRequests,
  rejectRequest,
  cancelRequest,
};
