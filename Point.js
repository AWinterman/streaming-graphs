//this is currently not used but kind of seems like a good idea.
// a lot of the logic for creating new points happens both in initialize and in
// index. The BaseMapping should inherit from this

module.exports = Point

function Point(names){
  for (var i = 0, len = names.length; i < len; i++){
    //should have an attribute for each name in the data array
    //should aid in (1) validating and (2) constructing data arrays
    //so maybe it should take an optional array paramter. If given it would
    //construct an object with those elements common to each element of the
    //array? I don't know if I can be this smart.
    this[names[i]] = null
  }
}

var cons = Point,
  , proto = cons.prototype
  , proto.constructor = cons

//I would like to define constructors for mappings here.
//so you initialize the point, and it automatically tries to construct the
//appropriate scale type. If you give it an array of data points, maybe it
//looks to see if the values are categorical or continuous, and does the right
//thing.

