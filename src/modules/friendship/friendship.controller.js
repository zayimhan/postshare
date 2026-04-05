import friendshipService from "./friendship.service.js";
import Friendship from "./friendship.model.js";

const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { userId } = req.body;

    const result = await friendshipService.sendRequest(fromUserId, userId);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { userId } = req.body;

    const result = await friendshipService.cancelRequest(
        fromUserId,
        userId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const acceptRequest = async (req, res) => {
  try {
    const addresseeId = req.user.id; // BEN
    const { userId: requesterId } = req.body; // İSTEĞİ ATAN

    const [rows] = await Friendship.findBetweenUsers(
        requesterId,
        addresseeId
    );

    if (!rows.length || rows[0].status !== "pending") {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    await Friendship.accept(requesterId, addresseeId);

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const rejectRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requesterId } = req.body;

    const result = await friendshipService.rejectRequest(
      currentUserId,
      requesterId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await friendshipService.getFriends(userId);

    res.json({ friends });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await friendshipService.getPendingRequests(userId);

    res.json({ requests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  sendRequest,
  acceptRequest,
  getFriends,
  getPendingRequests,
  rejectRequest,
  cancelRequest,
};
