// Read JSON data
d3.json("samples.json").then((data) => {
    var samples = data.samples
    var id = samples.map(d => d.id)
    console.log(id)

    // Append id options for dropdown
    id.forEach(function(d) {
        d3.selectAll("#selDataset")
        .append("option")
        .text(d);
    });

    // Function for dropdown event
    d3.selectAll("#selDataset").on("change", dropdownOptions);

    // This function is called when a dropdown menu item is selected
    function dropdownOptions() {

        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");

        // Assign the value of the dropdown menu option to a variable
        var input = dropdownMenu.property("value");

        plotData(input)
        metadata(parseInt(input))
    };

    // Function for data filtering based on dropdown option selected
    function plotData(input) {
        // Filter data based on id option
        var data = samples.filter(d => d.id === input)
    
        // Select top 10 otu ids
        var otuId = data.map(d => d.otu_ids)
        var sliceId = otuId[0].slice(0,10).reverse()
        var otuAdded = sliceId.map(d => "OTU " + d)

        // Select top 10 sample values
        var sampleValues = data.map(d => d.sample_values)                                    
        var sliceSample = sampleValues[0].slice(0,10).reverse()
    
        // Select top 10 otu labels
        var otuLabels= data.map(d => d.otu_labels)
        var sliceLabels= otuLabels[0].slice(0,10)

        // return ([sliceID, otuAdded, sliceSample, sliceLabels])

        // Create horizontal bar plot
        var trace1 = {
            x: sliceSample,
            y: otuAdded,
            text: sliceLabels,
            type: "bar",
            orientation: "h",
            color: "#CC0066" 
        };

        var barData = [trace1];

        var barLayout = {
            title: "Top 10 OTUs by Participant",
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU IDs"},
            height: 700,
            width: 1100,
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bar", barData, barLayout, {displayModeBar: false});


        // Create bubble plot
        var trace2 = {
            x: sliceId, 
            y: sliceSample,
            text: sliceLabels,
            mode: "markers",
            marker: {
                size: sliceSample,
                color: sliceId,
                colorscale: "Electric",
            }
        };

        var bubbleData = [trace2];

        var bubbleLayout = {
            xaxis: {title: "OTU ID",
            zeroline: true,
            },
            yaxis: {title: "Sample Values",
            zeroline: true,
            },
            height: 500,
            width: 1100,
            margin: {
                l: 250,
                r: 0,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout, {displayModeBar: false});
    };

    // Display individual demographic information
    function metadata(input) {

        var metadata = data.metadata
        d3.selectAll(".panel-body > h5").remove()

        var metadataFilter = metadata.filter(d => d.id === input)[0]

        Object.entries(metadataFilter).forEach(function([key, value]) {
            d3.selectAll(".panel-body").append("h5").html("<strong>" + key + ": " + "</strong>" + value);
        });

    };        

    // Create function to initialize
    function init() {
        plotData("940");
        metadata(940);
    };

    init();

});