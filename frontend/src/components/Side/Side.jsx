import React from "react";
import { FaRocket, FaLock, FaUsers, FaChartLine } from "react-icons/fa";
import "./Side.css";

const Side = () => {
  return (
    <div className="side-container">
      <div className="side-content">
        <h1 className="side-title">Welcome to My BlogBuddy website</h1>
        <p className="side-description">
          Discover a world of opportunities, connection, and growth.
        </p>
        <div className="side-features">
          <div className="feature-item">
            <FaRocket className="feature-icon yellow" />
            <div>
              <h3 className="feature-title">Accelerate Your Journey</h3>
              <p className="feature-description">
                Unlock your potential with cutting-edge tools and resources.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <FaLock className="feature-icon green" />
            <div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your data is protected with state-of-the-art security measures.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <FaUsers className="feature-icon red" />
            <div>
              <h3 className="feature-title">Community Driven</h3>
              <p className="feature-description">
                Connect, collaborate, and grow with like-minded individuals.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <FaChartLine className="feature-icon pink" />
            <div>
              <h3 className="feature-title">Track Your Progress</h3>
              <p className="feature-description">
                Visualize your growth and achievements in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Side;