//run all the things!
var through = require("through")
var stream_graph = require("./index")
var initialize = require("./initialize")
var d3 = require("d3")
var existing = require('./stream-existing')


names = ['thing1']

d3.select("body").append("div").style("height", '300px').style("width", '800px').attr("id", "testDiv")

initialize = initialize("#testDiv") //including width and height for now


d3.json("./gistfile1.json", function(data){
  
  //initialize(names, {span: data.length, update: 1, data:[data.slice(0,100)]})
  //
  //
  var Data = data.slice(0, 10).map(
    function(d,i){
          return {value: d.count, time: +new Date() - i * 1000}
   })

  existing(data.slice(10)).pipe(
    stream_graph("#testDiv", 1000)(names, [Data])
    )
})



