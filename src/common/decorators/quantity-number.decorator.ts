import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDigits(digitCount: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDigits',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [digitCount],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [expectedDigitCount] = args.constraints;
          const regex = new RegExp(`^\\d{${expectedDigitCount}}$`);
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [expectedDigitCount] = args.constraints;
          return `${args.property} must be a ${expectedDigitCount}-digit number`;
        },
      },
    });
  };
}