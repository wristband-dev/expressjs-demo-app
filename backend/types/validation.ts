export interface ValidationError extends Error {
  data?: {
    code: string;
    message: any;
  };
}

export interface ConstraintViolation {
  code: string;
  [key: string]: any;
}

export interface ConstraintViolationsResponse {
  status: number;
  data?: {
    type: string;
    code: string;
    violations?: {
      [field: string]: ConstraintViolation[];
    };
  };
}
