import { Request, Response } from 'express';
import { cartAPI } from 'api/cart';
import { NotFound, ProductValidation } from 'errors';
import { CartIntItem } from 'common/interfaces/cart';

interface User {
  _id: string;
  email: string;
}

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.user as User;
  const products = await cartAPI.get(_id);
  res.json({ data: products });
};

export const getCartProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { _id } = req.user as User;
  const product = await cartAPI.get(_id, req.params.id);
  if (product) res.json({ data: product });
  else throw new NotFound(404, 'Product does not exist on cart.');
};

export const saveCartProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { _id } = req.user as User;
  const newCart = (await cartAPI.save(_id, req.params.id)) as CartIntItem[];
  res.status(200).json({ data: newCart });
};

export const editCartProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { _id } = req.user as User;
  const { productId, amount } = req.body;

  if (!productId) throw new ProductValidation(404, 'Product ID is required');

  if (!amount) throw new ProductValidation(404, 'Product quantity is required');

  if (Number(amount) === 0)
    res.json({ data: await cartAPI.delete(_id, productId) });
  else if (Number(amount) > 0)
    res.json({
      data: await cartAPI.update(_id, productId, Number(amount)),
    });
  else throw new ProductValidation(404, 'Quantity must be a non-zero number');
};

export const deleteCartProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { _id } = req.user as User;
  const newCartProductList = await cartAPI.delete(_id, req.params.id);
  res.json({ data: newCartProductList });
};

export const deleteCartAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { _id } = req.user as User;
  const newCartProductList = await cartAPI.delete(_id);
  res.json({ data: newCartProductList });
};
