'use strict';

import express from 'express';
import { sql } from 'bun';
import { auth } from './middlewares/auth';
import userRouter from './routes/user';

const app = express();
const port = 3000;

type Restaurant = {
  id: number;
  name: string;
  type: string;
  rating: number;
  image: string;
};

app.use(express.json());

// Public Routes
app.use(userRouter);

// Auth middleware
app.use(auth);

// Protected routes
app.get('/', async (req, res) => {
  try {
    const restaurants: Restaurant[] = await sql`SELECT restaurant_id, name, type, rating, image_url, address FROM restaurant_info`;
    res.json({
      success: true,
      data: {
        restaurantList: restaurants.map((r) => ({
          name: r.name,
          type: r.type,
          rating: r.rating.toString()
        }))
      }
    });
  } catch(error) {
    console.error('Error fetching restaurants: ', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on url: http://localhost:${port}`);
});
