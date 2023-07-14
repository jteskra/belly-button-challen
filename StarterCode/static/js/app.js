// Set up constant for JSON data url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// set up function tp create the dropdown menu
function init() {

    // create the dropdown options
    let dropdownMenu = d3.select("#selDataset");

    //get the names list from the aip call
    d3.json(url).then((data) => {

    let namesList = data.names;

    // iterate through the names list and add the ids for each to the dropdown
    namesList.forEach(name => {
        // pick the dropdown menu
        dropdownMenu
        // append every name as an option
        .append("option")
        // append every string to its own value
        .attr("value", name)

        // add each string to the dropdown menu so that it can be selected by id
        .text(name);
    })
  
 // Set up plots and Demographic Info box to show display data for first sample when page opens
 // Bar graph and Bubble Chart
 // create the plots for the demographic info box so it shows when page is opened/
// create the bar chanrt and bubble chart
 const firstPlotId = namesList[0];
 chartCreation(firstPlotId);

 //Demographic Info Box
 demographics(firstPlotId); 
})}

// creating the funciton that will create the charts using the id that is chosen from the dropdown
function chartCreation(sample) {
    // Get the samples from the api call using the d3 library then create the chart parameters
    d3.json(url).then((data) => {
        let samplesArray = data.samples;

        // Get only the chosen id from the samplesArray by filtering the data by the sample ID
        let selectedSample = samplesArray.filter(sampleJSON => sampleJSON.id == sample);
        let result = selectedSample[0];

        //Get only the sample_values from the result
        let sampleValues = result.sample_values;
        // now only get the otu_ids
        let otuIds = result.otu_ids;
        //now only get the otu_labels
        let otuLabels = result.otu_labels;
        //set up the paramenters for the bar chart then plot it
        let traceBar = [
            {
                type: 'bar',
                x: sampleValues.slice(0,10).reverse(),
                y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
                text: otuLabels.slice(0,10).reverse(),
                orientation: 'h'
            }];
        // Make the layout for the variable for bar chart
        let layoutBar = {
            title: '',
            xaxis: {
                title: 'Sample Values'
            },
            yaxis: {
                title: 'OTU ID'
            }
        };
         // Plot the bar chart
         Plotly.newPlot("bar", traceBar, layoutBar);
        // Set up bubble chart parameters for the correct ids
        let traceBubble = [
            {
                x: otuIds,
                y: sampleValues,
                mode: 'markers',
                marker: {
                    size: sampleValues,
                    colorscale: 'RdBu',
                    color: otuIds
                },
                text: otuLabels
            }];
        // Make the layout for the bubble chart
        let layoutBubble = {
            title: '',
                xaxis: {
                    title: 'OTU ID'
                },
                yaxis: {
                    title: 'Sample Values'
                }
        }
        // Plot the chart with the trace and the layout and put it in the "bubble"
        Plotly.newPlot("bubble", traceBubble, layoutBubble);
    })
}
//Create the function that will update the demographic data
function demographics(sample) {
    // Get the samples array and only get the demographic info
    d3.json(url).then((data) => {
        let metadataArray = data.metadata;
        // Only get the selectedSanoke from the metadataArray
        let selectedSample = metadataArray.filter(sampleJSON => sampleJSON.id == sample);
        let result = selectedSample[0];
        // get the demographic box throught the d3 library
        let demoBox = d3.select('#sample-metadata');
        // get rid of anything in the text box that is already previously there
        demoBox.html("");
        //Take the results and then slice them into key value pairs
        let slicedResult = Object.entries(result);
        // Loop through the sliced results and append them to the demographic box
        slicedResult.forEach(keyValue => {
            demoBox.append("h6")
            .style("font-weight", "bold")
            .text(`${keyValue[0]} : ${keyValue[1]}`);
        })
    })
}

// Create a function that will call that demographics function from the dropdown menu
function optionChanged(updatedSample) {
    chartCreation(updatedSample);
    demographics(updatedSample);
}

init();