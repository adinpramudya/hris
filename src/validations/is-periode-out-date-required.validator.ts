import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EmployeeType } from 'src/enums/enum';

@ValidatorConstraint({ name: 'isPeriodeOutDateRequired', async: false })
export class IsPeriodeOutDateRequiredConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any; // Casting to `any` to access the DTO properties
    const employeeType = object.employeeType;

    if (
      employeeType !== EmployeeType.PERMANENT_EMPLOYEE ||
      employeeType !== EmployeeType.EXECUTIVE ||
      employeeType !== EmployeeType.MANAGERIAL
    ) {
      return true;
    }

    return !!value;
  }

  defaultMessage(): string {
    return 'Tanggal Selesai Kontrak harus diisi jika Tipe Karyawan bukan "karyawan tetap"';
  }
}

export function IsPeriodeOutDateRequired() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'Tanggal Selesai Kontrak harus diisi jika Tipe Karyawan bukan "karyawan tetap"',
      },
      constraints: [],
      validator: IsPeriodeOutDateRequiredConstraint,
    });
  };
}
