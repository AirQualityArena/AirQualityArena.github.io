// Air Quality Arena (AQA) Dynamic Leaderboard Table Configuration

// 1. UTILITY: Helper function to automatically convert raw CSV text into a JSON array
function parseCSVToJSON(csvText) {
    const lines = csvText.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, '').trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.replace(/^["']|["']$/g, '').trim());
        const rowObject = {};
        headers.forEach((header, index) => {
            const val = values[index];
            rowObject[header] = (val && !isNaN(val)) ? parseFloat(val) : val;
        });
        return rowObject;
    });
}

// 2. STYLING: Shared color gradient heatmap function
var applyHeatmapColor = function(cell, value, min, max, baseColor) {
    var percent = (value - min) / (max - min);
    percent = Math.max(0, Math.min(1, percent)); 
    
    var startColor = { r: 255, g: 255, b: 255 }; 
    
    var r = Math.round(startColor.r + percent * (baseColor.r - startColor.r));
    var g = Math.round(startColor.g + percent * (baseColor.g - startColor.g));
    var b = Math.round(startColor.b + percent * (baseColor.b - startColor.b));
    
    cell.getElement().style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    cell.getElement().style.fontWeight = "600";
};

var maseColorFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var baseBlueGray = { r: 182, g: 206, b: 226 };
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.77;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.02;
    
    applyHeatmapColor(cell, value, min, max, baseBlueGray);
    return parseFloat(value).toFixed(4);
};

var crpsColorFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var baseBronze = { r: 232, g: 197, b: 151 };
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.43;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.00;
    
    applyHeatmapColor(cell, value, min, max, baseBronze);
    return parseFloat(value).toFixed(4);
};

var overallColumnFillFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.77;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.02;
    
    var percent = (value - min) / (max - min);
    percent = Math.max(0, Math.min(1, percent));
    
    var lightBronze = { r: 250, g: 238, b: 224 };
    var darkBronze = { r: 232, g: 197, b: 151 }; 
    
    var r = Math.round(lightBronze.r + percent * (darkBronze.r - lightBronze.r));
    var g = Math.round(lightBronze.g + percent * (darkBronze.g - lightBronze.g));
    var b = Math.round(lightBronze.b + percent * (darkBronze.b - lightBronze.b));
    
    var barColor = `rgb(${r}, ${g}, ${b})`;
    var percentWidth = percent * 100;
    
    cell.getElement().style.background = `linear-gradient(to right, ${barColor} ${percentWidth}%, rgba(255,255,255,0) ${percentWidth}%)`;
    cell.getElement().style.fontWeight = "700";
    
    return parseFloat(value).toFixed(4);
};

var overallCrpsColumnFillFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    if (value === "-" || value === null || value === undefined || isNaN(value)) return value;
    
    var min = formatterParams.min !== undefined ? formatterParams.min : 0.40;
    var max = formatterParams.max !== undefined ? formatterParams.max : 1.00;
    
    var percent = (value - min) / (max - min);
    percent = Math.max(0, Math.min(1, percent));
    
    var lightBlue = { r: 236, g: 242, b: 247 };
    var darkBlue = { r: 182, g: 206, b: 226 }; 
    
    var r = Math.round(lightBlue.r + percent * (darkBlue.r - lightBlue.r));
    var g = Math.round(lightBlue.g + percent * (darkBlue.g - lightBlue.g));
    var b = Math.round(lightBlue.b + percent * (darkBlue.b - lightBlue.b));
    
    var barColor = `rgb(${r}, ${g}, ${b})`;
    var percentWidth = percent * 100;
    
    cell.getElement().style.background = `linear-gradient(to right, ${barColor} ${percentWidth}%, rgba(255,255,255,0) ${percentWidth}%)`;
    cell.getElement().style.fontWeight = "700";
    
    return parseFloat(value).toFixed(4);
};

