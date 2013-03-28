module.exports = function(tableau, attributes){
  //attributes: is a list of object ltierals with the following attrs:
  //   source: element of data which must be mapped to the target
  //
  //   target: name of the target dimension, e.g. x-position, radius, etc.
  //
  //   *optional attributes*:
  //
  //  format:  mapping from data element to the domain of the
  //     data. E.g. function(d){ return parseInt(d) })
  //     defaults to the identity function
  //
  //  scale_type: a d3.scale object to use as the base scale. Defaults
  //      d3.scale.linear.
  //
  //tableau: an object literal with the following attributes:
  //   dimensions:  an object literal with thh one object for each unique
  //    attribute target
  //   padding:  [pixels of padding in x, pixels of padding in y]
  d3 = require("d3")
 
 
  //TODO: Refactor te following into a class
  //TODO: Handle discrete scales nicely, including drawing a legend
 
  return function(data){
   var base_mapping,
   mapping = {}
   //mapping will have an attribute for each element in the attributes
   //list
 
   for (var i = 0, len = attributes.length; i < len; ++i){
   add_to_mapping(attributes[i].target, i)
   }
 
   return mapping
   
 
   function add_to_mapping(target, i){
     var format = function(a){return a}
     format.parse = function(a){return a}
     
      
      base_mapping = { scale: null
          , axis: null
          , accessor: null
          , format: format
          , scale_type: d3.scale.linear()
          , container: null
          }
     // equivalent of mapping.x = base
     mapping[target] = base_mapping
 
 
     if (attributes[i].scale_type !== undefined) {
       mapping[target].scale_type = attributes[i].scale_type
     }
 
     if (attributes[i].format !== undefined) {
       mapping[target].format = attributes[i].format
     }
 
     // equivalent to: 
     // mapping.x.accessor = function(d){ return format.parse(d[time_attr]) }
     mapping[target].accessor = function(d){
       var out = mapping[target].format.parse( d[attributes[i].source] )
       return out
     }
 
 
     //equivalent to 
     // mapping.y.scale = d3.scale.linear()
     //  .domain([0, d3.max(data)], y.accessor)
     //  .range([tableau.dimension[1] - tableau.padding, tableau.padding])
 
     mapping[target].scale = mapping[target].scale_type
             .domain(d3.extent(data, mapping[target].accessor))
 
     if (tableau.dimension[target] !== undefined) {
       mapping[target].scale.range(tableau.dimension[target])
     }
 
     mapping[target].place = function(d){
       return mapping[target]
       .scale(mapping[target].accessor(d))
     }
 
     //equivalent to: 
     // mapping.x.axis = d3.svg.axis()
     //  .scale(x.scale)
     mapping[target].axis = d3.svg.axis().scale(mapping[target].scale)
     }
  }
}
