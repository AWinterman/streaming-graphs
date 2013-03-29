d3 = require('d3');
init = require("./initialize")

// pertinent SO question: http://stackoverflow.com/questions/9664642/d3-real-time-streamgraph-graph-data-visualization

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

module.exports = streamgraph

var through = require('through')

function streamgraph(names, update, span) {
  //:param names: an array of names of layers in the streamgraph
  //:param update: update the stream graphs every `update` milisecodns
  //:param span: the timedelta which the stream graph covers

  var stream = through(write)
    , index_map = {} 
    //index_map let's you easily get the index of the data array corresponding
    //to the name
    , stream_data

  return stream

  function write(obj) {

    stream_data = d3.select(target_element + ".streamGraph").data()
    for(var i = 0, len = names.length; i < len; ++i) {
      index_map[names[i]] = i
      var newval = obj[names[i]]

      //so in order to push newval onto the data array, I need to know if there
      //already is an array for the object. So let's make a shallow copy of the data bound
      //to the stream object. We know 

      stream_data[index_map[name]].push(newval)
      //if the beginning time is less than the newval - span, pop if off the
      //beginning
      if ( exceeds_span(stream_data[index_map[name]], span) ) {
        remove_from_beginning(stream_data)
      }

      }

      stream.data().push(newval)
      stream.data.unshift()
    }
  }

}



