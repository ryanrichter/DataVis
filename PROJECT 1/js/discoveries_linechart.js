class DiscoveriesLineChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 400,
        containerHeight: _config.containerHeight || 300,
        margin: _config.margin || {top: 25, right: 30, bottom: 30, left: 50}
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
      let vis = this;
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.xScale = d3.scaleTime()
          .range([0, vis.width]);
  
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0])
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .ticks(8)
          .tickSizeOuter(0)
          .tickPadding(10)
          .tickFormat(d3.format('d'));
  
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(4)
          .tickSizeOuter(0)
          .tickPadding(10);
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart (see margin convention)
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
        .text("# of Exoplanet Discoveries by Year");
  
      // We need to make sure that the tracking area is on top of other chart elements
      vis.marks = vis.chart.append('g');
      vis.trackingArea = vis.chart.append('rect')
          .attr('width', vis.width)
          .attr('height', vis.height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all');
  
          //(event,d) => {
  
      // Empty tooltip group (hidden by default)
      vis.tooltip = vis.chart.append('g')
          .attr('class', 'tooltip')
          .style('display', 'none');
  
      vis.tooltip.append('circle')
          .attr('r', 4);
  
      vis.tooltip.append('text');
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;
      
      // Prepare data: count number of stars for each exoplanet
      const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d.disc_year);
      vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

      const orderedKeys = [];
      let startYear = 1992;
      while (startYear <= 2023) {
        orderedKeys.push(parseInt(startYear))
        startYear += 1
      }

      vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
      return a.key - b.key;
      });

      const orderedValues = [];
      for (let i = 0; i < vis.aggregatedData.length; i++){
        vis.aggregatedData[i].key = parseInt(vis.aggregatedData[i].key)
      }

      for (let i = 0; i < vis.aggregatedData.length; i++){
        orderedValues.push(vis.aggregatedData[i].count)
      }

      // Specificy accessor functions
      vis.xValue = d => d.key;
      vis.yValue = d => d.count;
  
      vis.line = d3.line()
          .x(d => vis.xScale(vis.xValue(d)))
          .y(d => vis.yScale(vis.yValue(d)));


      // Set the scale input domains
      vis.xScale.domain(d3.extent(orderedKeys));
      vis.yScale.domain([0, d3.max(orderedValues)]);
  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
  
      // Add line path
      vis.marks.selectAll('.chart-line')
          .data([vis.aggregatedData])
        .join('path')
          .attr('class', 'chart-line')
          .attr('d', vis.line);
      
      // Update the axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }