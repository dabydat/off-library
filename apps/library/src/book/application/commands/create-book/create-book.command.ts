import { ICommand } from "@nestjs/cqrs";

export class CreateBookCommand implements ICommand {
    constructor(
        public readonly name: string,
        public readonly author: string,
        public readonly isbn: string,
        public readonly publisher: string,
        public readonly publicationDate: string,
        public readonly genre: string,
        public readonly pages: number,
        public readonly language: string,
        public readonly summary: string
    ) { }
}