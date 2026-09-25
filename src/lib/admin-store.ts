import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

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

const credPath = path.join(process.cwd(), "data", "admin-auth.json");
const inquiryPath = path.join(process.cwd(), "data", "admin-inquiries.json");

export const defaultAdminCredentials: AdminCredentials = {
  username: "kaya",
  password: "kayathamel@12345",
};

export function readAdminCredentials(): AdminCredentials {
  if (!existsSync(credPath)) return { ...defaultAdminCredentials };
  try {
    const saved = JSON.parse(readFileSync(credPath, "utf8")) as Partial<AdminCredentials>;
    return {
      username: saved.username?.trim() || defaultAdminCredentials.username,
      password: saved.password || defaultAdminCredentials.password,
    };
  } catch {
    return { ...defaultAdminCredentials };
  }
}

export function writeAdminCredentials(credentials: AdminCredentials) {
  mkdirSync(path.dirname(credPath), { recursive: true });
  writeFileSync(
    credPath,
    JSON.stringify(
      {
        username: credentials.username.trim() || defaultAdminCredentials.username,
        password: credentials.password || defaultAdminCredentials.password,
      },
      null,
      2,
    ),
  );
}

export function readInquiries(): AdminInquiry[] {
  if (!existsSync(inquiryPath)) return [];
  try {
    return JSON.parse(readFileSync(inquiryPath, "utf8")) as AdminInquiry[];
  } catch {
    return [];
  }
}

export function appendInquiry(entry: Omit<AdminInquiry, "id" | "createdAt" | "read">) {
  const list = readInquiries();
  const item: AdminInquiry = {
    ...entry,
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  list.unshift(item);
  mkdirSync(path.dirname(inquiryPath), { recursive: true });
  writeFileSync(inquiryPath, JSON.stringify(list.slice(0, 500), null, 2));
  return item;
}

export function updateInquiries(list: AdminInquiry[]) {
  mkdirSync(path.dirname(inquiryPath), { recursive: true });
  writeFileSync(inquiryPath, JSON.stringify(list.slice(0, 500), null, 2));
}