// Dynamic tier-badge generator for model classifications with embedded GitHub repository links
var modelBadgeFormatter = function(cell) {
    var value = cell.getValue();
    var category = cell.getData().category ? cell.getData().category.trim() : "";
    
    // URL registry mapping models to their source repositories
    var repoLinks = {
        "VisionTS++": "https://github.com/HALF111/VisionTSpp", 
        "TiRex": "https://github.com/NX-AI/tirex",
        "TimesFM-2.5": "https://github.com/google-research/timesfm",
        "TimesFM-2.0": "https://github.com/google-research/timesfm",
        "TimesFM-1.0": "https://github.com/google-research/timesfm",
        "Moirai-2": "https://github.com/SalesforceAIResearch/uni2ts",
        "Moirai-1": "https://github.com/SalesforceAIResearch/uni2ts",
        "Chronos-2": "https://github.com/amazon-science/chronos-forecasting",
        "Chronos-Bolt": "https://github.com/amazon-science/chronos-forecasting",
        "Sundial": "https://github.com/thuml/Sundial",
        "Kairos": "https://github.com/foundation-model-research/Kairos",
        "PatchTST": "https://github.com/ibm-granite/granite-tsfm",
        "DLinear": "https://github.com/autogluon/autogluon",
        "DeepAR": "https://github.com/autogluon/autogluon",
        "LightGBM": "https://github.com/lightgbm-org/LightGBM",
        "AutoETS": "https://github.com/Nixtla/statsforecast",
        "Seasonal Naive": "https://github.com/Nixtla/statsforecast"
    };

    // Clean up key lookups to account for small naming variances safely
    var lookupKey = value ? value.trim() : "";
    var targetUrl = repoLinks[lookupKey] || "#";

    // Generate tier categorization badges
    var badge = "";
    if (category === "TSFM" || category === "TSFMS") {
        badge = '<span style="background: #659bd7ff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px; font-weight: bold; display: inline-block;">TSFM</span>';
    } else if (category === "ML Baseline") {
        badge = '<span style="background: #de8888ff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px; font-weight: bold; display: inline-block;">ML</span>';
    } else if (category === "Statistical Baseline") {
        badge = '<span style="background: #7ac292ff; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px; font-weight: bold; display: inline-block;">Statistical</span>';
    }

    // Wrap model names in explicit hyperlink tracking styles
    if (targetUrl !== "#") {
        return badge + `<a href="${targetUrl}" target="_blank" style="color: #1e4e52; font-weight: 600; text-decoration: none; border-bottom: 1px dashed #1e4e52;" onmouseover="this.style.color='#659bd7ff'" onmouseout="this.style.color='#1e4e52'">${value}</a>`;
    } else {
        return badge + value; // Fallback to plain text if no URL is found
    }
};

