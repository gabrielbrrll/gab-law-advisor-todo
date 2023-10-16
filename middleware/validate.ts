import Joi from 'joi';
import httpStatus from 'http-status';

const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    /**
     * body validation only
     * in the future, can do with params and query
     */
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: error.details[0].message
      });
    }

    next();
  };
};

export default validate;
