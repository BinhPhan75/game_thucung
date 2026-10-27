import { handleTts } from '../server/tts';

// Vercel Node.js function; local dev and standalone Node use the same handler.
export function GET(request: Request) { return handleTts(request); }
