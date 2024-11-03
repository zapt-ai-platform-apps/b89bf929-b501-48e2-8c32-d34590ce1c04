import { authenticateUser } from "../_apiUtils.js";
import * as Sentry from "@sentry/node";
import Pusher from "pusher";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);

    const socketId = req.body.socket_id;
    const channelName = req.body.channel_name;

    const authResponse = pusher.authenticate(socketId, channelName, {
      user_id: user.id,
      user_info: {
        name: user.email
      }
    });

    res.send(authResponse);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error authenticating Pusher:', error);
    res.status(403).send({ error: 'Unauthorized' });
  }
}