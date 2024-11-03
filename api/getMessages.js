import { messages } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as Sentry from "@sentry/node";

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

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    const { chatUserId } = req.query;

    if (!chatUserId) {
      return res.status(400).json({ error: 'chatUserId is required' });
    }

    const sqlClient = neon(process.env.NEON_DB_URL);
    const db = drizzle(sqlClient);

    const result = await db.query.messages.findMany({
      where: sql`(sender_id = ${user.id} AND recipient_id = ${chatUserId}) OR (sender_id = ${chatUserId} AND recipient_id = ${user.id})`,
      orderBy: { createdAt: 'asc' },
      limit: 100,
    });

    res.status(200).json(result);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching messages:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error fetching messages' });
    }
  }
}