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
