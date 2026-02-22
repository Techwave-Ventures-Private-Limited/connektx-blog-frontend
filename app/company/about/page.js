import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Who We Are",
  description:
    "Meet the founders behind Connektx and learn about the mission driving the platform.",
};

export default function WhoAreWe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Header />

      <main className="bg-white text-slate-800">

        {/* STORY */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* LEFT: TEXT */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-10">
                  Who We Are
                </h1>

                <div className="space-y-6 text-medium text-slate-600 leading-relaxed">
                  <p>
                    We’re a team of builders who felt the gap between ambition and access.
                  </p>

                  <p>
                    Existing professional platforms became too corporate, too noisy,
                    and too transactional. Networking turned into cold messages.
                    Hiring turned into endless scrolling. Discovery lost its intent.
                  </p>

                  <p>
                    We believed there had to be a better way — one where connections
                    are driven by interest, skills, and aligned goals instead of titles
                    and vanity metrics.
                  </p>

                  <p className="text-slate-900 font-medium">
                    Connektx isn’t another social platform.
                    It’s an ecosystem for serious builders.
                  </p>
                </div>
              </div>

              {/* RIGHT: IMAGE */}
              <div className="relative">
                <img
                  src="/images/story-image.jpg"
                  alt="Builders collaborating"
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>

            </div>
          </div>
        </section>

        {/* WHY WE ARE BUILDING */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* LEFT: IMAGE */}
              <div>
                <img
                  src="/images/why-image.jpg"
                  alt="Founders discussing product strategy"
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>

              {/* RIGHT: TEXT */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-10">
                  Why We're Building Connektx
                </h2>

                <div className="space-y-6 text-medium text-slate-600 leading-relaxed">
                  <p>
                    We experienced how fragmented professional growth can feel.
                    Opportunities are scattered. Discovery is accidental.
                    Meaningful collaboration is rare.
                  </p>

                  <p>
                    Most platforms optimize for visibility and volume.
                    We believe networking should optimize for alignment.
                  </p>

                  <p>
                    The next generation of builders doesn't need another feed.
                    They need a focused ecosystem where skills surface opportunities,
                    interests create connections, and intent drives outcomes.
                  </p>

                  <p className="text-slate-900 font-medium">
                    We're building Connektx to make professional discovery deliberate —
                    not random.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FOUNDERS */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Meet the Founders
            </h2>

            <div className="grid md:grid-cols-3 gap-10">

              {/* Vishal */}
              <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <img
                    src="/images/vishal.jpeg"
                    alt="Vishal"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Vishal Auti
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Co-Founder, CEO
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Focused on product vision and scalable systems, Vishal drives
                  the long-term direction of Connektx.
                </p>
                <a
                  href="https://www.linkedin.com/in/vishal-auti-b1a4922b7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 transition"
                >
                  LinkedIn →
                </a>
              </div>

              {/* Akash */}
              <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <img
                    src="/images/akash.jpeg"
                    alt="Akash"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Akash Jare
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Co-Founder, COO
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Passionate about community and growth, Akash focuses on
                  enabling collaboration and expanding the ecosystem.
                </p>
                <a
                  href="https://www.linkedin.com/in/akash-jare-609ab3230/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 transition"
                >
                  LinkedIn →
                </a>
              </div>

              {/* Shubham */}
              <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <img
                    src="/images/shubham.jpeg"
                    alt="Shubham"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Shubham Bagul
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Co-Founder, CTO
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Focused on building impactful digital experiences, Shubham
                  ensures Connektx remains intuitive and powerful.
                </p>
                <a
                  href="https://www.linkedin.com/in/shubham-bagul-700528241/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 transition"
                >
                  LinkedIn →
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}