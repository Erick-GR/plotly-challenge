function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  d3.json(`/metadata/${sample}`).then((response) => {
    console.log(response);

    var meta = d3.select("#sample-metadata");
    meta.html("");

    var freq = 0;
    Object.entries(response).forEach(([key, value]) => {
      console.log(value);
      if (key === "WFREQ") {
        freq = value;
      }
      meta.append("p")
        .text(`${key}: ${value}`);
    });

    var data = [{domain: {x: [0, 1], y: [0, 1]}, value: freq, title: {text: "Belly Button Washing Frequency"},
    type: "indicator", mode: "gauge+number", gauge: {axis: {range: [null, 9]}, }}];

    var layout = {width: 500, height: 500, margin: {t: 0, b: 0}};
    Plotly.newPlot("gauge",data,layout);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((response) => {
    console.log(response);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace = {
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      name: response.otu_labels.slice(0,10),
      type: "pie"
    };

    var data1 = [trace];

    Plotly.newPlot("pie", data1);

    // @TODO: Build a Bubble Chart using the sample data
    var bubble_trace = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: "markers",
      marker: {
        color: response.otu_ids,
        size: response.sample_values,
      }
    };

    var data_bubble = [bubble_trace];

    Plotly.newPlot("bubble", data_bubble);
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
