function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filtering the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Using d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
    buildGauge(result.wfreq);
  });
}

function buildCharts(sample) {

  // @TODO: Using `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // @TODO: Building a Bubble Chart using the sample data
    var xValues = data.otu_ids;
    var yValues = data.sample_values;
    var tValues = data.otu_labels;
    var mSize = data.sample_values;
    var mClrs = data.otu_ids;

    var trace_bubble = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs
      }
    };

    var data = [trace_bubble];

    var layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Building a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(data) {
      var pieValue = data.sample_values.slice(0,10);
      var pielabel = data.otu_ids.slice(0, 10);
      var pieHover = data.otu_labels.slice(0, 10);

      var data = [{
        values: pieValue,
        labels: pielabel,
        hovertext: pieHover,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);
    });
  });
};

function init() {
  // Grabbing a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Using the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Using the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetching new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initializing the dashboard
init();