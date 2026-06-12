// 1. UTILITY: Helper function to automatically convert raw CSV text into a JSON array
function parseCSVToJSON(csvText) {
    const lines = csvText.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return [];
    
    // Extract headers and sanitize any lingering quotes or spaces
    const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, '').trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.replace(/^["']|["']$/g, '').trim());
        const rowObject = {};
        headers.forEach((header, index) => {
            const val = values[index];
            // Automatically convert numeric metrics to real floats, keep strings intact
            rowObject[header] = (val && !isNaN(val)) ? parseFloat(val) : val;
        });
        return rowObject;
    });
}

// 2. STYLING: Shared color gradient heatmap function
var applyHeatmapColor = function(cell, value, min, max, baseColor) {
    var percent = (value - min) / (max - min);
    percent = Math.max(0, Math.min(1, percent)); // Clamp value between 0 and 1
    
    var startColor = { r: 255, g: 255, b: 255 }; // Lightest color boundary (Excellent)
    
    var r = Math.round(startColor.r + percent * (baseColor.r - startColor.r));
    var g = Math.round(startColor.g + percent * (baseColor.g - startColor.g));
    var b = Math.round(startColor.b + percent * (baseColor.b - startColor.b));
    
    cell.getElement().style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    cell.getElement().style.fontWeight = "600";
};

// Formatter for MASE columns (Muted blue-gray accent theme)
var maseColorFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var baseBlueGray = { r: 182, g: 206, b: 226 };
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.77;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.02;
    
    applyHeatmapColor(cell, value, min, max, baseBlueGray);
    return parseFloat(value).toFixed(4);
};

// Formatter for CRPS columns (Warm bronze/tan accent theme)
var crpsColorFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var baseBronze = { r: 232, g: 197, b: 151 };
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.43;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.00;
    
    applyHeatmapColor(cell, value, min, max, baseBronze);
    return parseFloat(value).toFixed(4);
};

// Specialized Progress Bar Formatter for MASE Overall sub-table summaries (Warm Bronze/Brown Theme)
var overallColumnFillFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.77;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.02;
    
    var percent = (value - min) / (max - min);
    percent = Math.max(0, Math.min(1, percent));
    
    // Interpolate bronze fill color using the exact shared baseBronze profile
    var lightBronze = { r: 250, g: 238, b: 224 };
    var darkBronze = { r: 232, g: 197, b: 151 }; // Shared baseBronze
    
    var r = Math.round(lightBronze.r + percent * (darkBronze.r - lightBronze.r));
    var g = Math.round(lightBronze.g + percent * (darkBronze.g - lightBronze.g));
    var b = Math.round(lightBronze.b + percent * (darkBronze.b - lightBronze.b));
    
    var barColor = `rgb(${r}, ${g}, ${b})`;
    var percentWidth = percent * 100;
    
    cell.getElement().style.background = `linear-gradient(to right, ${barColor} ${percentWidth}%, rgba(255,255,255,0) ${percentWidth}%)`;
    cell.getElement().style.fontWeight = "700";
    
    return parseFloat(value).toFixed(4);
};

// Specialized Progress Bar Formatter for CRPS Overall summaries (Atmospheric Blue/Gray Theme)
var overallCrpsColumnFillFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.40;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.00;
    
    var percent = (value - min) / (max - min);
    percent = Math.max(0, Math.min(1, percent));
    
    // Interpolate blue fill color using the exact shared baseBlueGray profile
    var lightBlue = { r: 236, g: 242, b: 247 };
    var darkBlue = { r: 182, g: 206, b: 226 }; // Shared baseBlueGray
    
    var r = Math.round(lightBlue.r + percent * (darkBlue.r - lightBlue.r));
    var g = Math.round(lightBlue.g + percent * (darkBlue.g - lightBlue.g));
    var b = Math.round(lightBlue.b + percent * (darkBlue.b - lightBlue.b));
    
    var barColor = `rgb(${r}, ${g}, ${b})`;
    var percentWidth = percent * 100;
    
    cell.getElement().style.background = `linear-gradient(to right, ${barColor} ${percentWidth}%, rgba(255,255,255,0) ${percentWidth}%)`;
    cell.getElement().style.fontWeight = "700";
    
    return parseFloat(value).toFixed(4);
};

