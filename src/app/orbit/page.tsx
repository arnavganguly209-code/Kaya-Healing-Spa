import { OrbitPanel } from "@/components/orbit-panel";
import { isOrbitAuthed } from "@/lib/orbit-auth";
import { readOrbitContent } from "@/lib/orbit-store";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrbitPage() {
  if (!(await isOrbitAuthed())) redirect("/orbit/login");
  return <OrbitPanel initial={readOrbitContent()} />;
}
