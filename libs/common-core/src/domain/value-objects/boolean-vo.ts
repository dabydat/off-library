import { BooleanVOException } from "../exceptions";
import ValueObject from "./value-object";


interface BooleanVOProps {
  value: boolean;
}

export class BooleanVO extends ValueObject<BooleanVOProps> {
  private constructor(private readonly value: boolean) {
    super({ value });
  }

  public static create(value: boolean): BooleanVO {
    BooleanVO.validate(value);

    return new BooleanVO(Boolean(value));
  }

  private static validate(value: boolean): void {
    if (typeof value !== 'boolean') {
      throw new BooleanVOException(value);
    }
  }

  public get getValue(): boolean {
    return this.value;
  }
}
