# AIFinity 🧠

> **AI That Turns Struggles into Strengths**

**AIFinity** is an AI-powered **learning-gap and career-readiness platform** designed to help students understand *why* they make mistakes, identify their conceptual weaknesses, and build a personalized path toward their career goals.

Instead of simply showing students their scores or correct answers, AIFinity analyzes their performance, identifies learning gaps, and transforms mistakes into **personalized learning insights and actionable next steps**.

### Discover → Analyze → Improve → Prepare

---

## 🚀 Overview

Students often know **what they got wrong**, but not:

* Which concept they are missing
* Why they repeatedly make similar mistakes
* Which prerequisite concepts they need to strengthen
* What skills they are missing for their target career
* What they should learn next

AIFinity addresses this through three core AI-driven modules:

### 🧠 ConceptRoot AI

Analyzes incorrect answers to identify the **underlying conceptual weakness** rather than simply marking an answer as wrong.

It helps determine:

* The concept behind the mistake
* Possible root causes
* Missing prerequisite knowledge
* Recommended concepts to revise
* Targeted areas for further practice

### 📊 MistakeMap AI

Analyzes performance across multiple assessments and attempts to identify **recurring mistake patterns**.

It tracks patterns such as:

* Repeated conceptual mistakes
* Knowledge gaps
* Accuracy problems
* Performance trends
* Areas requiring additional practice

Rather than treating every wrong answer independently, MistakeMap builds a broader picture of the student's learning behavior.

### 🎯 SkillGap AI

Connects a student's current learning profile with their **target career or role**.

It can consider:

* Assessment performance
* Learning progress
* Skills
* Projects
* Resume information
* Target career goal

It then identifies relevant skill gaps and helps generate a **career-focused learning roadmap**.

---

## ✨ Core Features

### 🧠 ConceptRoot AI

* AI-powered root-cause analysis
* Concept-gap detection
* Prerequisite concept identification
* Personalized explanations
* Targeted learning recommendations
* Adaptive improvement guidance

### 📊 MistakeMap AI

* Assessment and attempt history
* Recurring mistake detection
* Performance trend analysis
* Identification of knowledge and accuracy gaps
* Personalized performance insights
* Progress visualization

### 🎯 SkillGap AI

* Career goal selection
* Current skill analysis
* Resume/project-based profile analysis
* Career skill-gap identification
* Personalized career-readiness roadmap
* Recommended areas for improvement

### 📝 Assessment System

Administrators can manage assessments through the admin dashboard, while students can attempt available assessments and receive performance insights based on their results.

### 👨‍💼 Admin Dashboard

The admin system provides management capabilities for:

* Assessments
* Questions
* Registered users
* Platform data

User information is retrieved from the application's database rather than relying on static mock users.

---

## 🔄 How AIFinity Works

```text
                    Student
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Assessments   Resume      Career Goal
          │            │            │
          └────────────┼────────────┘
                       ▼
                 AIFinity AI
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
 ConceptRoot       MistakeMap       SkillGap
       │               │               │
       ▼               ▼               ▼
 Concept Gaps     Mistake Patterns   Skill Gaps
       │               │               │
       └───────────────┼───────────────┘
                       ▼
             Personalized Roadmap
                       │
                       ▼
              Targeted Improvement
```

AIFinity focuses on one central question:

> **"Why am I making this mistake, and what should I learn next?"**

---

## 🏗️ System Architecture

```text
┌───────────────────────────────────────────────┐
│                   Student                     │
│        Assessments • Resume • Career Goal     │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                    AIFinity                    │
│                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ ConceptRoot│ │ MistakeMap │ │  SkillGap  │ │
│  │     AI     │ │     AI     │ │     AI     │ │
│  └────────────┘ └────────────┘ └────────────┘ │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
              Personalized Insights
                        │
                        ▼
              Learning / Career Roadmap
```

---

## 🛠️ Technology Stack

| Layer              | Technology           |
| ------------------ | -------------------- |
| Frontend           | React.js             |
| Styling            | Tailwind CSS         |
| Backend            | Node.js + Express.js |
| Authentication     | JWT                  |
| API                | REST API             |
| AI                 | Google Gemini API    |
| Database           | MongoDB Atlas        |
| Resume Parsing     | pdf-parse            |
| Data Visualization | Recharts             |
| Deployment         | Vercel + Render      |

---

## 📁 Project Structure

```text
AIFinity/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── README.md
└── .gitignore
```

---

## 🔐 Authentication & Data

AIFinity uses **JWT-based authentication** to provide secure access to user-specific functionality.

Application data, including users and assessments, is managed through **MongoDB Atlas**.

The platform is designed around real application data rather than relying on hard-coded mock users.

---

## 📊 Learning & Career Pipeline

```text
Assessment Attempts ────┐
                         │
Learning Progress ───────┤
                         │
Resume & Projects ───────┤
                         ├──► AIFinity AI
Career Goal ─────────────┤         │
                         │         ▼
Current Skills ──────────┘    Gap Analysis
                                   │
                                   ▼
                          Personalized Roadmap
```

AIFinity combines learning performance and career information to move beyond simple assessment scores and provide **actionable guidance**.

---

## 🎯 Expected Impact

AIFinity aims to help students:

* Understand the root cause of their mistakes
* Identify conceptual weaknesses
* Reduce repeated mistakes
* Track their learning progress
* Discover career-related skill gaps
* Prioritize what to learn next
* Follow a structured learning path
* Become better prepared for their target careers

---

## 🔮 Future Scope

The following capabilities can be expanded in future versions:

* 📄 Advanced resume analysis
* 👨‍🏫 Teacher/instructor dashboard
* 🎓 Expanded career-domain support
* 🎙️ Voice-based learning
* 📝 More adaptive assessment mechanisms
* 🤖 Deeper learning-behavior analytics
* 📚 Personalized resource recommendations

---

## 👥 Team

**AIFinity** is developed by:

* **Aman Negi**
* **Ishika Gaur**
* **Faiz Anwer**

---

## 📌 Project Vision

AIFinity is built around a simple idea:

> **Don't just measure what students know. Help them discover what they're missing.**

The goal is to transform student mistakes into **meaningful learning insights, targeted improvement, and better career readiness**.

---

## 📄 License

This project is developed as a team project for **educational and hackathon purposes**.

---

# AIFinity

### **From Mistakes to Meaningful Progress.** 🚀
