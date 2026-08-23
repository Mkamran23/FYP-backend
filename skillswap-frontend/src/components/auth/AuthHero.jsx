export default function AuthHero() {
  return (
    <section
      className="
        relative
        hidden
        min-h-screen
        flex-1
        overflow-hidden
        bg-gradient-to-br
        from-[#edf5ff]
        via-white
        to-[#e7fbf4]
        px-8
        py-7
        lg:flex
        lg:px-10
        xl:px-14
        2xl:px-20
      "
    >

      {/* Decorative circles */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100/50" />

      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-100/60" />

      <div className="relative z-10 flex w-full flex-col">

        {/* Logo */}

        <div className="shrink-0">
          {/* Keep your existing BrandLogo here */}
        </div>

        {/* Hero content */}

        <div
          className="
            mt-12
            flex
            flex-1
            flex-col
            justify-center
            pb-16
            lg:mt-6
            xl:mt-0
          "
        >

          <h1
            className="
              max-w-[440px]
              text-4xl
              font-extrabold
              leading-[1.05]
              text-blue-600
              lg:text-4xl
              xl:text-5xl
            "
          >
            Learn.
            <br />

            <span className="text-emerald-600">
              Teach.
            </span>

            <br />

            Grow Together.
          </h1>

          <p
            className="
              mt-4
              max-w-[380px]
              text-sm
              leading-5
              text-slate-600
              xl:text-[13px]
            "
          >
            Join Pakistan's largest peer-to-peer
            <br />
            skill exchange community.
          </p>

          {/* Keep your existing illustration / skill icons here */}

        </div>

      </div>

    </section>
  );
}