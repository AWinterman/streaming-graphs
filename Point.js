//this is currently not used but kind of seems like a good idea.
// a lot of the logic for creating new points happens both in initialize and in
// index. The BaseMapping should inherit from this
module.exports = Point

function Point(names){
  for (var i = 0, len = names.length; i < len; i++){
    this[names[i]] = null

  }
}

var cons = Point,
  , proto = cons.prototype
  , proto.constructor = cons


