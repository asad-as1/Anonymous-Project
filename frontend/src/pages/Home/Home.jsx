import React, { useEffect, useState } from 'react';
import { Book, Calendar, Share2, FileText } from 'lucide-react';
import './Home.css';
import img1 from "../../img/img1.jpg"
import img2 from "../../img/img1.jpg"

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <FileText />,
      title: "Smart Document Reader",
      description: "Advanced OCR technology with natural text-to-speech for visually impaired users. Upload any document and let our system read it aloud."
    },
    {
      icon: <Book />,
      title: "Study Materials Hub",
      description: "Access and upload comprehensive educational resources. Organized by subjects for easy navigation and learning."
    },
    {
      icon: <Calendar />,
      title: "AI-Powered Scheduler",
      description: "Create personalized study schedules that adapt to your learning patterns and goals automatically."
    },
    {
      icon: <Share2 />,
      title: "Collaborative Notes",
      description: "Share and collaborate on notes in real-time. Build a knowledge base with your peers."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        {/* <Header /> Use Header component */}

        <div className="hero-content">
          <h1 className="hero-title">
            Learning Without
            <span className="gradient-text"> Boundaries</span>
          </h1>
          <p className="hero-subtitle">
            Experience education reimagined through innovative technology and accessibility
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Our Features</h2>

        <div className="features-carousel">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="carousel-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Two Divs Layout Section */}
      <section className="image-section">
        <div className="two-divs-container">
          <div className="two-divs">
            <div className="left">
              <img src= {img1} alt="Document Reader" className="image-left" />
            </div>
            <div className="right">
              <h3>Smart Document Reader</h3>
              <p>
                Upload documents and let our system read it aloud for visually impaired users, powered by OCR technology.
              </p>
            </div>
          </div>

          <div className="two-divs reverse">
            <div className="left">
              <img src={img2} alt="Study Materials" className="image-left" />
            </div>
            <div className="right">
              <h3>Study Materials Hub</h3>
              <p>
                Access a repository of comprehensive study materials, organized for easy navigation and learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="demo-section">
        <div className="demo-content">
          <div className="demo-text">
            <h2 className="section-title">See It In Action</h2>
            <p className="demo-description">
              Watch how our platform transforms the way you learn, collaborate, and grow.
              Experience seamless accessibility features and intuitive interface.
            </p>
            <button className="demo-button">Try Demo</button>
          </div>
          <div className="demo-preview">
            <div className="preview-window">
              <div className="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="preview-content">
                <div className="preview-animation"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
