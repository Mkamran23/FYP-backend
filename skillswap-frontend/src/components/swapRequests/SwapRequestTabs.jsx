const tabs = [
  "All Requests",
  "Pending",
  "Accepted",
  "Rejected",
  "Completed",
];

export default function SwapRequestTabs({
  activeTab,
  onChange,
}) {
  return (
    <div
      className="
        flex
        w-full
        overflow-x-auto
        border-b
        border-slate-200
        bg-white
        scrollbar-hide
      "
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            relative
            shrink-0
            px-3
            py-3
            text-[9px]
            font-medium
            transition
            sm:px-4
            sm:text-[10px]
            ${
              activeTab === tab
                ? "font-semibold text-blue-600"
                : "text-slate-500 hover:text-blue-600"
            }
          `}
        >
          {tab}

          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
}