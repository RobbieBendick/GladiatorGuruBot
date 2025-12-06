import express, { Request, Response } from 'express';
import { initializeBot, sendDM } from './bot';
import { formatJobAssignmentMessage, formatJobCreatedMessage } from './messageFormatters';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY; // Secret key to authenticate requests

app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  const { isBotReady } = require('./bot');
  res.json({ status: 'ok', botReady: isBotReady() });
});

// Send DM endpoint
app.post('/send-dm', async (req: Request, res: Response) => {
  // Authenticate request
  const authHeader = req.headers.authorization;
  if (!API_KEY || authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { discordUserId, message } = req.body;

  if (!discordUserId || !message) {
    return res.status(400).json({ error: 'Missing discordUserId or message' });
  }

  const success = await sendDM(discordUserId, message);
  
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to send DM' });
  }
});

// Send job assignment DM endpoint
app.post('/send-job-assignment', async (req: Request, res: Response) => {
  // Authenticate request
  const authHeader = req.headers.authorization;
  if (!API_KEY || authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { coachDiscordId, coachName, jobDetails } = req.body;

  if (!coachDiscordId || !coachName || !jobDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const message = formatJobAssignmentMessage(coachName, jobDetails);
  const success = await sendDM(coachDiscordId, message);
  
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to send DM' });
  }
});

// Send job created DM endpoint
app.post('/send-job-created', async (req: Request, res: Response) => {
  // Authenticate request
  const authHeader = req.headers.authorization;
  if (!API_KEY || authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { customerDiscordId, customerName, jobDetails, frontendUrl } = req.body;

  if (!customerDiscordId || !customerName || !jobDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const message = formatJobCreatedMessage(customerName, jobDetails, frontendUrl);
  const success = await sendDM(customerDiscordId, message);
  
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to send DM' });
  }
});

// Initialize bot and start server
initializeBot()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Discord bot service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start bot service:', error);
    process.exit(1);
  });

