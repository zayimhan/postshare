import Content from "./contents.model.js";

const ALLOWED_PLATFORMS = [
  "twitter",
  "tiktok",
  "instagram",
  "youtube",
  "other",
  "Web",
];

const createContent = async ({ userId, url, platform, title, visibility }) => {
  if (!url) throw new Error("URL is required");

  if (!ALLOWED_PLATFORMS.includes(platform)) {
    throw new Error("Invalid platform");
  }

  return Content.create({
    userId,
    url,
    platform,
    title,
    visibility: visibility || "friends",
  });
};

export default {
  createContent,
};
