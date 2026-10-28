// Node ESM needs the emitted .js extension in the deployed function.
import { handleTts } from '../server/tts.js';

// Vercel Node.js function; local dev and standalone Node use the same handler.
export function GET(request: Request) { return handleTts(request); }
