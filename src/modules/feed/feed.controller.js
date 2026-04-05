import feedService from "./feed.service.js";

/**
 * GET /api/feed
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const feed = await feedService.getFeed({
      userId,
      limit,
      offset,
    });

    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/feed/filtered
 */
const getFilteredFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      platforms = {},
      friends = {},
      limit = 20,
      offset = 0,
    } = req.body;

    const feed = await feedService.getFeed({
      userId,
      includePlatforms: platforms.include || [],
      excludePlatforms: platforms.exclude || [],
      includeFriends: friends.include || [],
      excludeFriends: friends.exclude || [],
      limit,
      offset,
    });

    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await feedService.getFeedById(id);
    res.json(feed);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const sendToFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;
    const { targetUserId } = req.body;

    await feedService.sendToFriend({
      contentId,
      userId,
      targetUserId,
    });

    return res.status(200).json({ message: "Sent to friend" });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};


export default {
  getFeed,
  getFilteredFeed,
  sendToFriend,
  getFeedById,
};
