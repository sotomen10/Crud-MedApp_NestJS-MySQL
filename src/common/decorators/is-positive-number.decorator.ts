import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPositiveConstraint implements ValidatorConstraintInterface {
  validate(value: any):boolean{
    return typeof value === 'number' && value > 0;
  }

  defaultMessage() {
    return 'Value must be a positive number';
  }
}

export function IsPositive(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositiveConstraint,
    });
  };
}