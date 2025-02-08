import React, { useEffect, useState } from 'react';
import { Book, Calendar, Share2, FileText } from 'lucide-react';
import './Home.css';
import img1 from "../../img/img1.jpg"
import img2 from "../../img/img2.jpg"
import {Link} from "react-router-dom"
import Cookies from 'cookies-js';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const user = Cookies.get("user")
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
          {/* <button className="cta-button"> */}
            {(!user && 
            <Link className='cta-button' to="/signup">Get Started</Link>)}
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
                <div className="feature-icons">{feature.icon}</div>
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
              <h3>Smart Document Reader: Hear What You Can’t See</h3>
              <p>
              Upload any document, and let our intelligent text-to-speech system read it aloud for you. Powered by advanced OCR (Optical Character Recognition) technology, this feature is designed to make reading accessible to everyone. From books to manuals, no content is out of reach.
              </p>
              {/* <h3>Empowering Lives Through Technology</h3> */}
              <p>
              For individuals who face challenges in vision or communication, technology can be a powerful ally. Our platform bridges the gap by providing accessible tools that cater to these needs, ensuring everyone can connect, learn, and thrive.
              </p>
              {/* <h3>Seamless Accessibility, Anytime</h3> */}
              <p>The platform adapts to your unique requirements, ensuring that every interaction is smooth and intuitive. Whether it's magnifying text or voice-controlled navigation, accessibility is at the heart of our design.</p>
            </div>
          </div>

          <div className="two-divs reverse">
            <div className="left">
              <img src={img2} alt="Study Materials" className="image-left" />
            </div>
            <div className="right">
              <h3>Importance of Knowledge</h3>
              <p>
              Studying is essential for personal growth, intellectual development, and achieving life goals. It enables individuals to acquire knowledge, sharpen skills, and build a deeper understanding of the world around them. Beyond academic success, studying fosters critical thinking, problem-solving, and decision-making abilities, which are vital in everyday life. It encourages curiosity and opens doors to new opportunities, empowering individuals to overcome challenges and adapt to change.
              </p>
              <p>For people with visual or communication difficulties, access to study materials and learning tools can be transformative. Education provides a sense of independence, boosts self-confidence, and enhances the ability to engage meaningfully with society. It serves as a foundation for career advancement, social inclusion, and personal fulfillment. By making studying accessible to everyone, we ensure that no one is left behind, creating a more equitable and inclusive world where everyone has the chance to reach their potential.
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
            <div className="db">
              {
                (!user && 
                <Link to="/signup" className="demo-button">Sign Up Now</Link>
              )}
            </div>
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
