const ctx = document.getElementById('solarWindChart').getContext('2d');
let latestBz = "--";
let latestBt = "--";
let fullData = [];
let HOURS_TO_DISPLAY = 24;

Chart.register({
    id: 'verticalLinePlugin',
    afterDraw(chart) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const ctx = chart.ctx;
            const x = chart.tooltip._active[0].element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(86, 0, 0, 0.6)';
            ctx.stroke();
            ctx.restore();
        }
    }
});

let solarWindChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { 
                label: "Bz GSM (nT)",
                data: [], 
                borderColor: '#ff3333',
                backgroundColor: 'rgba(255, 51, 51, 0.1)',
                borderWidth: 1.5,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            },
            {
                label: "Bt (nT)",
                data: [],
                borderColor: '#560000',
                backgroundColor: 'rgba(86, 0, 0, 0.2)',
                borderWidth: 1.5,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3,
        layout: {
            padding: {
                left: 5,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'index',
            intersect: false
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    tooltipFormat: 'MMM dd HH:mm'
                },
                ticks: {
                    color: '#222',
                    font: {
                        size: 12
                    },
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Magnetic Field (nT)",
                    color: '#222',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                },
                beginAtZero: false,
                ticks: {
                    color: '#222',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#560000',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#ffffff',
                borderWidth: 1,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y != null) {
                            label += context.parsed.y.toFixed(2) + ' nT';
                        }
                        return label;
                    }
                }
            }
        },
        elements: {
            line: {
                borderJoinStyle: 'round'
            }
        },
        clip: false
    },
    plugins: ['verticalLinePlugin']
});

async function fetchData() {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json');
        const data = await response.json();

        fullData = data.slice(1).map(row => ({
            time: new Date(row[0]),
            bz: parseFloat(row[3]),
            bt: parseFloat(row[6])
        }));

        updateChart();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateChart() {
    if (fullData.length === 0) return;

    let latestTime = fullData[fullData.length - 1].time;
    let cutoffTime = latestTime.getTime() - HOURS_TO_DISPLAY * 60 * 60 * 1000;

    let filteredData = fullData.filter(point => point.time.getTime() >= cutoffTime);

    solarWindChart.data.labels = filteredData.map(point => point.time);
    solarWindChart.data.datasets[0].data = filteredData.map(point => point.bz);
    solarWindChart.data.datasets[1].data = filteredData.map(point => point.bt);

    if (filteredData.length > 0) {
        latestBz = filteredData[filteredData.length - 1].bz.toFixed(2);
        latestBt = filteredData[filteredData.length - 1].bt.toFixed(2);
    }

    document.getElementById('bz-value').textContent = `Bz GSM: ${latestBz} nT`;
    document.getElementById('bt-value').textContent = `Bt: ${latestBt} nT`;

    solarWindChart.update();
}

// Time Range Buttons
document.getElementById('btn-1day').addEventListener('click', () => { HOURS_TO_DISPLAY = 24; updateChart(); });
document.getElementById('btn-12hr').addEventListener('click', () => { HOURS_TO_DISPLAY = 12; updateChart(); });
document.getElementById('btn-6hr').addEventListener('click', () => { HOURS_TO_DISPLAY = 6; updateChart(); });

fetchData();
setInterval(fetchData, 60000);
