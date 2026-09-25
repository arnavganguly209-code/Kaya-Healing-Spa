import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";

export type AdminCredentials = {
  username: string;
  password: string;
};

export type AdminInquiry = {
  id: string;
  type: "booking" | "contact";
  createdAt: string;
  read: boolean;
  name: string;
  email: string;
  phone: string;
  summary: string;
  payload: Record<string, unknown>;
};

const credPath = dataFilePath("admin-auth.json");
const inquiryPath = dataFilePath("admin-inquiries.json");

export const defaultAdminCredentials: AdminCredentials = {
  username: "kaya",
  password: "kayathamel@12345",
};

export function readAdminCredentials(): AdminCredentials {
  const saved = readJsonFile(credPath, () => null as Partial<AdminCredentials> | null);
  if (!saved) return { ...defaultAdminCredentials };
  return {
    username: saved.username?.trim() || defaultAdminCredentials.username,
    password: saved.password || defaultAdminCredentials.password,
  };
}

export function writeAdminCredentials(credentials: AdminCredentials) {
  writeJsonFileAtomic(credPath, {
    username: credentials.username.trim() || defaultAdminCredentials.username,
    password: credentials.password || defaultAdminCredentials.password,
  });
}

export function readInquiries(): AdminInquiry[] {
  return readJsonFile(inquiryPath, () => []);
}

export function appendInquiry(entry: Omit<AdminInquiry, "id" | "createdAt" | "read">) {
  const item: AdminInquiry = {
    ...entry,
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const list = readInquiries();
      list.unshift(item);
      writeJsonFileAtomic(inquiryPath, list.slice(0, 500));
      return item;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Could not save inquiry.");
}

export function updateInquiries(list: AdminInquiry[]) {
  writeJsonFileAtomic(inquiryPath, list.slice(0, 500));
}
