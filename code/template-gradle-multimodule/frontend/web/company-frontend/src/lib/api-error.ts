/**
 * Pull the server's own error message out of an axios error, falling back to a caller-supplied
 * generic. The backend wraps errors as { success:false, error:{ code, message } } - when a message
 * exists it is written for the USER and is always better than a hardcoded "something went wrong".
 */
export function apiErrorMessage(err: unknown, fallback: string): string {
  const maybe = err as {
    response?: { data?: { error?: { message?: string }; message?: string } };
  };
  return (
    maybe?.response?.data?.error?.message ||
    maybe?.response?.data?.message ||
    fallback
  );
}
