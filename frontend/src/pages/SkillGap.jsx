// import Container from '../components/Container';
// import Section from '../components/Section';

// export default function SkillGap() {
//   return (
//     <Section>
//       <Container>
//         <div className="text-center py-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Skill Gap</h1>
//           <p className="text-xl text-gray-600">Coming Soon</p>
//         </div>
//       </Container>
//     </Section>
//   );
// }



import { useState } from "react";

const skillData = [
  {
    name: "JavaScript",
    level: 85,
    status: "Strong",
  },
  {
    name: "React.js",
    level: 72,
    status: "Good",
  },
  {
    name: "Node.js",
    level: 65,
    status: "Good",
  },
  {
    name: "MongoDB",
    level: 70,
    status: "Good",
  },
  {
    name: "System Design",
    level: 38,
    status: "Needs Work",
  },
  {
    name: "Docker",
    level: 25,
    status: "Needs Work",
  },
];

const roadmap = [
  {
    number: "01",
    title: "Master Advanced React",
    duration: "2–3 weeks",
    description:
      "Strengthen your React fundamentals and learn advanced concepts used in production applications.",
    topics: ["React Hooks", "State Management", "Performance"],
  },
  {
    number: "02",
    title: "Backend Architecture",
    duration: "3–4 weeks",
    description:
      "Improve your understanding of scalable backend systems and API architecture.",
    topics: ["REST APIs", "Authentication", "API Security"],
  },
  {
    number: "03",
    title: "System Design",
    duration: "3–4 weeks",
    description:
      "Learn how to design reliable and scalable software systems.",
    topics: ["Architecture", "Database Design", "Scalability"],
  },
  {
    number: "04",
    title: "DevOps Fundamentals",
    duration: "2 weeks",
    description:
      "Understand the tools used to build, deploy and maintain modern applications.",
    topics: ["Docker", "CI/CD", "Cloud Basics"],
  },
];

