import AuthHero from "./AuthHero";
import SecurityPanel from "../common/SecurityPanel";
import Footer from "../layout/Footer";

export default function AuthLayout({ children }) {
  return (
    <main className="relative  overflow-x-hidden bg-[#f7faff]">
      <div className="flex min-h-screen">
        {/* LEFT HERO */}
        <div className="hidden lg:flex lg:flex-1">
          <AuthHero />
        </div>

        {/* RIGHT AUTH AREA */}
        <section
          className="
            flex
            min-h-screen
            min-w-0
            w-full
            items-center
            justify-center
            bg-[#fbfdff]
            px-3
            py-8
            sm:px-6
            lg:w-[46%]
            lg:px-8
            lg:py-10
            xl:px-10
          "
        >
          <div
            className="
              flex
              min-w-0
              w-full
              max-w-[460px]
              items-center
              gap-8
              xl:max-w-[700px]
            "
          >
            {/* AUTH CARD */}
            <div
              className="
                min-w-0
                w-full
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-5
                shadow-[0_12px_40px_rgba(15,23,42,0.08)]
                sm:px-7
                sm:py-7
                md:px-8
                lg:px-8
                xl:max-w-[460px]
              "
            >
              {children}
            </div>

            {/* SECURITY PANEL */}
            <div className="hidden xl:block">
              <SecurityPanel />
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
