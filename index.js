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


function streamgraph_factory(target_element){
  function streamgraph(names, update, span, initial_data) {
    //:param names: an array of names of layers in the streamgraph
    //:param update: update the stream graphs every `update` milisecodns
    //:param span: the timedelta which the stream graph covers


    var data_details = {span: span, update: update, data: initial_data},
      , stream_element = initialize(target_element)(names, data_details)
      , stream = through(write)
      , index_map = {} 
      //index_map let's you easily get the index of the data array corresponding
      //to the name
      , stream_data = stream_element.data()

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
        if ( exceeds_span(stream_data[index_map[names[i]]], span) ) {
          remove_from_beginning(index_map[names[i]], span)
        }
      }
    }

    function exceeds_span(idx, span){
      //just returns whether or not there is an data point outside of the span 
        }

    function remove_from_beginning(idx, span){
      //side effectful function that cuts elements from stream_data (defined in
      //enclosing scope) which do not fall into the time span

  }
}




