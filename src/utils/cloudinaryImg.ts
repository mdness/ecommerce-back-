import { UploadedFile } from 'express-fileupload';
import cloudinary from 'services/cloudinary';
import { FileValidation } from 'errors';

export const uploadToCloudinary = async (
  file: UploadedFile,
  folder: 'Users' | 'Products',
): Promise<{ secure_url: string; public_id: string }> => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  if (file.size > 1024 * 1024) {
    throw new FileValidation(400, 'Image size must be at least 1mb');
  }
  if (!mimetype) {
    throw new FileValidation(
      400,
      'Invalid file extension. Allowed formats: .jpg, .jpeg or .png',
    );
  }
  const { tempFilePath } = file;
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    tempFilePath,
    { folder },
  );

  return { secure_url, public_id };
};
