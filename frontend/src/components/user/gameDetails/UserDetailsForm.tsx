"use client";

import { RiArrowDownSLine } from "react-icons/ri";

export default function UserDetailsForm({ fields }: { fields: any[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-secondary mb-4">Enter Player Details</h3>

      <div className="grid grid-cols-1 gap-5">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-200">
              {field.label}
              {field.required && <span className="text-red-400"> *</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                placeholder={`Enter ${field.label}`}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_10px_rgba(255,120,0,0.4)] transition-all"
              />
            )}

            {field.type === "select" && (
              <div className="relative">
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl backdrop-blur-lg appearance-none focus:border-secondary focus:shadow-[0_0_10px_rgba(255,120,0,0.4)]">
                  <option className="text-black">Select {field.label}</option>
                  {field.options.map((opt: string) => (
                    <option key={opt} className="text-black">
                      {opt}
                    </option>
                  ))}
                </select>

                <RiArrowDownSLine className="absolute right-3 top-3 text-white/70 pointer-events-none" />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">Make sure details are correct. Wrong UID / Server may cause delivery delays.</p>
    </div>
  );
}
