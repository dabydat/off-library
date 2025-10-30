import { AddAStarToBookHandler } from "./add-a-star-to-book/add-a-star-to-book.handler";
import { CreateBookHandler } from "./create-book/create-book.handler";

export const CommandHandlers = [
    CreateBookHandler,
    AddAStarToBookHandler,
];