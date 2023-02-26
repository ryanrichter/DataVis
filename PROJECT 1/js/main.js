let data, barchart;


/**
 * Load data from CSV file asynchronously and render area chart
 */
d3.csv('data/exoplanets_1.csv')
.then(data => {

  // Initialize scales
  const colorScale = d3.scaleOrdinal()
  .range(['#4682b4']) // steel blue
  .domain(['1','2','3','4']);

  data.forEach(d => {

    d.pl_orbsmax = +d.pl_orbsmax;
  })

  // Initialize and render stars bar chart
  starsbarchart = new StarsBarchart({
    parentElement: '#starsbarchart',
    colorScale: colorScale
  }, data);
  starsbarchart.updateVis();

  
  // Initialize and render planets bar chart
  planetsbarchart = new PlanetsBarchart({
    parentElement: '#planetsbarchart',
    colorScale: colorScale
  }, data);
  planetsbarchart.updateVis();

  // Initialize and render star type bar chart
  startypebarchart = new StarTypeBarchart({
    parentElement: '#startypebarchart',
    colorScale: colorScale
  }, data);
  startypebarchart.updateVis();

  // Initialize and render discovery type bar chart
  discoverytypebarchart = new DiscoveryTypeBarchart({
    parentElement: '#discoverytypebarchart',
    colorScale: colorScale
  }, data);
  discoverytypebarchart.updateVis();


  habitablebarchart = new HabitableBarchart({
    parentElement: '#habitablebarchart',
    colorScale: colorScale
  }, data);
  habitablebarchart.updateVis();

  distanceHistogram = new DistanceHistogram({
    parentElement: '#distancehistogram',
    colorScale: colorScale
  }, data);
  distanceHistogram.updateVis();

  scatterplot = new Scatterplot({
    parentElement: '#scatterplot',
    colorScale: colorScale
  }, data);
  scatterplot.updateVis();
  

  // Initialize and render discoveries line chart
  lineChart = new DiscoveriesLineChart({ parentElement: '#discoverieslinechart'}, data);
  lineChart.updateVis();
})
.catch(error => console.error(error));