import {
  registerDecorator,
  ValidationOptions,
  // ValidationArguments,
} from 'class-validator';

// TODO: Maybe not needed, remove?

interface CustomValidationOptions extends ValidationOptions {
  /**
   * Rexexpt pattern to validate against
   */
  pattern: RegExp;
}

// TODO: clean up this decorator
export function IsValidUsername(
  property: string,
  validationOptions?: CustomValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidUsername',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(
          value: any,
          // args: ValidationArguments
        ) {
          // const [relatedPropertyName] = args.constraints;
          // const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            // typeof relatedValue === 'string' &&
            validationOptions.pattern.test(value)
          );
        },
      },
    });
  };
}
