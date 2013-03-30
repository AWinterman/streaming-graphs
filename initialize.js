module.exports = initialize
//TODO Axes

var d3 = require("d3")
var BaseMapping = require("./BaseMapping")

function initialize(target_element){
  //code to initialize a streamgraph inside the target element
  return function(names, data){
      //names corresponds to the names of the layers in the stream graph.
     var container = d3.select(target_element)
        //get dimension of the container element (these will be in format of
        //"<number>px"
        //TODO add padding for the axes
      , dimension = [container.style("width"), container.style("height")]
      , stack = d3.layout.stack() //stack just computes coords (layout for the plot)
      , area = d3.svg.area() //computes SVG elements to draw on the DOM
      , update = data_and_details.update
      , time_domain  //limits of time
      , value_domain //limits of the values



    //convert dimensions to int
    dimension= dimension.map(function(d){ return + d.slice(0, -2) })

    //initialize x and y mapppings
    var x = new BaseMapping(d3.svg.axis(), d3.scale.linear(), function(d){ return d.time })
      , y = new BaseMapping(d3.svg.axis(), d3.scale.linear(), function(d){ return d.value })
      , color = new BaseMapping(null, d3.scale.category10(), function(d){return d})

    //can't specify much about color until we know what names we're dealing
    //with.

    //compute limits of time 
    time_domain = d3.extent(data[0], x.accessor)

    //compute limits of the value
    value_domain = [Infinity, -Infinity]
    for( i=0, len = data[0].length; i < len; i++ ){
      //find the max of all the i-th elements
      var s = d3.sum(data, function(d){return y.accessor(d[i])})
      var m = d3.min(data, function(d){return y.accessor(d[i])})
      if (s > value_domain[1]) value_domain[1] = s 
      if (m < value_domain[0]) value_domain[0] = m
    }


    // setting up y domain and range.
    y.scale.range([dimension[1], 0]) //because svg is measured from the top
           .domain(value_domain) 

    //setting up x domain and range
    x.scale.range([0, int_dimension[0]])
           .domain(time_domain)

    //now that we have scales, update the layout function:
    stack
      .offset('zero') //can change this to make a stream!
      //.order() can set order if this is desired.  I think this
      //should be in order of reverse magnitude, for some reasonable definition
      //of magnitude
      .x(x.accessor)
      .y(y.accessor)

    //stack returns an array of data. Each element of the returned
    //array has the same attributes as the original, with the addition of
    //attributes y and y0, which represent the computed coordinates for the
    //bottom and top of the stream

    area.x(function(d) { return x.place(d) })
        .y0(function(d) { return y.scale(d.y0) })
        .y1(function(d) { return y.scale(d.y0 + d.y) })

    container.append("svg")
             .attr("height", dimension[1])
             .attr("width", dimension[0])
            .append("g")
             .attr("class", "streamGraph")
             .selectAll("path")
             .data(stack(data))
            .enter()
             .append('path')
             .attr("class", "layer")
             .attr("d", function(d){
                return area(d)
             })
             .attr("fill", function(d, i){
               return color.place(i)
             })
             .attr("stroke", "black")

    //found the following function to be a little dangerous during testing --
    //easy to make errrors (meaning, an error I made) during testing caused it
    //to crash the browser by making an array million elements long. Million is
    //a big number

    function fill_data(idx){
      //figure out the last time for the data, if it exists
      for(end_time = time_domain[1],
            time = d3.max(data[idx], x.accessor) || time_domain[0];
             //time is either the largest element of data (if it exists), 
             //or simply the start of the time domain (if it doesn't)
          time < end_time;
          time = time + update){
        data[idx].push({time: time, value: 0})
      }
    }

    return { container: container.select("svg")
           , data: data
           , area: area
           , stack: stack
           , x: x
           , y: y}
    }

  }
