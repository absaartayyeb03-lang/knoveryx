'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

export default function FilterDropdown({ label, name, options }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current value from URL
  const currentValue = searchParams.get(name) || "";

  const handleChange = (value: string) => {
    let newUrl = "";

    if (value) {
      // set / update param
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: name,
        value,
      });
    } else {
      // remove param when "Any" is selected
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      newUrl = `?${params.toString()}`;
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1 font-medium">
        {label}
      </label>

      <select
        value={currentValue}   // ✅ IMPORTANT
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded-md px-3 py-2 bg-white text-sm font-semibold outline-none focus:ring-2 ring-blue-500"
      >
        <option value="">Any</option>

        {options.map((opt: string) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
