import {
  Crosshair,
  Search,
  MapPin,
} from "lucide-react";

export default function MatchFinder() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">

      <h2 className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
        <Crosshair size={14} className="text-blue-600" />
        Find Your Perfect Match
      </h2>

      <p className="mt-2 text-[8px] font-semibold text-slate-600">
        I want to learn:
      </p>

      <select className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[9px] text-slate-600 outline-none focus:border-blue-500">
        <option>Graphic Design</option>
        <option>Web Development</option>
        <option>Python Programming</option>
        <option>UI/UX Design</option>
      </select>

      <p className="mt-3 text-[8px] font-semibold text-slate-600">
        Show me users who teach:
      </p>

      <select className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[8px] text-slate-600 outline-none focus:border-blue-500">
        <option>Graphic Design</option>
        <option>Web Development</option>
        <option>Cooking</option>
      </select>

      <p className="mt-3 text-[8px] font-semibold text-slate-600">
        In my area:
      </p>

      <div className="relative mt-1">

        <MapPin
          size={11}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select className="h-8 w-full rounded-md border border-slate-200 bg-white pl-6 pr-2 text-[8px] text-slate-600 outline-none focus:border-blue-500">
          <option>All Pakistan</option>
          <option>Lahore</option>
          <option>Karachi</option>
          <option>Islamabad</option>
        </select>

      </div>

      <button className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 text-[9px] font-semibold text-white hover:bg-blue-700">
        <Search size={12} />
        Find Matches
      </button>

    </div>
  );
}