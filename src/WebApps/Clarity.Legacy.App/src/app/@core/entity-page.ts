// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface EntityPage<T> {
    totalPages: number,
    currentPage: number,
    length: number,
    entities: T[]
};
