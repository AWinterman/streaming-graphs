module.exports = streamgraph

var d3 = require('d3')
var inititialize = require("./initialize")
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

  function streamgraph(names, update, span, initial_data) {
    //:param names: an array of names of layers in the streamgraph
    //:param update: update the stream graphs every `update` milisecodns
    //:param span: the timedelta which the stream graph covers


    var data_details = {span: span, update: update, data: initial_data},
      , context = initialize(target_element)(names, data_details)
      , stream = through(write)
      , index_map = {} 
      //index_map let's you easily get the index of the data array corresponding
      //to the name
      , stream_data = context.container.select("g").data()
      , raw_data = context.data

    return stream

    function write(obj) {
      var new_point
        , max_time = +new Date() - offset 
      stream_data = context.container.select(".streamGraph").data()

      for(var i = 0, len = names.length; i < len; ++i) {
        var new_val = obj[names[i]]
        index_map[names[i]] = i

        //so in order to push new_val onto the data array, I need to know if there
        //already is an array for the object. So let's make a shallow copy of the data bound
        //to the stream object. We know 

        //make sure we actually got a value
        if (new_val!== undefined or new_val !== null){
          new_point = new_val
        }
        else {
          //otherwise use the last one if it exists. If there are no values,
          //default to 0 for this timestep

          if (raw_data[index_map[name]].length){
            new_point = raw_data[index_map[name]].slice(-1))
          }
          else {
            new_point = 0
          }
        }

        raw_data[index_map[name]].push(new_point) 
        //now trim
        trim(idx, span)
      }
      //now the raw_data has been updated appropriately.

      //update the scales based on the new data
      context.y.domain = d3.range(raw_data, context.y.accessor)
      context.x.domain = [max_time - span, max_time]


      //updating area function
      //repeating myself here
      area.x(function(d) { return x.place(d) })
          .y0(function(d) { return y.scale(d.y0) })
          .y1(function(d) { return y.scale(d.y0 + d.y) })

      //updating streamdata:
      //TODO splice together old and new data in a way that makes the
      //transition nice

      context.container.select(".streamGraph").data(context.stack(raw_data)).attr("d", area)


      //TODO axis

      //recompute the layout

      //transition to new data
    }

    function trim(idx, span){
      //just returns whether or not there is an data point outside of the span 
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




