import express from 'express';
import { userRouter } from './routes/user.route';
import { restaurantRouter } from './routes/restaurant.route';
import { orderRouter } from './routes/order.route';
import { reviewRouter } from './routes/review.route';
import { config } from './config/env';
import { homeRouter } from './routes/home.router';
import { cartRouter } from './routes/cart.route';

const app = express();
const port = config.PORT || 3000;

export type Restaurant = {
  id: string;
  name: string;
  type: string;
  rating: string;
  image: string;
  deliveryFee: string;
  deliveryTime?: string;
  logo?: string;
};

export type Coupon = {
  couponId: string;
  discountAmount: string;
  description: string;
  logo: string;
};

app.use(express.json());

app.get('/', function (_req, res) {
	res.redirect('/home');
});

app.use(userRouter);
app.use(homeRouter);
app.use(restaurantRouter);
app.use(orderRouter);
app.use(reviewRouter);
app.use(cartRouter);

app.listen(port, () => {
  console.log(`Server listening on url: http://localhost:${port}`);
});
