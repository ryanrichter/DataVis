class HabitableBarchart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: 260,
        containerHeight: 300,
        margin: {top: 25, right: 20, bottom: 20, left: 40},
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
  
      vis.xScale = d3.scaleBand()
          .range([0, vis.width])
          .paddingInner(0.2)
          .paddingOuter(0.2);
  
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0]);
      
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(['Uninhabitable', 'Habitable'])
      vis.yAxis = d3.axisLeft(vis.yScale).ticks(4);
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart
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
      .text('Uninhabitable vs Habitable Exoplanets');
  
      
      vis.updateVis();
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;

      let orbsmax_array = []
      let startype_array = []
      let habitable_array = []
      let habitableCount = 0;
      let unhabitableCount = 0;

      for (let i = 0; i < vis.data.length; i++){
        if((vis.data[i].st_spectype.charAt(0) == 'A') || (vis.data[i].st_spectype.charAt(0) == 'F') 
        || (vis.data[i].st_spectype.charAt(0) == 'G') || (vis.data[i].st_spectype.charAt(0) == 'K') 
        || (vis.data[i].st_spectype.charAt(0) == 'M')){
          orbsmax_array.push(vis.data[i].pl_orbsmax);
          startype_array.push(vis.data[i].st_spectype.charAt(0));
        }
      }

      for(let j = 0; j < startype_array.length; j++){
        switch(startype_array[j]){
          case 'A':
            if (parseInt(orbsmax_array[j]) > 8.5 && parseInt(orbsmax_array[j]) < 12.5){
              habitable_array.push('Habitable')
              habitableCount += 1;
            }
            else{
              habitable_array.push('Uninhabitable')
              unhabitableCount += 1;
            }
            break;
          case 'F':
            if (parseInt(orbsmax_array[j]) > 1.5 && parseInt(orbsmax_array[j]) < 2.2){
              habitable_array.push('Habitable')
              habitableCount += 1;
            }
            else{
              habitable_array.push('Uninhabitable')
              unhabitableCount += 1;
            }
            break;
          case 'G':
            if (parseInt(orbsmax_array[j]) > 0.95 && parseInt(orbsmax_array[j]) < 1.4){
              habitable_array.push('Habitable')
              habitableCount += 1;
            }
            else{
              habitable_array.push('Uninhabitable')
              unhabitableCount += 1;
            }
            break;
          case 'K':
            if (parseInt(orbsmax_array[j]) > 0.38 && parseInt(orbsmax_array[j]) < 0.56){
              habitable_array.push('Habitable')
              habitableCount += 1;
            }
            else{
              habitable_array.push('Uninhabitable')
              unhabitableCount += 1;
            }
            break;
          case 'M':
            if (parseInt(orbsmax_array[j]) > 0.08 && parseInt(orbsmax_array[j]) < 0.12){
              habitable_array.push('Habitable')
              habitableCount += 1;
            }
            else{
              habitable_array.push('Uninhabitable')
              unhabitableCount += 1;
            }
            break;
        } 
      }

      vis.aggregatedData = [];
      vis.aggregatedData[0] = [];
      vis.aggregatedData[0]["key"] = "Uninhabitable";
      vis.aggregatedData[0]["count"] = unhabitableCount;
      vis.aggregatedData[1] = [];
      vis.aggregatedData[1]["key"] = "Habitable";
      vis.aggregatedData[1]["count"] = habitableCount;

      vis.xValue = d => d.key;
      vis.yValue = d => d.count;

      vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
      vis.yScale.domain([0, 1800]);
  
      vis.renderVis();
    }
  
    /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
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
        .attr('fill', '#4682b4')
  
      // Update the axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }