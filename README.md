# GladiatorGuru Discord Bot Service

Separate Discord bot service for sending DMs. Runs on Railway/Render to maintain persistent WebSocket connection.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add environment variables:
- `DISCORD_BOT_TOKEN` - Your Discord bot token
- `API_KEY` - Secret key for API authentication (same as `DISCORD_BOT_API_KEY` in main API)
- `PORT` - Port to run on (usually auto-set by hosting service)
- `FRONTEND_URL` - Frontend URL for job links (optional)

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

All endpoints require `Authorization: Bearer <API_KEY>` header.

### POST /health
Health check endpoint.

### POST /send-dm
Send a direct message to a Discord user.

Body:
```json
{
  "discordUserId": "123456789",
  "message": "Your message here"
}
```

### POST /send-job-assignment
Send job assignment notification to a coach.

Body:
```json
{
  "coachDiscordId": "123456789",
  "coachName": "Coach Name",
  "jobDetails": {
    "characterName": "Character",
    "characterRealm": "Realm",
    "version": "MOP",
    "bracket": "3v3",
    "hours": "2",
    "availabilityStartDateTime": "2024-01-01T10:00:00Z",
    "availabilityEndDateTime": "2024-01-01T12:00:00Z",
    "jobId": "job123",
    "timezone": "PST"
  }
}
```

### POST /send-job-created
Send job creation notification to a customer.

Body:
```json
{
  "customerDiscordId": "123456789",
  "customerName": "Customer Name",
  "jobDetails": {
    "characterName": "Character",
    "characterRealm": "Realm",
    "version": "MOP",
    "bracket": "3v3",
    "hours": "2",
    "availabilityStartDateTime": "2024-01-01T10:00:00Z",
    "availabilityEndDateTime": "2024-01-01T12:00:00Z",
    "jobId": "job123",
    "timezone": "PST"
  },
  "frontendUrl": "https://gladiatorguru.com"
}
```

