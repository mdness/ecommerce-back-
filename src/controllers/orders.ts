import { Request, Response } from 'express';
import Config from 'config';
import { EmailService } from 'services/email';
import { SmsService } from 'services/twilio';
import { CartIntItem } from '/common/interfaces/cart';
import { cartAPI } from 'api/cart';
import { isEmpty, isProductPopulated } from 'utils/others';
import { CartIsEmpty } from 'errors';
import { ordersAPI } from 'api/orders';

interface User {
  _id: string;
  name?: string;
  email: string;
  telephone: string;
  address: string;
  postalCode: string;
  number: string;
  apartment: string;
}

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    _id,
    email,
    name,
    telephone,
    address,
    postalCode,
    number,
    apartment,
  } = req.user as User;
  const products = (await cartAPI.get(_id)) as CartIntItem[];

  if (!isEmpty(products)) {
    const total = products.reduce((total, item) => {
      if (isProductPopulated(item.product))
        return (total += item.product.price * item.quantity);
      else return total;
    }, 0);

    const orderToSave = {
      products,
      status: 'placed' as const,
      total,
      shippingAddress: `${address}${number ? `, Apt ${apartment}` : ''}${
        telephone ? `, Telephone ${telephone}` : ''
      }`,
      postalCode,
    };

    const newOrder = await ordersAPI.save(_id, orderToSave);

    let emailContent = '<h2>Products</h2>';
    products.forEach(item => {
      if (isProductPopulated(item.product))
        emailContent += `
        <span style="display: block">- ${item.quantity} ${item.product.name}, ${item.product.code}, $${item.product.price} </span>
          `;
    });

    emailContent += `<h3>Total: $${total.toFixed(2)}</h3>`;

    EmailService.sendEmail(
      'maitecelcastelli@gmail.com',
      `New order from: ${name}, ${email}`,
      emailContent,
    );

    SmsService.sendMessage(
      Config.ADMIN_WHATSAPP,
      `New order from: ${name}, ${email}`,
      'whatsapp',
    );

    SmsService.sendMessage(
      telephone,
      `Your order has been taken successfully and is being processed.`,
      'sms',
    );

    await cartAPI.delete(_id);

    res
      .location(`/api/orders/${newOrder.id}`)
      .status(201)
      .json({ data: newOrder });
  } else {
    throw new CartIsEmpty(404, 'Cart is empty!');
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.user as User;
  const orders = await ordersAPI.get(_id);
  res.json({ data: orders });
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.user as User;
  const orders = await ordersAPI.get(_id, req.params.id);
  res.json({ data: orders });
};

export const completeOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.user as User;
  const completedOrder = await ordersAPI.update(req.body.id);

  const total = completedOrder.products.reduce((total, item) => {
    if (isProductPopulated(item.product))
      return (total += item.product.price * item.quantity);
    else return total;
  }, 0);

  let emailContent = `
    <h2>Order ${completedOrder.id}</h2>
    <h4>Products:</h4>
  `;

  completedOrder.products.forEach(item => {
    if (isProductPopulated(item.product))
      emailContent += `
        <span style="display: block">- ${item.quantity} ${item.product.name}, $${item.product.price} </span>
        `;
  });

  emailContent += `<h3>Total: $${total.toFixed(2)}</h3>`;

  EmailService.sendEmail(
    email,
    `Order completed: ${completedOrder.id}`,
    emailContent,
  );

  res.json({ data: completedOrder });
};
