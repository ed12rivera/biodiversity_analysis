function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// // Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var bbData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleData = bbData.filter(bbData => bbData.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var resultData = sampleData[0];

    // Create a variable to hold the metadata from samples.json
    var bbMetadata = data.metadata;
    // Filter the metadata to extract the metadata for the selected sample.
    var sampleMetadata = bbMetadata.filter(bbMetadata => bbMetadata.id == sample);
    var sampleWashData = sampleMetadata[0];
    // Create teh wash frequency variable to be used in the gauge chart.
    var washFreq = sampleWashData.wfreq;

    // Create variables for sample values, otu_ids, and otu_lables
    var sampleValues = resultData.sample_values;
    var otuIds = resultData.otu_ids;
    var otuLabels = resultData.otu_labels;

    // 8. Create the trace for the bar chart.
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0,10).map(otuIds => `otuIds${otuIds}`).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     xaxis: {title: "Bacteria"},
     paper_bgcolor: 'lightsteelblue'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    
    // Deliverable 2 
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels, 
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: "Earth"
      }}]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      hovermode:'closest',
      paper_bgcolor: 'lightsteelblue'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // Deliverable 3
    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,1], y:[0,1]},
      value: washFreq,
      title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: 'red'},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}
        ],
      }
    }];

    // Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 350,
      margin: {t:0, b:0},
      paper_bgcolor: 'lightsteelblue'
    }
    // Plot the gauge chart.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};



