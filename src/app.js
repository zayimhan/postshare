import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import { createFriendshipRouter } from "./modules/friendship/friendship.routes.js";
import { createContentsRouter } from "./modules/contents/contents.routes.js";
import { createFeedRouter } from "./modules/feed/feed.routes.js";
import { createContentReplyRouter } from "./modules/contentReply/contentReply.routes.js";
import { requireAuth } from "./modules/auth/auth.middleware.js";
import {createConversationRouter} from "./modules/chat/conversation/conversation.routes.js";
import {createMessageRouter} from "./modules/chat/message/message.routes.js";
import {createMessageReactionRouter} from "./modules/chat/messageReactions/messageReaction.routes.js";
import {createContentReplyReactionRouter} from "./modules/contentReplyReactions/contentReplyReaction.routes.js";
import {createNotificationRouter} from "./modules/notifications/notification.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/friends", createFriendshipRouter({ requireAuth }));
app.use("/api/contents", createContentsRouter({ requireAuth }));
app.use("/api/feed", createFeedRouter({ requireAuth }));
app.use("/api", createContentReplyRouter({ requireAuth }));
app.use("/api", createConversationRouter({requireAuth}));
app.use("/api",createMessageRouter({requireAuth}))
app.use("/api",createMessageReactionRouter({requireAuth}))
app.use("/api",createContentReplyReactionRouter({requireAuth}))
app.use("/api",createNotificationRouter({requireAuth}))


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
