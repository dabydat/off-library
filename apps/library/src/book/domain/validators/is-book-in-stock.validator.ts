import { IsBookInStockValidatorException } from "../exceptions";
import { Book } from "../models/book";

export class IsBookInStockValidator {
    public constructor(private readonly book: Book) { }

    public validate(): void {
        this.validateIsInStock();
    }

    private validateIsInStock(): void {
        const primitives = this.book.toPrimitives();
        const currentQuantity = primitives.quantity;
        if (currentQuantity === 0) {
            throw new IsBookInStockValidatorException(`The book "${primitives.name}" is out of stock.`);
        }
    }
}
