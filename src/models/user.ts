import { sql } from "bun";

export type UserRecord = {
  id: number;
  name: string;
  phone_no: string;
  password_hash: string;
  role: 'user' | 'restaurant';
  created_at: string;
};

export async function insertUser(userData: {
  name: string; phone_no: string; password_hash:string; role: 'user' | 'restaurant';
}) {
  await sql`INSERT INTO users ${sql(userData)}`;
};

export async function findUserByPhone(phone_no: string): Promise<UserRecord | undefined> {
  const result: UserRecord[] = await sql`SELECT * FROM users WHERE phone_no = ${phone_no}`;
  return result[0];
};
