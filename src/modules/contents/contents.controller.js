import contentService from "./contents.service.js";

const createContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { url, platform, title, visibility } = req.body;

    const content = await contentService.createContent({
      userId,
      url,
      platform,
      title,
      visibility,
    });

    return res.status(201).json(content);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default {
  createContent,
};
