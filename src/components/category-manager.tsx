"use client";

import {
  removePackageCategoryAt,
  removeServiceCategoryAt,
  slugifyCategory,
  updatePackageCategorySlug,
  updateServiceCategorySlug,
} from "@/lib/catalog-cms";
import type { Service, SpaPackage } from "@/lib/types";

type Props = {
  categories: string[];
  packageCategories: string[];
  services: Service[];
  packages: SpaPackage[];
  onChange: (next: {
    categories?: string[];
    packageCategories?: string[];
    services?: Service[];
    packages?: SpaPackage[];
  }) => void;
  onPublish?: (next: {
    categories: string[];
    packageCategories: string[];
    services: Service[];
    packages: SpaPackage[];
  }) => void;
};

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

export function CategoryManager({ categories, packageCategories, services, packages, onChange, onPublish }: Props) {
  const serviceCounts = categories.map((c) => services.filter((s) => s.category === c).length);
  const packageCounts = packageCategories.map((c) => packages.filter((p) => p.category === c).length);

  function apply(next: Parameters<Props["onChange"]>[0]) {
    onChange(next);
    if (onPublish) {
      onPublish({
        categories: next.categories ?? categories,
        packageCategories: next.packageCategories ?? packageCategories,
        services: next.services ?? services,
        packages: next.packages ?? packages,
      });
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-[#6B6B6B]">
          Service menu categories (header dropdown + /services filters). Renaming moves all treatments in that category. Removing asks where to shift them.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm font-semibold"
          onClick={() => apply({ categories: [...categories, slugifyCategory("new-category") || "new-category"] })}
        >
          Add service category
        </button>
        {categories.map((category, index) => (
          <div key={`svc-cat-${index}`} className="mt-4 rounded-2xl border border-[#efe8e0] bg-[#fffdfb] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8175]">
              {serviceCounts[index] ?? 0} treatment{serviceCounts[index] === 1 ? "" : "s"}
            </p>
            <Field
              label="Category slug"
              value={category}
              onChange={(value) => {
                const { categories: c, services: s } = updateServiceCategorySlug(categories, services, index, value);
                apply({ categories: c, services: s });
              }}
            />
            {categories.length > 1 ? (
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className="text-sm">
                  Remove — move treatments to
                  <select
                    className="ml-2 rounded-lg border border-[#efe8e0] px-2 py-1"
                    defaultValue={categories.find((_, i) => i !== index) || "massage"}
                    id={`svc-move-${index}`}
                  >
                    {categories
                      .filter((_, i) => i !== index)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-800"
                  onClick={() => {
                    const select = document.getElementById(`svc-move-${index}`) as HTMLSelectElement | null;
                    const moveTo = select?.value || categories.find((_, i) => i !== index) || "massage";
                    const { categories: c, services: s } = removeServiceCategoryAt(categories, services, index, moveTo);
                    apply({ categories: c, services: s });
                  }}
                >
                  Remove category
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold">Package categories</p>
        <p className="mt-1 text-sm text-[#6B6B6B]">Same rules for /packages menu and filters.</p>
        <button
          type="button"
          className="mt-4 rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm font-semibold"
          onClick={() =>
            apply({ packageCategories: [...packageCategories, slugifyCategory("new-package") || "new-package"] })
          }
        >
          Add package category
        </button>
        {packageCategories.map((category, index) => (
          <div key={`pkg-cat-${index}`} className="mt-4 rounded-2xl border border-[#efe8e0] bg-[#fffdfb] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8175]">
              {packageCounts[index] ?? 0} package{packageCounts[index] === 1 ? "" : "s"}
            </p>
            <Field
              label="Category slug"
              value={category}
              onChange={(value) => {
                const { packageCategories: c, packages: p } = updatePackageCategorySlug(packageCategories, packages, index, value);
                apply({ packageCategories: c, packages: p });
              }}
            />
            {packageCategories.length > 1 ? (
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className="text-sm">
                  Remove — move packages to
                  <select
                    className="ml-2 rounded-lg border border-[#efe8e0] px-2 py-1"
                    defaultValue={packageCategories.find((_, i) => i !== index) || "wellness"}
                    id={`pkg-move-${index}`}
                  >
                    {packageCategories
                      .filter((_, i) => i !== index)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-800"
                  onClick={() => {
                    const select = document.getElementById(`pkg-move-${index}`) as HTMLSelectElement | null;
                    const moveTo = select?.value || packageCategories.find((_, i) => i !== index) || "wellness";
                    const { packageCategories: c, packages: p } = removePackageCategoryAt(packageCategories, packages, index, moveTo);
                    apply({ packageCategories: c, packages: p });
                  }}
                >
                  Remove category
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
