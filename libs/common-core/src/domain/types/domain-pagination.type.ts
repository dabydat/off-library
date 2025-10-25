export class DomainPagination<T> {
    constructor(
        public readonly items: T,
        public readonly totalItems: number,
        public readonly totalPages: number,
        public readonly currentPage: number,
        public readonly pageSize: number,
    ) { }
}
