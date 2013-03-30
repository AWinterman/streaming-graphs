fs = require("fs")
//TODO make this take a command line arg. Is that even possible?

fs.readFile(data_address, "utf-8", function(err, data){
  console.log(data)
  var Data  = JSON.parse(data).map(function(d,i){
          return {value: d.count, time: i}
   })
  fs.writeFile("example_data.json",  JSON.stringify(Data))
})

