export interface PaginationModel {
  page: number;
  per_page: number;
}

export interface PaginatedModel<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
