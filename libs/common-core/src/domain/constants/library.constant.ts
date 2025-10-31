import { LibraryMessagePatterns } from "../enums/library-message-patterns.enum";
import { ControllerAction } from "../types/controller-action.type";

export const LibraryControllerName: string = 'library';

export const LibraryRoutes = {
    GET_BOOKS: '',
    CREATE_BOOK: '/create-book',
    BUY_BOOK: '/buy-book',
} as const;

export const LibraryControllerMap: Record<
    keyof typeof LibraryRoutes,
    ControllerAction<LibraryMessagePatterns>
> = {
    GET_BOOKS: {
        ROUTE: LibraryRoutes.GET_BOOKS,
        MESSAGE_PATTERN: LibraryMessagePatterns.GET_BOOKS,
    },
    CREATE_BOOK: {
        ROUTE: LibraryRoutes.CREATE_BOOK,
        MESSAGE_PATTERN: LibraryMessagePatterns.CREATE_BOOK,
    },
    BUY_BOOK: {
        ROUTE: LibraryRoutes.BUY_BOOK,
        MESSAGE_PATTERN: LibraryMessagePatterns.BUY_BOOK,
    }
} as const;
