        // Function to process JSON data and organize it for Chart.js
function processJsonData(jsonData) {
            // Get top 10 tags by total activity across all years
        const totalScores = Object.entries(jsonData).map(([tag, years]) => {
            const total = Object.values(years).reduce((sum, v) => sum + v, 0);
            return [tag, total];
        });

        const topTags = totalScores
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);

        const labels = ['2023', '2024', '2025'];

        // Generate datasets with colors
        const baseHues = [0, 210, 120, 45, 280, 180, 330, 90, 160, 30];
        const datasets = topTags.map((tag, index) => {
            const yearData = jsonData[tag];
            return {
                label: tag,
                data: labels.map(year => (yearData[year] * 100).toFixed(1)), // Percentage strings
                absoluteData: labels.map(year => yearData[year]), // Original values
                borderColor: `hsl(${baseHues[index]}, 75%, 50%)`,
                backgroundColor: `hsla(${baseHues[index]}, 75%, 50%, 0.1)`,
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: `hsl(${baseHues[index]}, 75%, 50%)`,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            };
        });

        return {
            labels,
            datasets
        };
    }

        // Function to create the chart
function createChart(data) {
        const ctx = document.getElementById('myChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: ['Stack Overflow Technology Trends', 'Percentage Distribution by Year'],
                        font: {
                            size: 20,
                            weight: 'bold',
                            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                        },
                        padding: { top: 10, bottom: 20 },
                        color: '#333'
                    },
                    legend: {
                        position: 'right',
                        align: 'start',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 6,
                        callbacks: {
                            title: (tooltipItems) => 'Year: ' + tooltipItems[0].label,
                            label: (context) => {
                                const dataset = context.dataset;
                                const value = context.formattedValue;
                                const absolute = (dataset.absoluteData[context.dataIndex] * 100).toFixed(2);
                                return [`${dataset.label}:`, `  ${value}% (${absolute}%)`];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage of Questions (%)',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
                        ticks: { callback: value => value + '%' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        });
    }

        // Fetch and process the JSON file
fetch('https://dhp-project.onrender.com/data')
        .then(response => response.json())
        .then(jsonData => {
            const processedData = processJsonData(jsonData);
            createChart(processedData);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('myChart').insertAdjacentHTML('beforebegin',
                '<div style="color: #dc3545; text-align: center; padding: 15px; font-family: \"Helvetica Neue\", sans-serif; font-size: 14px; background: #fff3f3; border-radius: 6px; margin: 15px;">' +
                '<strong>Error:</strong> Unable to load the data. Please check that the JSON file exists and is accessible.</div>'
            );
        });
