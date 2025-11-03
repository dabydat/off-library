import { ICommand } from "@nestjs/cqrs";

export class BuyABookCommand implements ICommand {
    constructor(
        public readonly bookId: string,
    ) { }
}