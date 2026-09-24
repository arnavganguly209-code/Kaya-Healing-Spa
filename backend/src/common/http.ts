export function ok<T>(data: T, message = "ok") {
  return { success: true, message, data };
}
