document.getElementById('convertBtn').addEventListener('click', convert);

async function convert() {
    try {
        const amount = document.getElementById('amount').value;
        const currency = document.getElementById('currency').value;
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        const data = await response.json();
        const exchangeRate = data.serie[0].valor;
        const convertedAmount = (amount / exchangeRate).toFixed(2);
        document.getElementById('result').innerText = `Resultado: ${convertedAmount} ${currency}`;


        // Obtener historial de los últimos 10 días para la moneda seleccionada
        const historyResponse = await fetch(`https://mindicador.cl/api/${currency}`);
        const historyData = await historyResponse.json();
        const history = historyData.serie.slice(0, 10);

        // Preparar datos para el gráfico
        const dates = history.map(entry => formatDate(entry.fecha));
        const values = history.map(entry => entry.valor);

        // Mostrar el gráfico
        const ctx = document.getElementById('chart').getContext('2d');
        if (window.myChart) {
            window.myChart.destroy(); // Destruir el gráfico existente si existe
        }
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.reverse(),
                datasets: [{
                    label: 'Historial últimos 10 días',
                    data: values.reverse(),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                },
                responsive: true,
            }
        });
    } catch (e) {
        alert(e.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
