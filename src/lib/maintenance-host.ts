/** Production spa domain only — never the Global Orbit preview host. */
const MAINTENANCE_HOSTS = new Set(["kayahealingspa.com.np", "www.kayahealingspa.com.np"]);

export function isSpaMaintenanceHost(hostHeader: string | null | undefined): boolean {
  const host = (hostHeader || "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  return MAINTENANCE_HOSTS.has(host);
}
