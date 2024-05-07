import { isCPFOrCNPJ } from 'brazilian-values';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCPFOrCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isCPFOrCNPJ(value);
        },
      },
    });
  };
}