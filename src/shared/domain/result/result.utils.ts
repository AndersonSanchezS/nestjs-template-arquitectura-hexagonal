import { Result, success, failure } from './result';

export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  if (result.isSuccess()) {
    return success(fn(result.value)) as Result<U, E>;
  }
  return result as Result<U, E>;
};

export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  if (result.isSuccess()) {
    return fn(result.value);
  }
  return result;
};

export const getOrElse = <T, E>(
  result: Result<T, E>,
  defaultValue: T
): T => {
  if (result.isSuccess()) {
    return result.value;
  }
  return defaultValue;
};

export const getOrThrow = <T, E>(result: Result<T, E>): T => {
  if (result.isSuccess()) {
    return result.value;
  }
  throw result.error;
};

export const fold = <T, U, E>(
  result: Result<T, E>,
  onSuccess: (value: T) => U,
  onFailure: (error: E) => U
): U => {
  if (result.isSuccess()) {
    return onSuccess(result.value);
  }
  return onFailure(result.error);
}; 