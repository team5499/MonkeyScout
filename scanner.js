let pause = false;
let data = [];

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.error('No cameras found.');
    }
}).catch(function (e) {console.error(e);});

let scanner = new Instascan.Scanner({
    video: document.getElementById('preview')
});

scanner.addListener('scan', function (e) {
    console.log(e)
    let match = e.split(',');
    console.log(match)
    data.push(match)
    let tr = $('<tr></tr>');
    for(let i in match){
        let td = $('<td>'+match[i]+'</td>')
        tr.append(td);
    }
    $('#table').append(tr);
});

function toggleScanner(btn){
    pause = !pause;
    if(pause){
        scanner.stop();
        $(btn).text("Start Scanner");
    }
    else{
        scanner.start();
        $(btn).text("Stop Scanner");
    }
}
function exportToCSV(filename) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < data.length; i++) {
        csvFile += processRow(data[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}