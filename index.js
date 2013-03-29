module.exports = streamgraph_factory

var d3 = require('d3')
var initialize = require("./initialize")
var through = require('through')
//streaming graph data:
//
//all the data streams are 
//
//api: 
//
//function which takes [names], time_interavl, returns through stream object
//
//side effects: for each name will make a layer, update every time interval.
//
//through stream data shape:
//


function streamgraph_factory(target_element, offset){
  //target element gives d3 selector for the DOM element in which you would
  //like to create a streamgraph, offset is the time offset in miliseconds,
  //e.g. the lag in client and server in returning the newest data point. E.g.
  //given a measurement coming in at time `t`,  our best guess of the time the
  //measurement was taken is `t - offset`
  return streamgraph

  function streamgraph(names, data_details) {
    //:param names: an array of names of layers in the streamgraph
    //:param data_details: object of type {update, span, initial_data}
    //  :attr update: update the stream graphs every `update` milisecodns
    //  :attr span: the timedelta which the stream graph covers
    //  :attr data_details: data to start out with

    var context = initialize(target_element)(names, data_details)
      , stream = through(write)
      , index_map = {} 
      //index_map let's you easily get the index of the data array corresponding
      //to the name
      , raw_data = context.data

    return stream

    function write(obj) {
      var new_point
        , max_time = +new Date() - offset 
      //stream_data = context.container.select(".streamGraph").selectAll("layer").data()

      for(var i = 0, len = names.length; i < len; ++i) {

        var name = names[i]
          , new_val = obj[name]

        index_map[name] = i

        //so in order to push new_val onto the data array, I need to know if there
        //already is an array for the object. So let's make a shallow copy of the data bound
        //to the stream object. We know 

        //make sure we actually got a value
        new_point = {value: null, time: max_time}
        if (new_val!== undefined || new_val !== null){
          new_point.value = new_val
        }
        else {
          //otherwise use the last one if it exists. If there are no values,
          //default to 0 for this timestep

          if (raw_data[index_map[name]].length){
            new_point.value = raw_data[index_map[name]].slice(-1)[0]
          }
          else {
            new_point.value = 0
          }
        }


        raw_data[index_map[name]].push(new_point) 
        //now trim
        trim(index_map[name], data_details.span, max_time)

      }

      //now the raw_data has been updated appropriately.
      //update the scales based on the new data

      //repeating myself
      var highest_value = raw_data.reduce(
          function(a,b){
            //need to do vectorized add
            return a.map(function(d,i){
              return context.y.accessor(d) +  context.y.accessor(b[i])
            })
          });
      //console.log(d3.extent(highest_value, context.y.accessor))

      context.y.scale.domain( d3.extent(highest_value, context.y.accessor))

      //x scale is the same across all layers
      context.x.scale.domain(d3.extent(raw_data[0], context.x.accessor))
      

      //y scale is the sum of all the counts in raw_data

      
      //console.log(context.y.scale(5500))


      //updating area function
      //repeating myself here
      context.area.x(function(d) { return context.x.place(d) })
          .y0(function(d) { return context.y.scale(d.y0) })
          .y1(function(d) { return context.y.scale(d.y0 + d.y) })

      //updating streamdata:
      //TODO splice together old and new data in a way that makes the
      //transition nice
      context.container.select(".streamGraph").selectAll("path")
                       .data(context.stack(raw_data))
                       .transition()
                       .duration(100)
                       .attr("d", function(d){
                          return context.area(d)
                       })
      //TODO axis
      //recompute the layout
      //transition to new data
    }

    function trim(idx, span, max_time){
      //just returns whether or not there is an data point outside of the span 
      obj = raw_data[0][raw_data[0].length-1]
      start_from = 0
      for (i = 0, len = raw_data[idx].length; i < len; ++i){
        if (raw_data[idx][i] < max_time - span){
          start_from += 1
        }
        else {
          break
        }
      }
      raw_data[idx] = raw_data[idx].splice(start_from)
      return start_from //return the index, might need that again.
    }
  }
}




