import { AdminPanel } from "@/components/admin-panel";
import { isAdminAuthed } from "@/lib/admin-auth";
import { readOrbitContent } from "@/lib/orbit-store";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const c = readOrbitContent();
  return (
    <AdminPanel
      initial={{
        hero: c.hero,
        footerBrand: c.footerBrand,
        footerText: c.footerText,
        phone: c.phone,
        whatsapp: c.whatsapp,
        email: c.email,
        socialLinks: c.socialLinks,
        extraSocialLinks: c.extraSocialLinks,
        services: c.services,
        packages: c.packages,
        therapists: c.therapists,
        categories: c.categories,
        packageCategories: c.packageCategories,
        adminSectionFlags: c.adminSectionFlags,
        homePage: c.homePage,
      }}
    />
  );
}
