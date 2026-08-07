// import Container from '../components/Container';
// import Section from '../components/Section';

// export default function Contact() {
//   return (
//     <Section>
//       <Container>
//         <div className="text-center py-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
//           <p className="text-xl text-gray-600">Coming Soon</p>
//         </div>
//       </Container>
//     </Section>
//   );
// }


import { useState } from "react";
import Container from "../components/Container";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-slate-50">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <Container>
          <div className="relative py-20 text-center sm:py-24 lg:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              WE'D LOVE TO HEAR FROM YOU
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let's build a better
              <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                learning journey.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Have a question, feedback, feature idea, or want to collaborate
              with Cognify AI? Our team would love to hear from you.
            </p>
          </div>
        </Container>
      </section>

      {/* =========================================================
          CONTACT CONTENT
      ========================================================= */}
      <Section background="white">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* LEFT SIDE */}
          <div>
            <div className="mb-4 text-sm font-semibold tracking-widest text-indigo-600">
              GET IN TOUCH
            </div>

            <h2 className="max-w-lg text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              We're here to help you make sense of your learning journey.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Whether you're exploring your career path, trying to understand
              your skill gaps, or simply have an idea for Cognify AI, reach
              out to us.
            </p>

            {/* Contact information */}
            <div className="mt-8 space-y-4">
              <Card
                hoverable
                icon={
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                    @
                  </div>
                }
                title="Email us"
                className="p-5"
              >
                <a
                  href="mailto:hello@cognifyai.com"
                  className="font-medium text-indigo-600 transition-colors hover:text-violet-600"
                >
                  hello@cognifyai.com
                </a>
              </Card>

              <Card
                hoverable
                icon={
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-xl text-cyan-600">
                    AI
                  </div>
                }
                title="Cognify AI Support"
                className="p-5"
              >
                <p>
                  Have a problem with an assessment, skill analysis, or
                  personalized roadmap? Tell us what happened.
                </p>
              </Card>

              <Card
                hoverable
                icon={
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-600">
                    ↗
                  </div>
                }
                title="Response time"
                className="p-5"
              >
                <p>
                  We usually respond within{" "}
                  <strong className="text-slate-900">24 hours</strong>.
                </p>
              </Card>
            </div>

            {/* Social */}
            <div className="mt-10">
              <p className="mb-4 text-xs font-bold tracking-widest text-slate-500">
                FOLLOW COGNIFY AI
              </p>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
                  aria-label="GitHub"
                >
                  GH
                </a>

                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
                  aria-label="LinkedIn"
                >
                  in
                </a>

                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
                  aria-label="Instagram"
                >
                  IG
                </a>
              </div>
            </div>
          </div>

          {/* =====================================================
              CONTACT FORM
          ===================================================== */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-cyan-500/20 blur-xl" />

            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="mb-8">
                <div className="mb-2 text-sm font-semibold text-indigo-600">
                  SEND A MESSAGE
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  How can we help?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill out the form and our team will get back to you.
                </p>
              </div>

              {/* Success message */}
              {submitted && (
                <div className="mb-6 flex gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-white">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Message sent successfully!
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Thanks for reaching out. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="What would you like to talk about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full border-indigo-600 bg-indigo-600 hover:border-indigo-700 hover:bg-indigo-700"
                  icon={<span>→</span>}
                  iconPosition="right"
                >
                  Send Message
                </Button>

                <p className="text-center text-xs text-slate-400">
                  Your information is only used to respond to your message.
                </p>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* =========================================================
          QUICK HELP
      ========================================================= */}
      <Section background="tint">
        <SectionHeading
          title="Looking for something specific?"
          subtitle="Here are some of the things you can talk to us about."
        />

        <div className="grid gap-5 md:grid-cols-3">
          <Card
            hoverable
            eyebrow="01"
            title="Technical issue"
            footer={
              <span className="text-sm font-medium text-indigo-600">
                Tell us what went wrong →
              </span>
            }
          >
            Having trouble with an assessment, dashboard, skill analysis, or
            another part of Cognify AI?
          </Card>

          <Card
            hoverable
            eyebrow="02"
            title="Feature idea"
            footer={
              <span className="text-sm font-medium text-violet-600">
                Share your idea →
              </span>
            }
          >
            Have an idea that could make personalized learning more useful,
            intelligent, or accessible?
          </Card>

          <Card
            hoverable
            eyebrow="03"
            title="Collaboration"
            footer={
              <span className="text-sm font-medium text-cyan-600">
                Let's connect →
              </span>
            }
          >
            Interested in collaborating with Cognify AI on education,
            technology, research, or student innovation?
          </Card>
        </div>
      </Section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-slate-950">
        <Container>
          <div className="relative overflow-hidden py-16 text-center sm:py-20">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative">
              <div className="mb-4 text-sm font-semibold tracking-widest text-cyan-400">
                COGNIFY AI
              </div>

              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Learning is not about knowing everything.
                <span className="block text-slate-400">
                  It's about knowing what to learn next.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Help us make that journey smarter, clearer, and more
                personalized.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}