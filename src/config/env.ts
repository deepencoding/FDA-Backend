import { z } from 'zod/v4';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

const ENVSchema = z.object({
  PORT: z.string().transform(val => parseInt(val, 10)),
  POSTGRES_URL: z.string(),
  JWT_SECRET: z.string()
});

export const config = ENVSchema.parse(process.env);
