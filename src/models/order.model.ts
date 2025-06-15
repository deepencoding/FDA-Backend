import { sql } from "bun";
import type { MenuItem } from "./restaurant.model";

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Order = {
  id: number;
  user_id: number;
  restaurant_id: number;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { menu_item: MenuItem })[];
  restaurant_name: string;
};

// Create a new order with items
export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<OrderItem, 'id' | 'order_id' | 'total_price'>[]
): Promise<Order> {
  // Start a transaction
  return await sql.transaction(async (tx) => {
    // Create the order
    const [order]: Order[] = await tx`
      INSERT INTO orders ${sql(orderData)}
      RETURNING *
    `;

    // TODO: handle this how you want
    if (!order) {
      return;
    }

    // Create order items
    for (const item of items) {
      const total_price = item.unit_price * item.quantity;
      await tx`
        INSERT INTO order_items ${sql({
          order_id: order.id,
          ...item,
          total_price
        })}
      `;
    }

    return order;
  });
}

// Get order by ID with items
export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  const orders: OrderWithItems[] = await sql`
    SELECT
      o.*,
      r.name as restaurant_name,
      json_agg(
        json_build_object(
          'id', oi.id,
          'order_id', oi.order_id,
          'menu_item_id', oi.menu_item_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'total_price', oi.total_price,
          'special_instructions', oi.special_instructions,
          'menu_item', json_build_object(
            'id', mi.id,
            'name', mi.name,
            'description', mi.description,
            'price', mi.price,
            'category', mi.category
          )
        )
      ) as items
    FROM orders o
    JOIN restaurant_info r ON r.restaurant_id = o.restaurant_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE o.id = ${orderId}
    GROUP BY o.id, r.name
  `;

  return orders[0] || null;
}

// Get orders by user ID
export async function getOrdersByUserId(userId: number): Promise<OrderWithItems[]> {
  return await sql`
    SELECT
      o.*,
      r.name as restaurant_name,
      json_agg(
        json_build_object(
          'id', oi.id,
          'order_id', oi.order_id,
          'menu_item_id', oi.menu_item_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'total_price', oi.total_price,
          'special_instructions', oi.special_instructions,
          'menu_item', json_build_object(
            'id', mi.id,
            'name', mi.name,
            'description', mi.description,
            'price', mi.price,
            'category', mi.category
          )
        )
      ) as items
    FROM orders o
    JOIN restaurant_info r ON r.restaurant_id = o.restaurant_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE o.user_id = ${userId}
    GROUP BY o.id, r.name
    ORDER BY o.created_at DESC
  ` as OrderWithItems[];
}

// Get orders by restaurant ID
export async function getOrdersByRestaurantId(restaurantId: number): Promise<OrderWithItems[]> {
  return await sql`
    SELECT
      o.*,
      r.name as restaurant_name,
      json_agg(
        json_build_object(
          'id', oi.id,
          'order_id', oi.order_id,
          'menu_item_id', oi.menu_item_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'total_price', oi.total_price,
          'special_instructions', oi.special_instructions,
          'menu_item', json_build_object(
            'id', mi.id,
            'name', mi.name,
            'description', mi.description,
            'price', mi.price,
            'category', mi.category
          )
        )
      ) as items
    FROM orders o
    JOIN restaurant_info r ON r.restaurant_id = o.restaurant_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE o.restaurant_id = ${restaurantId}
    GROUP BY o.id, r.name
    ORDER BY
      CASE
        WHEN o.status = 'pending' THEN 1
        WHEN o.status = 'confirmed' THEN 2
        WHEN o.status = 'preparing' THEN 3
        WHEN o.status = 'ready' THEN 4
        WHEN o.status = 'out_for_delivery' THEN 5
        ELSE 6
      END,
      o.created_at DESC
  ` as OrderWithItems[];
}

// Update order status
export async function updateOrderStatus(
  orderId: number,
  restaurantId: number,
  status: OrderStatus
): Promise<Order | null> {
  const result: Order[] = await sql`
    UPDATE orders
    SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${orderId} AND restaurant_id = ${restaurantId}
    RETURNING *
  `;
  return result[0] || null;
}