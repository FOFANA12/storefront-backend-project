import { check, validationResult, ValidationError, Result, param } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const validateCreateRequest = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Product name cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('Product name cannot exceed 250 characters')
    .bail(),
  check('price')
    .not()
    .isEmpty()
    .withMessage('Product price cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product price must be an integer greater than zero')
    .bail(),
  check('category')
    .not()
    .isEmpty()
    .withMessage('Product category cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('Product category cannot exceed 250 characters')
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
    .withMessage('Product ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product ID must be an integer greater than zero')
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
    .withMessage('Product ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product ID must be an integer greater than zero')
    .bail(),
  check('name')
    .not()
    .isEmpty()
    .withMessage('Product name cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('Product name cannot exceed 250 characters')
    .bail(),
  check('price')
    .not()
    .isEmpty()
    .withMessage('Product price cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Product price must be an integer greater than zero')
    .bail(),
  check('category')
    .not()
    .isEmpty()
    .withMessage('Product category cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('Product category cannot exceed 250 characters')
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  }
];

export { validateCreateRequest, validateParamId, validateUpdateRequest };
