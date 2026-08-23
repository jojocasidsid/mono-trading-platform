export interface ApiErrorDetail {
  code: string;
  message: string;
  pointer?: string;
}

export interface ApiErrorResponse {
  errors: ApiErrorDetail[];
}
