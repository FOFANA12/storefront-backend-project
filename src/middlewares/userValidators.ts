import { check, validationResult, ValidationError, Result, param } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const validateCreateRequest = [
  check('firstname')
    .not()
    .isEmpty()
    .withMessage('User firstname cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('User firstname cannot exceed 250 characters')
    .bail(),
  check('lastname')
    .not()
    .isEmpty()
    .withMessage('User lastname cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('User lastname cannot exceed 250 characters')
    .bail(),
  check('username')
    .not()
    .isEmpty()
    .withMessage('User username cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('User username cannot exceed 250 characters')
    .bail(),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('User password cannot be empty')
    .bail()
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters')
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
    .withMessage('User ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('User ID must be an integer greater than zero')
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
    .withMessage('User ID cannot be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('User ID must be an integer greater than zero')
    .bail(),
  check('firstname')
    .not()
    .isEmpty()
    .withMessage('User firstname cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('User firstname cannot exceed 250 characters')
    .bail(),
  check('lastname')
    .not()
    .isEmpty()
    .withMessage('User lastname cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('User lastname cannot exceed 250 characters')
    .bail(),
  check('username')
    .not()
    .isEmpty()
    .withMessage('User username cannot be empty')
    .bail()
    .isLength({ max: 250 })
    .withMessage('User username cannot exceed 250 characters')
    .bail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  }
];

const validateAuthRequest = [
  check('username').not().isEmpty().withMessage('User username cannot be empty').bail(),
  check('password').trim().not().isEmpty().withMessage('User password cannot be empty').bail(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  }
];

export { validateCreateRequest, validateParamId, validateUpdateRequest, validateAuthRequest };
