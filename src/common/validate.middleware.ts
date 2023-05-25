import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidator: ClassConstructor<object>) {
  }

  execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = instanceToPlain(this.classToValidator, body);
    validate(instance).then(err => {
      if (err.length > 0) {
        res.status(422).send(err);
      } else {
        next();
      }
    });
  }
}
