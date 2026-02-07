# Arttoo

A simple one-page **AI tattoo designer**: generate customized tattoo ideas based on your personality and lifestyle. No auth, no database — just you and the AI.

## What you get

- **One page**: Pick personality traits, lifestyle, style, placement, and colors.
- **One click**: "Generate my tattoo" calls the AI and shows a design.
- **Optional**: Add extra notes (e.g. "small", "no text", "floral").

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your OpenAI API key**  
   Copy `.env.example` to `.env` and set your key (get one at [platform.openai.com](https://platform.openai.com/api-keys)):
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Run the app**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Frontend**: Single HTML page + CSS + vanilla JS (no framework).
- **Backend**: Express server with one route `POST /api/generate` that uses OpenAI DALL·E 3 to create the image.

For inspiration only — always consult a professional artist for real ink.
