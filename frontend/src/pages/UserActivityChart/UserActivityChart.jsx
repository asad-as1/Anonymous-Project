import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import Cookies from "cookies-js";
import "./UserActivityChart.css";

const pageMapping = {
  "/": "Home",
  "/takeatest": "Take A Test",
  "/schedule": "Schedule",
  "/studynotes": "Study Notes",
  "/textreader": "Text Reader",
  "/mynotes": "MyNotes",
  "/summarization": "Summarization",
  "/queandans": "Ques & Ans",
  "/myactivity": "My Activity",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const UserActivityChart = ({ userId }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [activityData, setActivityData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const token = Cookies.get("user");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/activity/${userId}?timestamp=${Date.now()}`,
          { token }
        );

        const data = response.data;
        if (!data.length) {
          setError("No activity data found for this period.");
          return;
        }

        const sortedData = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setOffset(Math.max(0, sortedData.length - 7));
        setActivityData(sortedData);
      } catch (error) {
        setError("Failed to load activity data. Please try again later.");
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  useEffect(() => {
    if (activityData.length === 0) return;

    const slicedData = activityData.slice(offset, offset + 7);
    const labels = slicedData.map((entry) => formatDate(entry.date));
    const minutes = slicedData.map((entry) =>
      Math.max(Number((entry.totalActiveTime / 60).toFixed(2)), 1)
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Minutes Active",
          data: minutes,
          backgroundColor: "rgba(75,192,192,0.6)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,192,192,0.8)",
          hoverBorderColor: "rgba(75,192,192,1)",
        },
      ],
    });
    setSelectedActivity(null);
  }, [activityData, offset]);

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedDate = chartData.labels[index];
      const selectedData = activityData.find(
        (entry) => formatDate(entry.date) === selectedDate
      );
      setSelectedActivity(selectedData);
    }
  };

  const pieChartData = useMemo(() => {
    if (!selectedActivity || !selectedActivity.pagesVisited) return null;

    const pageCount = {};
    selectedActivity.pagesVisited.forEach((page) => {
      const mappedPage = pageMapping[page] || "Unknown";
      pageCount[mappedPage] = (pageCount[mappedPage] || 0) + 1;
    });

    return {
      labels: Object.keys(pageCount).map((label) => `${label} (Page Visit)`),
      datasets: [
        {
          label: "Page Visit",
          data: Object.values(pageCount),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffcd56",
            "#4bc0c0",
            "#9966ff",
            "#ff9f40",
            "#c9cbcf",
            "#ff7f50",
            "#b3e5fc",
          ],
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    };
  }, [selectedActivity]);

  if (loading) {
    return <div className="loading-container">Loading activity data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="chart-section">
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Daily Activity (Minutes)</h2>
            <div className="date-info">
              {chartData.labels.length > 0 && (
                <span>
                  Showing: {chartData.labels[0]} -{" "}
                  {chartData.labels[chartData.labels.length - 1]}
                </span>
              )}
            </div>
          </div>

          <div className="bar-chart-wrapper">
            <div className="bar-chart-container">
              <Bar
                data={chartData}
                options={{
                  onClick: handleBarClick,
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Minutes",
                        font: {
                          size: 14,
                          weight: 500,
                        },
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                        font: {
                          size: 14,
                          weight: 500,
                        },
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      padding: 12,
                      titleFont: { size: 14 },
                      bodyFont: { size: 13 },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="navigation-container">
            <div className="navigation-buttons">
              <button
                className={`nav-button ${offset === 0 ? "disabled" : ""}`}
                onClick={() => setOffset((prev) => Math.max(0, prev - 7))}
                disabled={offset === 0}
              >
                ← Previous Week
              </button>
              <button
                className={`nav-button ${
                  offset + 7 >= activityData.length ? "disabled" : ""
                }`}
                onClick={() =>
                  setOffset((prev) =>
                    prev + 7 < activityData.length ? prev + 7 : prev
                  )
                }
                disabled={offset + 7 >= activityData.length}
              >
                Next Week →
              </button>
            </div>
          </div>
        </div>

        {selectedActivity && pieChartData && (
          <div className="chart-card activity-detail">
            <div className="chart-header">
              <h2 className="chart-title">
                Page Visits on {formatDate(selectedActivity.date)}
              </h2>
              <button
                className="close-button"
                onClick={() => setSelectedActivity(null)}
              >
                ×
              </button>
            </div>
            <div className="pie-chart-container">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        padding: 15,
                        font: { size: 13 },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.raw} Time${
                            context.raw > 1 ? "s" : ""
                          }`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityChart;
