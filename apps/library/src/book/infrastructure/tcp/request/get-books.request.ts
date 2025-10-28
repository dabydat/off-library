export class GetBooksRequest {
    constructor(
        public readonly limit: number,
        public readonly page: number,
    ) { }
}