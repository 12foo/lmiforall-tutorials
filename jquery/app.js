var ctx = null; 
var chart = null;

function drawChart(socCode) {
    var wfURL = "http://api.lmiforall.org.uk/api/v1/wf/predict?soc=";
    $.getJSON(wfURL + socCode, function(data) {
        var chartData = {
            labels: [],
            datasets: [{
                label: "Predicted Employment",
                data: []
            }]
        };

        data.predictedEmployment.forEach(function(yearData) {
            chartData.labels.push(yearData.year);
            chartData.datasets[0].data.push(yearData.employment);
        });
        
        if (chart != null) {
            chart.destroy();
            chart = null;
        }
        chart = new Chart(ctx).Line(chartData);
    });
}

function performSearch() {
    var searchURL = "http://api.lmiforall.org.uk/api/v1/soc/search?q=";
    var searchTerms = $('#searchterm').val();
    $.getJSON(searchURL + searchTerms, function(results) {
        $('#soctable tbody').empty();
        results.forEach(function (result) {
            var row = $("<tr></tr>");
            var titleCell = $("<td></td>");
            var codeCell = $("<td></td>");
            titleCell.html(result.title);
            codeCell.html(result.soc);
            row.append(titleCell);
            row.append(codeCell);

            row.on('click', function() {
                $("#displayedjob").html(result.title);
                drawChart(result.soc);
            });

            $('#soctable tbody').append(row);
        });
    });
}

$(function() {
    // when the page is loaded
    ctx = document.getElementById("chart").getContext("2d");
    $('#dosearch').on('click', performSearch);
});
