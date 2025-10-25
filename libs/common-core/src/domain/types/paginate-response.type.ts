export class PaginatedResponse<T> {
    public constructor(
        private readonly elements: T,
        private readonly totalElements: number,
        private readonly totalPages: number,
        private readonly limit: number,
        private readonly page: number,
    ) { }
}
