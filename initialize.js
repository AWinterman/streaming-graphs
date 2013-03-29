module.exports = initialize
//TODO Axes

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
      , time_domain  //limits of time
      , value_domain

    //initialize x and y mapppings
    var x = new BaseMapping(d3.svg.axis(), d3.scale.linear(), function(d){ return d.time })
      , y = new BaseMapping(d3.svg.axis(), d3.scale.linear(), function(d){ return d.value })
      , color = new BaseMapping(null, d3.scale.category10(), function(d){return d})

    //can't specify much about color until we know what names we're dealing
    //with.


    //define scale functions:

    //repeating myself
    //This is apparently too memory intense:
    //so instead compute the max at each interval
    time_domain = d3.extent(data[0], x.accessor)
    value_domain = [Infinity, -Infinity]
    for( i=0, len = data[0].length; i < len; i++ ){
      //find the max of all the i-th elements
      var s = d3.sum(data, function(d){return y.accessor(d[i])})
      var m = d3.min(data, function(d){return y.accessor(d[i])})
      if (s > value_domain[1]) value_domain[1] = s 
      if (m < value_domain[0]) value_domain[0] = m
    }

    value_domain = [min, max]
    y.scale.range([dimension[1], 0]) //because svg is measured from the top
           .domain(value_domain)


    x.scale.range([0, int_dimension[0]])
           .domain(time_domain)

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

    var stack_data = stack(data)
    console.log(stack_data)
    
         
     container.append("svg")
             .attr("height", dimension[1])
             .attr("width", dimension[0])
            .append("g")
             .attr("class", "streamGraph")
             .selectAll("path")
             .data(stack_data)
            .enter()
            //probably want to add some sort of class here
             .append('path')
             .attr("class", "layer")
             .attr("d", function(d){
                return area(d)
             })
             .attr("fill", function(d, i){
               return color.place(i)
             })
             .attr("stroke", "black")

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

  
    //I think I need to return the element with the data on it, and everything
    //I need to call the enxt element.
    return { container: container.select("svg")
           , data: data
           , area: area
           , stack: stack
           , x: x
           , y: y}
    }

  }
