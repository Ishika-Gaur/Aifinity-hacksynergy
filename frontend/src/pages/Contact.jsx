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

function Contact() {
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
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-container">
          <span className="contact-badge">✦ WE'D LOVE TO HEAR FROM YOU</span>

          <h1>
            Let's start a
            <br />
            <span>conversation.</span>
          </h1>

          <p>
            Have a question, suggestion, or just want to say hello?
            <br />
            Our team is always happy to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-main">
        <div className="contact-container contact-grid">
          {/* LEFT */}
          <div className="contact-info">
            <span className="small-label">GET IN TOUCH</span>

            <h2>We're here to help.</h2>

            <p>
              Whether you're a student exploring your career path or someone
              building the next big thing, we'd love to hear what you think
              about Cognify AI.
            </p>

            <div className="contact-info-card">
              <div className="contact-info-icon">✉</div>

              <div>
                <span>Email us</span>
                <a href="mailto:hello@cognifyai.com">
                  hello@cognifyai.com
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">◉</div>

              <div>
                <span>Response time</span>
                <strong>Usually within 24 hours</strong>
              </div>
            </div>

            <div className="contact-social">
              <span>FOLLOW COGNIFY</span>

              <div className="social-links">
                <a href="#" aria-label="GitHub">
                  GH
                </a>

                <a href="#" aria-label="LinkedIn">
                  in
                </a>

                <a href="#" aria-label="Instagram">
                  IG
                </a>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="contact-form-wrapper">
            {submitted && (
              <div className="success-message">
                <div>✓</div>

                <div>
                  <strong>Message sent successfully!</strong>
                  <p>
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="What would you like to talk about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit">
                Send Message
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ STYLE SECTION */}
      <section className="contact-bottom">
        <div className="contact-container">
          <div className="contact-bottom-heading">
            <span>BEFORE YOU WRITE</span>
            <h2>Looking for something specific?</h2>
          </div>

          <div className="contact-quick-grid">
            <div className="contact-quick-card">
              <span>01</span>
              <h3>Having technical issues?</h3>
              <p>
                Tell us what went wrong and include the steps that caused the
                issue.
              </p>
            </div>

            <div className="contact-quick-card">
              <span>02</span>
              <h3>Have a feature idea?</h3>
              <p>
                We are always looking for ways to make Cognify more useful for
                students.
              </p>
            </div>

            <div className="contact-quick-card">
              <span>03</span>
              <h3>Want to collaborate?</h3>
              <p>
                Tell us about your idea, project, or organization and let's
                explore possibilities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;