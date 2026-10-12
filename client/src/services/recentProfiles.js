const storageKey = (viewerId) => `skillswap_recent_profiles_${viewerId}`;
export const recentProfiles = {
  get: (viewerId) => {
    if (!viewerId) return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey(viewerId)) || "[]");
    } catch {
      return [];
    }
  },
  add: (viewerId, member) => {
    if (!viewerId || !member?.id || String(viewerId) === String(member.id))
      return;
    const existing = recentProfiles
      .get(viewerId)
      .filter((item) => item.id !== member.id);
    localStorage.setItem(
      storageKey(viewerId),
      JSON.stringify(
        [
          {
            id: member.id,
            name: member.name,
            location: member.location || "",
            avatarUrl: member.avatarUrl || "",
            viewedAt: new Date().toISOString(),
          },
          ...existing,
        ].slice(0, 6),
      ),
    );
  },
};
