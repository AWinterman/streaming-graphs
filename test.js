var through = require("through")
//var stream = require("./index")
var initialize = require("./initialize")
var d3 = require("d3")


names = ['thing1', 'thing2', 'thing3']

d3.select("body").append("div").style("height", '800px').style("width", '800px').attr("id", "testDiv")

initialize = initialize("#testDiv") //including width and height for now
initialize(names, {span: 86400000, update: 600000})



