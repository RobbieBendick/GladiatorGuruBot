import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

let discordClient: Client | null = null;
let isReady = false;

export const initializeBot = async (): Promise<boolean> => {
  try {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    
    if (!DISCORD_BOT_TOKEN) {
      console.error('DISCORD_BOT_TOKEN not found in environment variables');
      return false;
    }

    discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
      ],
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Bot ready timeout'));
      }, 30000);

      discordClient!.once('ready', () => {
        clearTimeout(timeout);
        console.log(`Bot ready! Logged in as ${discordClient?.user?.tag}`);
        isReady = true;
        resolve();
      });

      discordClient!.on('error', (error) => {
        clearTimeout(timeout);
        console.error('Discord bot error:', error);
        reject(error);
      });
    });

    await discordClient.login(DISCORD_BOT_TOKEN);
    return true;
  } catch (error: any) {
    console.error(`Failed to initialize bot: ${error.message}`);
    return false;
  }
};

export const sendDM = async (discordUserId: string, message: string): Promise<boolean> => {
  if (!isReady || !discordClient) {
    console.error('Bot is not ready');
    return false;
  }

  try {
    const user = await discordClient.users.fetch(discordUserId);
    const dmChannel = await user.createDM();
    await dmChannel.send(message);
    console.log(`DM sent to ${user.username} (${discordUserId})`);
    return true;
  } catch (error: any) {
    console.error(`Error sending DM: ${error.message}`);
    
    // Handle specific Discord API errors
    if (error.code === 50007) {
      console.warn(
        'Cannot send DM to user - Discord restrictions prevent DM. User must either: 1) Share a server with the bot and enable "Allow DMs from server members", or 2) Have interacted with the bot first'
      );
    } else if (error.message?.includes('Cannot send messages to this user')) {
      console.warn(
        'Cannot send DM to user - Discord restrictions. Solutions: 1) Add bot to a server with the user, 2) User must interact with bot first, 3) User must enable "Allow DMs from server members" in Discord settings'
      );
    }
    
    return false;
  }
};

export const isBotReady = (): boolean => isReady;

