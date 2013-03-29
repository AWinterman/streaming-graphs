module.exports = initialize

var d3 = require("d3")
var BaseMapping = require("./BaseMapping")

function initialize(target_element){

  return function(names, data_and_details){
     var container = d3.select(target_element)
      , dimension = [container.style("width"), container.style("height")]
      , int_dimension = dimension.map(function(d){ return + d.slice(0, -2) })
      , stack = d3.layout.stack() //stack just computes coords
      , area = d3.svg.area() //draws on the DOM
      , update = data_and_details.update
      , span = data_and_details.span
      , data = data_and_details.data
      , time_domain = [+new Date() - span, +new Date()] //limits of time
      , value_domain

    //initialize x and y mapppings
    var x = new BaseMapping(d3.svg.axis(), d3.scale.linear(), function(d){ return d.time })
        y = new BaseMapping(d3.svg.axis(), d3.scale.linear(), function(d){ return d.value })

    if (data === undefined) data = d3.range(names.length).map(function(x){return []}) 
    if (span && update){
      for (var i = 0, len = names.length; i < len; ++i){
        fill_data(i)
      }
    }

    //define scale functions:
    x.scale.range([0, int_dimension[0]])
           .domain(time_domain)

    value_domain = d3.extent(data, y.accessor)
                     .map(function(d, i){
                       return d === undefined ? i : d;
                     })

    y.scale.range([dimension[1], 0]) //because svg is measured from the top
           .domain(value_domain)

    //now that we have scales, update the layout function:
    stack
      .offset('zero')
      //.order()
      .x(x.accessor)
      .y(y.accessor)
   
    //stack returns data that will be an array. Each element of the returned
    //array has the same attributes as the original, with the addition of
    //elements y and y0

    area.x(function(d) { return x.place(d) })
        .y0(function(d) { return y.scale(d.y0) })
        .y1(function(d) { return y.scale(d.y0 + d.y) })
        
    container.append("svg")
             .attr("class", "streamGraph")
             .attr("height", dimension[1])
             .attr("width", dimension[0])
            .append("g")
             .selectAll("path")
             .data(stack(data))
            .enter()
            //probably want to add some sort of class here
             .append('path')
             .attr("d", function(d){
                return area(d)
             })
    
    function fill_data(idx){
      //figure out the last time for the data, if it exists
      for( end_time = time_domain[1],
             time = d3.max(data[idx], x.accessor) || time_domain[0];
             //time is either the largest element of data (if it exists), 
             //or simply the start of the time domain (if it doesn't)
           time < end_time;
           time = time + update){
        //so need to make add a {time: <time>, value: <value>}
        data[idx].push({time: time, value: 0})
      }
    }
    return container.select("g")
  }
}
