//defines a base object which handles all the information around mapping from
//the data space to the screen space

module.exports = BaseMapping

d3 = require('d3')

function BaseMapping(axis, scale, accessor){
      this.axis = axis
      this.scale = scale 
      this.accessor = accessor
    }

var cons = BaseMapping
  , proto = cons.prototype

proto.constructor = cons

proto.place = function(data_point){
  //maps the data point into the screen space
  return this.scale(this.accessor(data_point))
}

