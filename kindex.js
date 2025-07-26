let chartInstance = null;

async function fetchKIndexData() {
    try {
        const response = await fetch(`https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json?nocache=${new Date().getTime()}`, {
            cache: "no-store"
        });
        const data = await response.json();

        const timeLabels = [];
        const dateLabels = [];
        const kIndexValues = [];

        for (let i = 1; i < data.length; i++) {
            const timestamp = parseUTCDate(data[i][0]);
            const { timeLabel, dayLabel } = formatTimeLabel(timestamp);
            timeLabels.push(timeLabel);
            dateLabels.push(dayLabel);
            kIndexValues.push(parseFloat(data[i][1]));
        }

        renderChart(timeLabels, dateLabels, kIndexValues);
    } catch (error) {
        console.error("Error fetching K-Index data:", error);
    }
}

function parseUTCDate(timestampStr) {
    return new Date(Date.UTC(
        parseInt(timestampStr.substring(0, 4)),
        parseInt(timestampStr.substring(5, 7)) - 1,
        parseInt(timestampStr.substring(8, 10)),
        parseInt(timestampStr.substring(11, 13)),
        parseInt(timestampStr.substring(14, 16)),
        parseInt(timestampStr.substring(17, 19))
    ));
}

function formatTimeLabel(date) {
    const hours = date.getUTCHours();
    const timeLabel = `${hours.toString().padStart(2, "0")}:00`;
    const dayLabel = `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    return { timeLabel, dayLabel };
}

function getKIndexColor(value) {
    if (value < 5) return "#00cc66";       // green (dark teal-green)
    if (value < 6) return "#ffd633";       // yellow-gold
    if (value < 7) return "#ff884d";       // burnt orange
    if (value < 8) return "#b30000";       // deep red
    return "#800080";                      // purple
}

function renderChart(timeLabels, dateLabels, data) {
    const ctx = document.getElementById("kIndexChart").getContext("2d");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: timeLabels,
            datasets: [{
                data,
                backgroundColor: data.map(getKIndexColor),
                borderColor: "#560000",
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "NOAA Planetary Kp Index (3-hour Intervals)",
                    font: { size: 18, weight: "bold" },
                    color: "#222"
                },
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                    backgroundColor: "#560000",
                    titleColor: "#fff",
                    bodyColor: "#fff",
                    borderColor: "#fff",
                    borderWidth: 1,
                    callbacks: {
                        title: (tooltipItems) => {
                            const i = tooltipItems[0].dataIndex;
                            return `${dateLabels[i]} ${timeLabels[i]}`;
                        },
                        label: (tooltipItem) => `Kp Index: ${tooltipItem.raw}`
                    }
                }
            },
            interaction: { mode: "index", intersect: false },
            scales: {
                x: {
                    ticks: {
                        color: "#222",
                        font: { size: 11, weight: "bold" },
                        callback: (val, index) =>
                            index % 8 === 0 ? `${dateLabels[index]}\n${timeLabels[index]}` : ""
                    },
                    title: {
                        display: true,
                        text: "Date & Time (UTC)",
                        font: { size: 12, weight: "bold" },
                        color: "#222"
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    max: 9,
                    title: {
                        display: true,
                        text: "Kp Index",
                        color: "#222",
                        font: { weight: "bold" }
                    },
                    ticks: { stepSize: 1, color: "#222" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                }
            }
        }
    });
}

fetchKIndexData();
setInterval(fetchKIndexData, 60000);
