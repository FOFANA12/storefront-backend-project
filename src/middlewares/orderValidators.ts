import { check, validationResult, ValidationError, Result, param } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const validateCreateRequest = [
  check('status')
    .not()
    .isEmpty()
    .withMessage('Order status cannot be empty')
    .bail()
    .isIn(['active', 'complete'])
    .withMessage('Order status must be active or complete')
    .bail(),
  check('user_id')
    .not()
    .isEmpty()
    .withMessage('User ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('User ID must be an integer greater than zero')
    .bail(),
  check('products')
    .not()
    .isEmpty()
    .withMessage('Products of order cannot be empty')
    .bail()
    .isArray({ min: 1 })
    .withMessage('Products of the order must be an array of products')
    .bail(),
  check('products.*.product_id')
    .not()
    .isEmpty()
    .withMessage('Product ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product ID must be an integer greater than zero')
    .bail(),
  check('products.*.quantity')
    .not()
    .isEmpty()
    .withMessage('Product quantity cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product quantity must be an integer greater than zero')
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  }
];

const validateParamId = [
  param('id')
    .not()
    .isEmpty()
    .withMessage('Order ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Order ID must be an integer greater than zero')
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  }
];

const validateUpdateRequest = [
  param('id')
    .not()
    .isEmpty()
    .withMessage('Order ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Order ID must be an integer greater than zero')
    .bail(),
  check('status')
    .not()
    .isEmpty()
    .withMessage('Order status cannot be empty')
    .bail()
    .isIn(['active', 'complete'])
    .withMessage('Order status must be active or complete')
    .bail(),
  check('user_id')
    .not()
    .isEmpty()
    .withMessage('User ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('User ID must be an integer greater than zero')
    .bail(),
  check('products')
    .not()
    .isEmpty()
    .withMessage('Products of order cannot be empty')
    .bail()
    .isArray({ min: 1 })
    .withMessage('Products of the order must be an array of products')
    .bail(),
  check('products.*.product_id')
    .not()
    .isEmpty()
    .withMessage('Product ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product ID must be an integer greater than zero')
    .bail(),
  check('products.*.quantity')
    .not()
    .isEmpty()
    .withMessage('Product quantity cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product quantity must be an integer greater than zero')
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  }
];

export { validateCreateRequest, validateParamId, validateUpdateRequest };
