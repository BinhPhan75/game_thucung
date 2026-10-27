import express from 'express';
import { resolve } from 'node:path';
import { ttsMiddleware } from './ttsMiddleware';

const app = express();
app.use(ttsMiddleware);
app.use(express.static(resolve('dist')));
app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
