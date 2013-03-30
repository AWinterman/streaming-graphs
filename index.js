module.exports = streamgraph_factory
//can we talk about how cool javascript hoisting is? Man! Hoisting is cool.

var d3 = require('d3')
var initialize = require("./initialize")
var through = require('through')

function streamgraph_factory(target_element, offset){
  //:param target_element: gives d3 selector for the DOM element in which you would
  //                       like to create a streamgraph.
  //:param offset: the time offset in miliseconds,
  //               e.g. the lag in client and server in returning the newest
  //               data point. E.g. given a measurement coming in at time `t`,
  //               our best guess of the time the measurement was taken is `t -
  //               offset`
  return streamgraph

  function streamgraph(names, data) {
    //:param names: an array of names of layers in the streamgraph
    //
    //Ideally this would be the following 
    // :param data_details: object of with attributes {update, span, initial_data}
    //   :attr update: update the stream graphs every `update` milisecodns
    //   :attr span: the timedelta which the stream graph covers
    //   :attr data: data to start out with
    //
    //Actually is:
    //:param data: data with which to initialize the stream graph ('cause
    //             entering life with nothing is a hard start)

    var context = initialize(target_element)(names, data)
      //context also has the mapping elements, the container element, and the
      //computed area and stack layout objects
      , stream = through(write) 
      //a through stream. Will call `write` every time there's a data event,
      //which is a server side event. you'll have to talk to chrisdickinson
      //or the creater of the through module for moe information (or you know,
      //do your own research, hah!).
      , index_map = {}
      //index_map let's you easily get the index of the data array corresponding
      //to the name
      , raw_data = context.data

    return stream

    function write(obj) {
      var new_point
        , max_time = +new Date() - offset 

      for(var i = 0, len = names.length; i < len; ++i) {

        var name = names[i]
          , new_val = obj[name]

        index_map[name] = i
        //update the index map with info on this name
 
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

      //repeating myself: I carry out this same computation in a slightly more
      //efficient manner in initialize.js, maybe worth making a utils module
      //that exports an object to compute this? I suppose it could also be
      //returned out of initialize.js, but that seems like polution to me.
      var highest_value = raw_data.reduce(
          function(a,b){
            //need to do vectorized add
            return a.map(function(d,i){
              return context.y.accessor(d) +  context.y.accessor(b[i])
            })
          });

      //this gives the wrong bounds, currently, it gives the range of the largest
      //coordinate of any layer in the stream, not the full extent at which
      //data is plotted, which should probably start from 0
      context.y.scale.domain( d3.extent(highest_value, context.y.accessor))

      //x scale is the same across all layers
      context.x.scale.domain(d3.extent(raw_data[0], context.x.accessor))

      //updating area function
      //repeating myself here, as well, also do this work in initialize.js
      context.area.x(function(d) { return context.x.place(d) })
          .y0(function(d) { return context.y.scale(d.y0) })
          .y1(function(d) { return context.y.scale(d.y0 + d.y) })

      //updating streamdata:
      context.container.select(".streamGraph").selectAll("path")
                       .data(context.stack(raw_data))
                       .transition()
                       .duration(200)
                       .attr("d", function(d){
                          return context.area(d)
                       })
      //TODO axes
      //TODO figure out how to use smoothing without introducing the weird
      //behavior previously seen.
    }

    function trim(idx, span, max_time){
      //:param idx: index of the raw_data array holding holding the data you
      //            want to check
      //:param span: the time delta you want to display in which the data can live.
      //:max_time: the current maximum time.
      //
      //:side-effects: truncates data points with a timestamp outside of the
      //desired span from the front of the raw_data array.
      //:returns: the count of elements truncated.
      //
      //note that this assumes the data is in time sorted order.

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




