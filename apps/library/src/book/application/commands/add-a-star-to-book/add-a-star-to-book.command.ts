import { ICommand } from "@nestjs/cqrs";

export class AddAStarToBookCommand implements ICommand {
    constructor(
        public readonly bookId: string,
    ) { }
}