var through = require("through")
var stream_graph = require("./index")
var initialize = require("./initialize")
var d3 = require("d3")
var existing = require('./stream-existing')


names = ['thing1']

d3.select("body").append("div").style("height", '300px').style("width", '800px').attr("id", "testDiv")

//initialize = initialize("#testDiv") //including width and height for now
//initialize(names, {span: ,86400000 update: 600000})


d3.json("./gistfile1.json", function(data){
  existing(data).pipe(
    stream_graph("#testDiv", 1000)(names)
    )
})



