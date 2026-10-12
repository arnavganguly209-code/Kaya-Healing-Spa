export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { loadRuntimeEnvFiles } = await import("./lib/runtime-env");
  loadRuntimeEnvFiles();
}
