
module.exports = initialize

function initialize_factory(target_element, width, height, padding){

  return function(names, initial_data, update, span){
    //so we have real time data.
    //so any empty data element should be filled with the last seen element
    //initialize them to 0 for each element of the current span that isn't
    //represented in the span

    var container = d3.select(target_element)
      , stack = d3.layout.stack()
      , base = {axis: null, scale: null}
      , mapping = {}

     (initial_data === undefined) && data = d3.range(names.length).map(function(x){return []}) 
    mappin.x = mapping.y = base
   
    container.append("svg")
             .attr("class", "streamGraph")
             .attr("width", width + padding)
             .attr("height", height + padding)
             .append("g")

  }
}

