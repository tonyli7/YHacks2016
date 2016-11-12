var vimg = document.getElementById("vimg");

var width = 10;
var height = 10;
var maze = [];


var makeWalls = function(width, height, block_h, block_w){
  for (i = 0; i < width; i++){
    maze.push([])
    for (j = 0; j < height; j++){
      var block = document.createElementNS("http://www.w3.org/2000/svg","rect");
      block.setAttribute("x", i*block_h)
      block.setAttribute("y", j*block_w)
      block.setAttribute("width", block_h)
      block.setAttribute("height", block_w)
      block.setAttribute("fill", "#ff0000")
      block.setAttribute("stroke", "black")

      vimg.appendChild(block);
      console.log(block);
      maze[i].push(block);
    }
  }
}

makeWalls(width, height, 20, 20);
console.log(maze);
