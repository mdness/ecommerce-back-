import { Request, Response } from 'express';
import { isValidProduct } from 'utils/validations';
import { IntItem, QueryIntItem } from 'common/interfaces/products';
import { productsAPI } from 'api/products';
import { NotFound, NotImplemented, ProductValidation } from 'errors';
import { isEmpty } from 'utils/others';
import { UploadedFile } from 'express-fileupload';
import { uploadToCloudinary } from 'utils/cloudinaryImg';
import cloudinary from 'services/cloudinary';

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!isEmpty(req.query)) {
    const { name, code, minPrice, maxPrice, minStock, maxStock } = req.query;
    const query: QueryIntItem = {};

    if (name) query.name = name.toString();
    if (code) query.code = code.toString();
    if (minPrice) query.minPrice = Number(minPrice);
    if (maxPrice) query.maxPrice = Number(maxPrice);
    if (minStock) query.minStock = Number(minStock);
    if (maxStock) query.maxStock = Number(maxStock);

    res.json({
      data: await productsAPI.query(query),
    });
  } else {
    const products = await productsAPI.get();
    if (!isEmpty(products)) res.json({ data: products });
    else throw new NotFound(404, 'There is no products!');
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const product = await productsAPI.get(req.params.id);
  if (!isEmpty(product)) res.json({ data: product });
  else throw new NotFound(404, 'Product not found.');
};

export const getProductsByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const products = await productsAPI.getByCategory(req.params.category);
  if (products) res.json({ data: products });
  else throw new NotImplemented(500, 'Method not implemented');
};

export const saveProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const product = req.body;

  product.price = Number(product.price);
  product.stock = Number(product.stock);

  isValidProduct(product);

  if (req.files) {
    const file = req.files.photo as UploadedFile;
    const { secure_url, public_id } = await uploadToCloudinary(
      file,
      'Products',
    );
    product.photo = secure_url;
    product.photoId = public_id;
  } else {
    throw new ProductValidation(400, 'Please enter a product image.');
  }

  const newProduct: IntItem = await productsAPI.save(product);
  res
    .location(`/api/products/${newProduct.id}`)
    .status(201)
    .json({ data: newProduct });
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dataToUpdate = req.body;

  dataToUpdate.price = Number(dataToUpdate.price);
  dataToUpdate.stock = Number(dataToUpdate.stock);

  if (req.files) {
    const file = req.files.photo as UploadedFile;
    if (dataToUpdate.photoId)
      await cloudinary.uploader.destroy(dataToUpdate.photoId);
    const { secure_url, public_id } = await uploadToCloudinary(
      file,
      'Products',
    );
    dataToUpdate.photo = secure_url;
    dataToUpdate.photoId = public_id;
  }

  isValidProduct(dataToUpdate);

  const product = await productsAPI.update(req.params.id, dataToUpdate);
  res.json({ data: product });
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const product = (await productsAPI.get(req.params.id)) as IntItem;
  if (product.photoId) await cloudinary.uploader.destroy(product.photoId);
  await productsAPI.delete(req.params.id);
  res.json({ data: 'Product deleted.' });
};
