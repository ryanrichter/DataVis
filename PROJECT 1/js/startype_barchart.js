class StarTypeBarchart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      colorScale: _config.colorScale,
      containerWidth: _config.containerWidth || 260,
      containerHeight: _config.containerHeight || 320,
      margin: _config.margin || {top: 25, right: 20, bottom: 40, left: 40},
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales and axes
    
    // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
        .range(['#4682b4']) // steel blue
        .domain(['A','F','G','K','M']);
    
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]) 

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(['A','F','G','K','M'])
        .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(7)
        .tickSizeOuter(0)

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append axis title
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '.71em')
        .text('Star Types by Exoplanet');

        // Append axis title
    vis.svg.append('text')
      .attr('class', 'source')
      .attr('x', 5)
      .attr('y', 310)
      .attr('dy', '.71em')
      .text('https://en.wikipedia.org/wiki/Stellar_classification');
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    // Prepare data: count number of stars for each exoplanet
    const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d.st_spectype.charAt(0).toUpperCase());
    vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

    const orderedKeys = ['A','F','G','K','M'];
    vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
      return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
    });

    let popValue = true;
    for(let i = 0; i < this.aggregatedData.length; i++){
      for(let j = 0; j < orderedKeys.length; j++){
        if (this.aggregatedData[i].key == orderedKeys[j]){
          popValue = false;
        }
      }
      if (popValue == true){
        const index = this.aggregatedData[i].key
        this.aggregatedData.splice(index, 1);
      }
    }

    this.aggregatedData.shift()
    this.aggregatedData.shift()
    this.aggregatedData.shift()

    vis.aggregatedData.sort((a,b) => d3.descending(a.count, b.count));

    // Specificy accessor functions
    vis.colorValue = d => d.key;
    vis.xValue = d => d.key;
    vis.yValue = d => d.count;

    // Set the scale input domains
    vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
    vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add rectangles
    const bars = vis.chart.selectAll('.bar')
        .data(vis.aggregatedData, vis.xValue)
      .join('rect')
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('fill', d => vis.colorScale(vis.colorValue(d)));

    // Update axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}