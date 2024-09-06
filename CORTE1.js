// Cargar la librería de Google Charts y el paquete específico
google.charts.load('current', {'packages':['corechart']});

// Definir el evento para el botón de procesar
document.getElementById('processButton').addEventListener('click', function() {
    let errors = {
        arcsin: 0,
        arccos: 0,
        sqrt: 0,
        division: 0,
        ln: 0
    };

    for (let i = 0; i < 1000; i++) {
        let a = Math.random() * 2 - 1;
        let b = Math.random() * 2 - 1;
        let c = Math.random() * 2 - 1;
        let d = Math.random() * 2 - 1;
        let e = Math.random() * 2 - 1;
        let f = Math.random() * 2 - 1;
        let g = Math.random() * 2 - 1;
        let h = Math.random() * 2 - 1;
        let iValue = Math.random() * 2 - 1;
        let j = Math.random() * 2 - 1;
        let k = Math.random() * 2 - 1;
        let l = Math.random() * 2 - 1;
        let m = Math.random() * 2 - 1;
        let n = Math.random() * 2 - 1;

        try {
            let asin_result = Math.asin(a - b);
            if (isNaN(asin_result)) errors.arcsin++;

            let acos_result1 = Math.acos(c * d);
            if (isNaN(acos_result1)) errors.arccos++;

            let sqrt_result1 = Math.sqrt(e - f);
            if (isNaN(sqrt_result1) || (e - f) < 0) errors.sqrt++;

            let log_result1 = Math.log(g * h);
            if (isNaN(log_result1) || (g * h) <= 0) errors.ln++;

            // Verificar división por cero en iValue / j
            if (Math.abs(j) < Number.EPSILON) {
                errors.division++;
                continue; // Saltar esta iteración
            }
            let division1 = iValue / j;

            let acos_result2 = Math.acos(division1);
            if (isNaN(acos_result2)) errors.arccos++;

            let sqrt_result2 = Math.sqrt(k + l);
            if (isNaN(sqrt_result2) || (k + l) < 0) errors.sqrt++;

            let log_result2 = Math.log(m - n);
            if (isNaN(log_result2) || (m - n) <= 0) errors.ln++;

            // Verificar división por cero en el denominador
            if (Math.abs(sqrt_result2) < Number.EPSILON) {
                errors.division++;
                continue; // Saltar esta iteración
            }
            let denominator = acos_result2 / sqrt_result2;

            if (isNaN(denominator) || Math.abs(denominator) < Number.EPSILON) {
                errors.division++;
                continue; // Saltar esta iteración
            }

            let Y = (asin_result + acos_result1 + sqrt_result1 + log_result1) / denominator + log_result2;

        } catch (e) {
            console.error('Error en la ecuación:', e);
        }
    }

    let totalErrors = Object.values(errors).reduce((a, b) => a + b, 0);
    let percentages = {};
    for (let key in errors) {
        percentages[key] = ((errors[key] / totalErrors) * 100).toFixed(2);
    }

    let tbody = document.getElementById('errorTable').querySelector('tbody');
    tbody.innerHTML = ''; 
    for (let key in errors) {
        let errorName = '';
        switch(key) {
            case 'arcsin': errorName = 'Arcoseno'; break;
            case 'arccos': errorName = 'Arcocoseno'; break;
            case 'sqrt': errorName = 'Raíz Cuadrada'; break;
            case 'division': errorName = 'División'; break;
            case 'ln': errorName = 'Logaritmo Natural'; break;
        }
        let row = `<tr>
            <td>${errorName}</td>
            <td>${errors[key]}</td>
            <td>${percentages[key]}%</td>
        </tr>`;
        tbody.innerHTML += row;
    }

    // Dibujar el gráfico de pastel
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Error', 'Porcentaje'],
            ['Arcoseno', parseFloat(percentages.arcsin)],
            ['Arcocoseno', parseFloat(percentages.arccos)],
            ['Raíz Cuadrada', parseFloat(percentages.sqrt)],
            ['División', parseFloat(percentages.division)],
            ['Logaritmo Natural', parseFloat(percentages.ln)]
        ]);

        var options = {
            title: 'Errores por Tipo',
            is3D: true,
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
});
