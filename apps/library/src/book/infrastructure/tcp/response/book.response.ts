export class BookResponse {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly author: string,
        public readonly isbn: string,
        public readonly publisher: string,
        public readonly publicationDate: string,
        public readonly genre: string,
        public readonly pages: number,
        public readonly language: string,
        public readonly summary?: string,
        public readonly createdAt?: string,
        public readonly updatedAt?: string,
        public readonly starsCount?: number,
        public readonly availableCopies?: number,
        public readonly price?: number,
    ) { }
}