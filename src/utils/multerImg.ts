import multer from 'multer';
import path from 'path';
import { UserValidation } from 'errors';

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + req.body.email + path.extname(file.originalname),
    );
  },
});

export const photoUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: function (req, file, callback) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return callback(null, true);
    } else {
      callback(
        new UserValidation(
          400,
          'File extension invalid. Must be: .jpg, .jpeg or .png',
        ),
      );
    }
  },
}).single('photo');
