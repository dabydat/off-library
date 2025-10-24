export interface ValueObjectProps {
  [index: string]: any;
}

export default abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public get(propertyName: keyof T): any {
    return this.props[propertyName];
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return this.shallowEqual(this.props, vo.props);
  }

  private shallowEqual(objA: any, objB: any): boolean {
    if (objA === objB) return true;
    if (typeof objA !== "object" || objA === null ||
      typeof objB !== "object" || objB === null) {
      return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (objA[key] !== objB[key]) return false;
    }
    return true;
  }
}