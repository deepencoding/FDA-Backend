import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { insertUser, findUserByPhone, type UserRecord } from '../models/user.model';
import { config } from '../config/env';

export type NewUser = {
  name: string;
  phone_no: string;
  password: string;
  role?: 'user' | 'restaurant';
};

const saltRounds = 10;

export async function register(user: NewUser): Promise<string> {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  try {
    await insertUser({
      name: user.name,
      phone_no: user.phone_no,
      password_hash: hashedPassword,
      role: user.role
    });
		return login({ phone_no: user.phone_no, password: user.password });
  } catch(error) {
    throw error;
  };
};

export async function login({
  phone_no, password
}: {
  phone_no: string; password: string;
}): Promise<string> {
  try {
    const user: UserRecord | undefined = await findUserByPhone(phone_no);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Wrong Password');

    const token = jwt.sign({ id: user.id?.toString(), role: user.role }, config.JWT_SECRET, {
      expiresIn: '7 days',
    });

    return token;
  } catch (error) {
    throw error;
  };
};
