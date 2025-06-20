import express from 'express';
import { userRouter } from './routes/user.route';
import { restaurantRouter } from './routes/restaurant.route';
import { orderRouter } from './routes/order.route';
import { reviewRouter } from './routes/review.route';
import { config } from './config/env';
import { homeRouter } from './routes/home.router';
import { cartRouter } from './routes/cart.route';
import { itemRouter } from './routes/item.route';

const app = express();
const port = config.PORT || 3000;

export type Restaurant = {
  id: number;
  name: string;
  type: string;
  rating: number;
  image: string;
};

export type Coupon = {
  couponId: number;
  discountAmount: string;
  description: string;
  logo: string;
};

app.use(express.json());

app.use(userRouter);
app.use(homeRouter);
app.use(restaurantRouter);
app.use(orderRouter);
app.use(reviewRouter);
app.use(cartRouter);
app.use(itemRouter);

app.listen(port, () => {
  console.log(`Server listening on url: http://localhost:${port}`);
});
