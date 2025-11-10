import { Request } from 'express';
import { validationResult } from 'express-validator';

import { ConstraintViolationsResponse, ValidationError } from '../types/validation';

const CONSTRAINT_VIOLATIONS_ERROR = 'constraint_violations_error';
const MESSAGE_BODY_CONSTRAINT_VIOLATIONS_ERROR = 'message_body_constraint_violations';
const REQUEST_VALIDATION_FAILED = 'REQUEST_VALIDATION_FAILED';

export function reqValidation(req: Request): void {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    const error = new Error() as ValidationError;
    error.data = { code: REQUEST_VALIDATION_FAILED, message: errors };
    throw error;
  }
}

export function hasConstraintsViolations(response?: ConstraintViolationsResponse): boolean {
  if (!response) {
    return false;
  }

  const { data, status } = response;
  return (
    status === 400 &&
    !!data &&
    data.type === CONSTRAINT_VIOLATIONS_ERROR &&
    data.code === MESSAGE_BODY_CONSTRAINT_VIOLATIONS_ERROR &&
    !!data.violations
  );
}

export function emailExists(response: ConstraintViolationsResponse): boolean {
  return !!(
    response.data?.violations?.email &&
    response.data.violations.email
      .map((item) => {
        return item.code;
      })
      .includes('not_unique')
  );
}
