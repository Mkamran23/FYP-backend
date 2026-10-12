export default function Footer() {
  return (
    <footer
      className="
        absolute
        bottom-3
        left-1/2
        z-50
        flex
        -translate-x-1/2
        items-center
        justify-center
        gap-4
        whitespace-nowrap
        text-[9px]
        text-slate-500
      "
    >
      <button className="hover:text-slate-700">Privacy Policy</button>

      <span>|</span>

      <button className="hover:text-slate-700">Terms of Service</button>

      <span>|</span>

      <span>© 2026 SkillSwap. All rights reserved.</span>
    </footer>
  );
}
