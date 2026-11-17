
import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center py-20">
      <div className="relative flex items-center justify-center">
        {/* Outer Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#33434E] border-t-[#36B6A0]" />

        {/* Inner Dot */}
        <div className="absolute h-2 w-2 rounded-full bg-[#36B6A0]" />
      </div>
    </div>
  );
}
