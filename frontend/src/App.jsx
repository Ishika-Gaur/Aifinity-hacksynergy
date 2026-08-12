import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import AssessmentPage from "./pages/AssessmentPage";
import AssessmentAttemptPage from "./pages/AssessmentAttemptPage";
import Dashboard from './pages/Dashboard';
import ConceptRoot from './pages/ConceptRoot';
import MistakeMap from './pages/MistakeMap';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import OnboardingPage from './pages/OnboardingPage';
import ForgotPassword from './pages/ForgotPassword';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen ">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment/:id" element={<AssessmentAttemptPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/concept-root" element={<ConceptRoot />} />
            <Route path="/conceptroot" element={<ConceptRoot />} />
            <Route path="/mistake-map" element={<MistakeMap />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/onboardingpage'element={<OnboardingPage/>}/>
            <Route path="/forgot-password"element={<ForgotPassword/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
