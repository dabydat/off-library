import { TinyIntVOException } from "../exceptions/tinyint-vo.exception";
import ValueObject from "./value-object";

interface TinyIntVOProps {
  value: number;
}

export class TinyIntVO extends ValueObject<TinyIntVOProps> {
  private constructor(private readonly value: number) {
    super({ value });
  }

  public static create(value: number): TinyIntVO {
    TinyIntVO.validate(value);
    return new TinyIntVO(value);
  }

  private static validate(value: number): void {
    if (!Number.isInteger(value) || value < 0 || value > 255) {
      throw new TinyIntVOException(value);
    }
  }

  public get getValue(): number {
    return this.value;
  }
}
