import React, { useEffect, useRef } from 'react';
import { compile, templates } from 'core/js/reactHelpers';
import Chart from '../libraries/chart.js'; // Import Chart.js

const RadarChart = ({ data, width, height }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Store the chart instance

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy the existing chart instance, if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartData = {
      labels: data.map(item => item.axis),
      datasets: [
        {
          label: 'Radar Chart',
          data: data.map(item => item.value),
          backgroundColor: 'rgba(0, 0, 255, 0.5)' // Fill color for the radar area
        }
      ]
    };

    const config = {
      type: 'radar',
      data: chartData,
      options: {
        plugins: {
          legend: {
            display: false // Hide the legend
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            pointLabels: {
              font: {
                size: 16 // Set the font size for axis labels
              }
            }
          }
        }
      }
    };

    // Create a new Chart instance and store it in chartInstanceRef
    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [data, width, height]);

  return <canvas ref={chartRef} width={width} height={height} />;
};

export default function RadarResultsEthics(props) {
  const {
    _globals,
    _retry,
    retryFeedback,
    _isRetryEnabled,
    chartData
  } = props;

  return (
    <div className="component__inner radarresultsethics__inner">
      <templates.header {...props} />
      <div className="component__widget radarresultsethics__widget">
        {_isRetryEnabled &&
          <div className="component__feedback radarresultsethics__feedback">
            <div className="component__feedback-inner radarresultsethics__feedback-inner">
              {retryFeedback &&
                <div className="radarresultsethics__retry-feedback">
                  <div className="radarresultsethics__retry-feedback-inner" dangerouslySetInnerHTML={{ __html: compile(retryFeedback, props) }} />
                </div>
              }
              <div className="radarresultsethics__feedback-chart">
                {/* Insert the RadarChart component here */}
                <RadarChart data={chartData} width={400} height={400} />
              </div>
              <button className="btn-text radarresultsethics__retry-btn js-assessment-retry-btn">
                <span>
                  {_retry.button || _globals._components._assessmentResults.retryText}
                </span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
