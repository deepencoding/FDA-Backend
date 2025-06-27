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
}): Promise<void> {
  const result: UserRecord[] = await sql`
		INSERT INTO users ${sql(userData)} RETURNING id
	`;
  const newUserId = result[0]?.id;

  if (userData.role === 'restaurant') {
    await sql`
			INSERT INTO restaurant_info (restaurant_id, name) VALUES (${newUserId}, ${userData.name})
		`;
  }
};

export async function findUserByPhone(phone_no: string): Promise<UserRecord | undefined> {
  const result: UserRecord[] = await sql`
		SELECT * FROM users WHERE phone_no = ${phone_no}
	`;
  return result[0];
};
