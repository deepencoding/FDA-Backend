import express from 'express';
import { sql } from 'bun';
import { auth } from './middlewares/auth.middleware';
import userRouter from './routes/user.route';
import restaurantRouter from './routes/restaurant.route';
import orderRouter from './routes/order.route';
import reviewRouter from './routes/review.route';
import { config } from './config/env';

const app = express();
const port = config.PORT || 3000;

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
app.use(restaurantRouter);
app.use(orderRouter);
app.use(reviewRouter);

// Auth middleware
app.use(auth);

// Protected routes
app.get('/', async (_req, res) => {
  try {
    const restaurants: Restaurant[] = await sql`SELECT restaurant_id, name, type, rating, image_url, address FROM restaurant_info`;
    res.json({
      success: true,
      data: {
        restaurantList: restaurants.map((r) => ({
          name: r.name,
          type: r.type,
          rating: r.rating.toString()
        })),
        message: 'List of all registered restaurants returned.'
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
  console.log(`Server listening on url: http://localhost:${port}`);
});
