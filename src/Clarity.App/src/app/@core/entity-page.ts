export interface EntityPage<T> {
    totalPages: number,
    currentPage: number,
    length: number,
    entities: T[]
};