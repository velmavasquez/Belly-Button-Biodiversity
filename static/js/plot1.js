function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadata_url = "/metadata/" + sample;
  d3.json(metadata_url).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel_metadata = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    panel_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(data).forEach(function ([key, value]) {
      var info = panel_metadata.append("p");
      info.text(`${key}: ${value}`);
    });

  })
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);s
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var data_url = "/samples/" + sample;
  d3.json(data_url).then(function (data) {
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Viridis"
      }
    };

    var bubbleChart = [trace1];

    var layout1 = {
      showlegend: false,
      height: 600,
      width: 1500,
    };

    Plotly.newPlot('bubble', bubbleChart, layout1);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pie_data = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: 'pie',
      
    }];

    var layout2 = {
      showlegend: true,
      height: 570,
      width: 600,
    };

    Plotly.newPlot('pie', pie_data, layout2);

  })

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