// Dynamic tier-badge generator for model classifications
var modelBadgeFormatter = function(cell) {
    var value = cell.getValue();
    var category = cell.getData().category ? cell.getData().category.trim() : "";
    
    var badge = "";
    if (category === "TSFM" || category === "TSFMS") {
        badge = '<span style="background: #659bd7ff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px;">TSFM</span>';
    } else if (category === "ML Baseline") {
        badge = '<span style="background: #de8888ff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px;">ML</span>';
    } else if (category === "Statistical Baseline") {
        badge = '<span style="background: #7ac292ff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px;">Statistical </span>';
    }
    return badge + value;
};


// 3. CORE EXECUTOR: Fetch flat files as plain text, parse them to JSON, and render tables
document.addEventListener('DOMContentLoaded', function() {

    // --- 0. RENDERING MAIN LEADERBOARD ---
    fetch('website/data/atmobench_main_results.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#atmobench-main-table", {
                data: parsedJsonData,
                layout: "fitDataCondensed",
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "mase_overall", dir: "asc" }],
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 250, headerSort: true, formatter: modelBadgeFormatter },
                    { title: "MASE (norm.)", field: "mase_overall", width: 140, hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.77, max: 1.02 } },
                    { title: "CRPS (norm.)", field: "crps_overall", width: 140, hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.43, max: 1.00 } }
                ]
            });
        })
        .catch(err => console.error('Error fetching/parsing main leaderboard:', err));


    // --- 1. RENDERING PER DATASET TABLE WITH PROGRESS BAR OVERALL COLUMN (MASE) ---
    fetch('website/data/atmobench_dataset_results_mase.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#atmobench-dataset-table-mase", {
                data: parsedJsonData,
                layout: "fitColumns", // fitDataCondensed
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_mase", dir: "asc" }],
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 220, formatter: modelBadgeFormatter },
                    { title: "AURN (UK)", field: "AURN", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "CNEMC (China)", field: "CNEMC", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "CPCB (India)", field: "CPCB", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "EEA_DE (Germany)", field: "EEA_DE", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "EEA_FR (France)", field: "EEA_FR", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "EPA (USA)", field: "EPA", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "SINAICA (Mexico)", field: "SINAICA", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { 
                        title: "Overall", 
                        field: "overall_mase", 
                        hozAlign: "left", 
                        headerHozAlign: "center",
                        cssClass: "avg-column",
                        width: 110,
                        mutator: function(value, data) {
                            const fields = ["AURN", "CNEMC", "CPCB", "EEA_DE", "EEA_FR", "EPA", "SINAICA"];
                            let total = 0, count = 0;
                            fields.forEach(f => {
                                if (data[f] !== undefined && data[f] !== null && data[f] !== "-") {
                                    total += parseFloat(data[f]);
                                    count++;
                                }
                            });
                            return count > 0 ? (total / count) : "-";
                        },
                        formatter: overallColumnFillFormatter, // Warm bronze/brown fill
                        formatterParams: { min: 0.77, max: 1.02 }
                    }
                ]
            });
        })
        .catch(err => console.error('Error fetching/parsing dataset leaderboard:', err));


    // --- 2. RENDERING PER POLLUTANT TABLE WITH PROGRESS BAR OVERALL COLUMN (MASE) ---
    fetch('website/data/atmobench_pollutant_results_mase.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#atmobench-pollutant-table-mase", {
                data: parsedJsonData,
                layout: "fitColumns", // fitDataCondensed
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_mase", dir: "asc" }],
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 220, formatter: modelBadgeFormatter },
                    { title: "CO", field: "CO", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "NO2", field: "NO2", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "Ozone", field: "Ozone", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "PM10", field: "PM10", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "PM2.5", field: "PM2_5", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } }, // Aligned metric mapping
                    { title: "SO2", field: "SO2", hozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { 
                        title: "Overall", 
                        field: "overall_mase", 
                        hozAlign: "left", 
                        headerHozAlign: "center",
                        cssClass: "avg-column",
                        width: 110,
                        mutator: function(value, data) {
                            const fields = ["CO", "NO2", "Ozone", "PM10", "PM2_5", "SO2"];
                            let total = 0, count = 0;
                            fields.forEach(f => {
                                if (data[f] !== undefined && data[f] !== null && data[f] !== "-") {
                                    total += parseFloat(data[f]);
                                    count++;
                                }
                            });
                            return count > 0 ? (total / count) : "-";
                        },
                        formatter: overallColumnFillFormatter, // Warm bronze/brown fill
                        formatterParams: { min: 0.77, max: 1.02 }
                    }
                ]
            });
        })
        .catch(err => console.error('Error fetching/parsing pollutant leaderboard:', err));


    // --- 3. RENDERING PER DATASET TABLE WITH BLUE PROGRESS BAR OVERALL COLUMN (CRPS) ---
    fetch('website/data/atmobench_dataset_results_crps.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#atmobench-dataset-table-crps", {
                data: parsedJsonData,
                layout: "fitColumns", // fitDataCondensed
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_crps", dir: "asc" }], 
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 220, formatter: modelBadgeFormatter },
                    { title: "AURN (UK)", field: "AURN", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { title: "CNEMC (China)", field: "CNEMC", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { title: "CPCB (India)", field: "CPCB", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { title: "EEA_DE (Germany)", field: "EEA_DE", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { title: "EEA_FR (France)", field: "EEA_FR", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { title: "EPA (USA)", field: "EPA", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { title: "SINAICA (Mexico)", field: "SINAICA", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 } },
                    { 
                        title: "Overall", 
                        field: "overall_crps", 
                        hozAlign: "left", 
                        headerHozAlign: "center",
                        cssClass: "avg-column",
                        width: 110,
                        mutator: function(value, data) {
                            const fields = ["AURN", "CNEMC", "CPCB", "EEA_DE", "EEA_FR", "EPA", "SINAICA"];
                            let total = 0, count = 0;
                            fields.forEach(f => {
                                if (data[f] !== undefined && data[f] !== null && data[f] !== "-") {
                                    total += parseFloat(data[f]);
                                    count++;
                                }
                            });
                            return count > 0 ? (total / count) : "-";
                        },
                        formatter: overallCrpsColumnFillFormatter, // Atmospheric Blue fill
                        formatterParams: { min: 0.40, max: 1.00 } 
                    }
                ]
            });
        })
        .catch(err => console.error('Error fetching/parsing dataset CRPS leaderboard:', err));


    // --- 4. RENDERING PER POLLUTANT TABLE WITH BLUE PROGRESS BAR OVERALL COLUMN (CRPS) ---
    fetch('website/data/atmobench_pollutant_results_crps.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#atmobench-pollutant-table-crps", {
                data: parsedJsonData,
                layout: "fitColumns", // fitDataCondensed
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_crps", dir: "asc" }],
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 220, formatter: modelBadgeFormatter },
                    { title: "CO", field: "CO", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "NO2", field: "NO2", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "Ozone", field: "Ozone", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "PM10", field: "PM10", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "PM2.5", field: "PM2_5", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "SO2", field: "SO2", hozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { 
                        title: "Overall", 
                        field: "overall_crps", 
                        hozAlign: "left", 
                        headerHozAlign: "center",    
                        cssClass: "avg-column",
                        width: 110,
                        mutator: function(value, data) {
                            const fields = ["CO", "NO2", "Ozone", "PM10", "PM2_5", "SO2"];
                            let total = 0, count = 0;
                            fields.forEach(f => {
                                if (data[f] !== undefined && data[f] !== null && data[f] !== "-") {
                                    total += parseFloat(data[f]);
                                    count++;
                                }
                            });
                            return count > 0 ? (total / count) : "-";
                        },
                        formatter: overallCrpsColumnFillFormatter, // Atmospheric Blue fill
                        formatterParams: { min: 0.40, max: 1.00 }
                    }
                ]
            });
        })
        .catch(err => console.error('Error fetching/parsing pollutant CRPS leaderboard:', err));
});