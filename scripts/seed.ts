import { readFileSync } from 'fs';
import { sql } from 'bun';

await sql`${readFileSync('../src/migrations/seed_data.sql', 'utf8')}`;
console.log('Seed complete');
