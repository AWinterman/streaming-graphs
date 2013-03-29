var through = require("through")
var stream_graph = require("./index")
var initialize = require("./initialize")
var d3 = require("d3")
var existing = require('./stream-existing')


names = ['thing1']

d3.select("body").append("div").style("height", '300px').style("width", '800px').attr("id", "testDiv")

initialize = initialize("#testDiv") //including width and height for now


d3.json("./example_data.json", function(data){
  
  initialize(names, {span: data.length, update: 1, data:[data.slice(0,100)]})
  /*existing(data).pipe(
    stream_graph("#testDiv", 1000)(names, {span: 86400000, update: 600000})
    )*/
})



