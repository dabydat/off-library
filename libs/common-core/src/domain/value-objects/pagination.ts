import { PaginationException } from "../exceptions/pagination.exception";
import ValueObject from "./value-object";

interface PaginationProps {
  page: number;
  limit: number;
}

export class Pagination extends ValueObject<PaginationProps> {
  private constructor(
    private readonly page: number,
    private readonly limit: number,
  ) {
    super({ page, limit });
  }

  public static create(page: number, limit: number): Pagination {
    Pagination.validate(page, limit);

    return new Pagination(page, limit);
  }

  private static validate(page: number, limit: number): void {
    if (page <= 0) {
      throw new PaginationException(
        `Page number must be greater than 0, Received: ${page}`,
      );
    }
    if (limit <= 0) {
      throw new PaginationException(
        `Limit must be greater than 0. Received: ${limit}`,
      );
    }
    if (limit > 100) {
      throw new PaginationException(
        `Limit cannot exceed 100 items per page. Received: ${limit}`,
      );
    }
  }

  public get getPage(): number {
    return this.page;
  }

  public get getLimit(): number {
    return this.limit;
  }

  public get getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  public getTotalPages(totalItems: number): number {
    if (totalItems < 0) {
      throw new PaginationException(
        `Total items cannot be negative. Received: ${totalItems}`,
      );
    }

    return Math.ceil(totalItems / this.limit);
  }
}