function SkillGap() {
  const [career, setCareer] = useState("Full Stack Developer");
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzed(true);

    setTimeout(() => {
      document
        .getElementById("skill-analysis")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="skillgap-page">
      {/* HERO SECTION */}
      <section className="skillgap-hero">
        <div className="skillgap-hero-content">
          <div className="skillgap-badge">
            <span>✦</span> AI-Powered Career Intelligence
          </div>

          <h1>
            Discover the skills
            <br />
            <span>you need to grow.</span>
          </h1>

          <p>
            Cognify AI analyzes your current abilities, identifies your skill
            gaps, and creates a personalized learning path for your dream
            career.
          </p>

          <div className="skillgap-hero-stats">
            <div>
              <strong>01</strong>
              <span>Analyze</span>
            </div>

            <div className="stat-arrow">→</div>

            <div>
              <strong>02</strong>
              <span>Identify</span>
            </div>

            <div className="stat-arrow">→</div>

            <div>
              <strong>03</strong>
              <span>Improve</span>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER INPUT SECTION */}
      <section className="skillgap-input-section">
        <div className="skillgap-container">
          <div className="skillgap-section-heading">
            <span>STEP 01</span>
            <h2>Tell us where you want to go.</h2>
            <p>
              Select your target career and let Cognify understand what skills
              you need.
            </p>
          </div>

          <div className="career-card">
            <div className="career-card-icon">🎯</div>

            <div className="career-card-content">
              <label htmlFor="career">Target Career</label>

              <select
                id="career"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
              >
                <option>Full Stack Developer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Data Scientist</option>
                <option>Machine Learning Engineer</option>
                <option>AI / Generative AI Engineer</option>
                <option>Cybersecurity Engineer</option>
              </select>
            </div>

            <button className="analyze-button" onClick={handleAnalyze}>
              Analyze My Skill Gap
              <span>→</span>
            </button>
          </div>

          {/* CURRENT SKILLS */}
          <div className="current-skills-box">
            <div>
              <span className="small-label">YOUR CURRENT SKILLS</span>
              <h3>What you already know</h3>
            </div>

            <div className="skills-list">
              <span>JavaScript</span>
              <span>React.js</span>
              <span>Node.js</span>
              <span>MongoDB</span>
              <span>Git & GitHub</span>
              <span>HTML / CSS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYSIS SECTION */}
      <section
        id="skill-analysis"
        className={`skill-analysis-section ${
          analyzed ? "analysis-active" : ""
        }`}
      >
        <div className="skillgap-container">
          <div className="skillgap-section-heading centered">
            <span>STEP 02</span>
            <h2>Your Skill Analysis</h2>
            <p>
              Based on your selected career path:
              <strong> {career}</strong>
            </p>
          </div>

          {/* OVERALL SCORE */}
          <div className="readiness-card">
            <div className="readiness-left">
              <div className="score-circle">
                <div>
                  <strong>72</strong>
                  <span>%</span>
                </div>
              </div>

              <div>
                <span className="small-label">CAREER READINESS</span>
                <h3>You're on the right track!</h3>
                <p>
                  You have a strong foundation, but a few important skills
                  need improvement.
                </p>
              </div>
            </div>

            <div className="readiness-right">
              <div className="mini-progress">
                <div className="progress-heading">
                  <span>Technical Skills</span>
                  <strong>82%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>

              <div className="mini-progress">
                <div className="progress-heading">
                  <span>Problem Solving</span>
                  <strong>65%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div className="mini-progress">
                <div className="progress-heading">
                  <span>System Design</span>
                  <strong>40%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILL CARDS */}
          <div className="skill-grid">
            {skillData.map((skill) => (
              <div className="skill-card" key={skill.name}>
                <div className="skill-card-top">
                  <div className="skill-icon">
                    {skill.name === "System Design"
                      ? "◈"
                      : skill.name === "Docker"
                      ? "◉"
                      : "◆"}
                  </div>

                  <span
                    className={`skill-status ${
                      skill.status === "Needs Work"
                        ? "needs-work"
                        : skill.status === "Strong"
                        ? "strong"
                        : ""
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>

                <h3>{skill.name}</h3>

                <div className="skill-level">
                  <div className="skill-level-heading">
                    <span>Proficiency</span>
                    <strong>{skill.level}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILL GAP SECTION */}
      <section className="gaps-section">
        <div className="skillgap-container">
          <div className="skillgap-section-heading">
            <span>STEP 03</span>
            <h2>Where should you focus?</h2>
            <p>
              Cognify has identified the areas that will have the biggest
              impact on your career growth.
            </p>
          </div>

          <div className="gap-grid">
            <div className="gap-card critical">
              <div className="gap-icon">!</div>

              <div>
                <span className="gap-label">HIGH PRIORITY</span>
                <h3>System Design</h3>
                <p>
                  Your current understanding is below the expected level for
                  your target role.
                </p>

                <div className="gap-action">
                  <span>Start learning</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            <div className="gap-card warning">
              <div className="gap-icon">△</div>

              <div>
                <span className="gap-label">MEDIUM PRIORITY</span>
                <h3>Advanced React</h3>
                <p>
                  You have the fundamentals. Now strengthen advanced concepts
                  used in real-world applications.
                </p>

                <div className="gap-action">
                  <span>Improve skill</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            <div className="gap-card warning">
              <div className="gap-icon">△</div>

              <div>
                <span className="gap-label">MEDIUM PRIORITY</span>
                <h3>Docker & DevOps</h3>
                <p>
                  Learn how applications are containerized and deployed in
                  modern development environments.
                </p>

                <div className="gap-action">
                  <span>Learn basics</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section className="roadmap-section">
        <div className="skillgap-container">
          <div className="skillgap-section-heading centered">
            <span>STEP 04</span>
            <h2>Your Personalized Roadmap</h2>
            <p>
              A clear path from where you are today to where you want to be.
            </p>
          </div>

          <div className="roadmap-list">
            {roadmap.map((item) => (
              <div className="roadmap-item" key={item.number}>
                <div className="roadmap-number">{item.number}</div>

                <div className="roadmap-content">
                  <div className="roadmap-title-row">
                    <h3>{item.title}</h3>
                    <span>{item.duration}</span>
                  </div>

                  <p>{item.description}</p>

                  <div className="roadmap-topics">
                    {item.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>
                </div>

                <button className="roadmap-arrow">→</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="skillgap-cta">
        <div>
          <span>YOUR NEXT STEP</span>
          <h2>Don't just know your gap.</h2>
          <h3>Close it.</h3>

          <p>
            Turn your skill gaps into a personalized learning journey with
            Cognify AI.
          </p>

          <button
            className="cta-button"
            onClick={() =>
              document
                .getElementById("skill-analysis")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Your Journey
            <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default SkillGap;