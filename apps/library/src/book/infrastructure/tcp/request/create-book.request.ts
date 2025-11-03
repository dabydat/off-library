export class CreateBookRequest {
    constructor(
        public name: string,
        public author: string,
        public isbn: string,
        public publisher: string,
        public publicationDate: string,
        public genre: string,
        public pages: number,
        public language: string,
        public summary: string,
        public availableCopies: number,
        public price: number,
    ) { }
}