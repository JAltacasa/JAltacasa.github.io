function buildMetadata(sample) {

  console.log(sample);
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample

  var meta_url = "/database/" + samples
  d3.json(meta_url).then(function(response) {
    var meta_data = response;
    console.log(meta_data);

    // Use d3 to select the panel with id of `#sample-metadata`

    var panel_selector = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel_selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel

    // Hint: Inside the loop, you will need to use d3 to append new

    // tags for each key-value in the metadata.
    Object.entries(meta_data).forEach(function(value){
        panel_selector.append("p").text(value[0] + ': ' + value[1]);

    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
   });
  };


function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots

  var sample_url = "/samples/" + sample;
  d3.json(sample_url).then(function(response) {
    var sample_data = response;

    // Build a Bubble Chart using the sample data

    var trace1 = {
    x: sample_data["otu_ids"],
    y: sample_data["sample_values"],
    text: sample_data["otu_labels"],
    hoverinfo: 'text',
    mode: 'markers',
    marker: {
      color: sample_data["otu_ids"],
      size: sample_data["sample_values"]
    }
  };
  var plot_data = [trace1];

  var layout = {
    margin: { t: 30, b: 100 }
  };

  Plotly.newPlot('bubble', plot_data, layout);

    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

console.log(sample_data["otu_labels"].slice(0,9));
console.log(sample_data["sample_values"].slice(0,9));
  var data = [{
  values: sample_data["sample_values"].slice(0,9),
  labels: sample_data["otu_ids"].slice(0,9),
  text: sample_data["otu_labels"].slice(0,9),
  type: 'pie'
}];

Plotly.newPlot('pie', data, layout);
});
};

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