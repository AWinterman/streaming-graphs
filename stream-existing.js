//a simple module which takes a data array and streams it via a through object.
//Pretty snazzy if you ask me
//
//TODO make this export a factory which takes `interval` as a param, allowing
//the client to set the interval at which data should be emitted

//usage:
//stream_existing(through_object())
var through = require('through')

module.exports = stream_existing

function stream_existing(data, ttl) {
  var out = through()
    , idx = 0

  setInterval(write, 500)
  return out

  function write() {
    if(idx === data.length) {
      out.queue(null)
      return
    }

    out.queue({'thing1': data[idx++].count})
  }
}