// 3. CORE EXECUTOR: Render tables with updated AQA data endpoints and DOM elements
document.addEventListener('DOMContentLoaded', function() {

    // --- 0. MAIN LEADERBOARD ---
    fetch('website/data/aqa_main_results.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            new Tabulator("#aqa-main-table", {
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
        }).catch(err => console.error('Error fetching main leaderboard:', err));

    // --- 1. RENDERING PER DATASET TABLE (MASE) ---
    fetch('website/data/aqa_dataset_results_mase.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#aqa-dataset-table-mase", {
                data: parsedJsonData,
                layout: "fitColumns", // Force the table to perfectly match your container width
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_mase", dir: "asc" }],
                columns: [
                    // Give the Model column a fixed footprint so it doesn't squish the data
                    { title: "Model", field: "model", frozen: true, width: 200, formatter: modelBadgeFormatter },
                    
                    // Use growth parameters to let the data columns scale smoothly and evenly
                    { title: "AURN (UK)", field: "AURN", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 90, growth: 1 },
                    { title: "CNEMC (China)", field: "CNEMC", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 110, growth: 1 },
                    { title: "CPCB (India)", field: "CPCB", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 100, growth: 1 },
                    { title: "EEA_DE (Germany)", field: "EEA_DE", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 120, growth: 1 },
                    { title: "EEA_FR (France)", field: "EEA_FR", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 110, growth: 1 },
                    { title: "EPA (USA)", field: "EPA", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 95, growth: 1 },
                    { title: "SINAICA (Mexico)", field: "SINAICA", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 }, minWidth: 120, growth: 1 },
                    { 
                        title: "Overall", 
                        field: "overall_mase", 
                        hozAlign: "left", 
                        headerHozAlign: "center",
                        cssClass: "avg-column",
                        width: 100, // Fixed size ensures the bar graphics look consistent
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
                        formatter: overallColumnFillFormatter, 
                        formatterParams: { min: 0.77, max: 1.02 }
                    }
                ]
            });
        })
        .catch(err => console.error('Error fetching dataset MASE table:', err));

    // --- 2. PER POLLUTANT TABLE (MASE) ---
    fetch('website/data/aqa_pollutant_results_mase.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            new Tabulator("#aqa-pollutant-table-mase", {
                data: parsedJsonData,
                layout: "fitColumns",
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_mase", dir: "asc" }],
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 220, formatter: modelBadgeFormatter },
                    { title: "CO", field: "CO", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "NO2", field: "NO2", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "Ozone", field: "Ozone", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "PM10", field: "PM10", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
                    { title: "PM2.5", field: "PM2_5", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } }, 
                    { title: "SO2", field: "SO2", hozAlign: "center", headerHozAlign: "center", formatter: maseColorFormatter, formatterParams: { min: 0.75, max: 1.35 } },
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
                        formatter: overallColumnFillFormatter, 
                        formatterParams: { min: 0.77, max: 1.02 }
                    }
                ]
            });
        }).catch(err => console.error('Error fetching pollutant MASE table:', err));

    // --- 3. RENDERING PER DATASET TABLE (CRPS) ---
    fetch('website/data/aqa_dataset_results_crps.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            
            new Tabulator("#aqa-dataset-table-crps", {
                data: parsedJsonData,
                layout: "fitColumns", // Force full container distribution
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_crps", dir: "asc" }], 
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 200, formatter: modelBadgeFormatter },
                    { title: "AURN (UK)", field: "AURN", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 90, growth: 1 },
                    { title: "CNEMC (China)", field: "CNEMC", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 110, growth: 1 },
                    { title: "CPCB (India)", field: "CPCB", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 100, growth: 1 },
                    { title: "EEA_DE (Germany)", field: "EEA_DE", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 120, growth: 1 },
                    { title: "EEA_FR (France)", field: "EEA_FR", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 110, growth: 1 },
                    { title: "EPA (USA)", field: "EPA", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 95, growth: 1 },
                    { title: "SINAICA (Mexico)", field: "SINAICA", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.13, max: 1.00 }, minWidth: 120, growth: 1 },
                    { 
                        title: "Overall", 
                        field: "overall_crps", 
                        hozAlign: "left", 
                        headerHozAlign: "center",
                        cssClass: "avg-column",
                        width: 100,
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
                        formatter: overallCrpsColumnFillFormatter, 
                        formatterParams: { min: 0.40, max: 1.00 } 
                    }
                ]
            });
        })
        .catch(err => console.error('Error fetching dataset CRPS table:', err));

    // --- 4. RENDERING PER POLLUTANT TABLE (CRPS) ---
    fetch('website/data/aqa_pollutant_results_crps.csv')
        .then(response => response.text())
        .then(csvText => {
            const parsedJsonData = parseCSVToJSON(csvText);
            new Tabulator("#aqa-pollutant-table-crps", {
                data: parsedJsonData,
                layout: "fitColumns",
                responsiveLayout: false,
                pagination: false,
                height: "auto",
                initialSort: [{ column: "overall_crps", dir: "asc" }],
                columns: [
                    { title: "Model", field: "model", frozen: true, width: 220, formatter: modelBadgeFormatter },
                    { title: "CO", field: "CO", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "NO2", field: "NO2", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "Ozone", field: "Ozone", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "PM10", field: "PM10", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "PM2.5", field: "PM2_5", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
                    { title: "SO2", field: "SO2", hozAlign: "center", headerHozAlign: "center", formatter: crpsColorFormatter, formatterParams: { min: 0.30, max: 1.15 } },
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
                        formatter: overallCrpsColumnFillFormatter, 
                        formatterParams: { min: 0.40, max: 1.00 }
                    }
                ]
            });
        }).catch(err => console.error('Error fetching pollutant CRPS table:', err));
});
