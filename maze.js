var vimg = document.getElementById("vimg");

var width = 20;
var height = 20;
var maze = [];
var size = 20;
//initialize walls code
var makeTemp = function(width, height, block_h, block_w){
  for (i = 0; i < width; i++){
    maze.push([])
    for (j = 0; j < height; j++){
      var block = document.createElementNS("http://www.w3.org/2000/svg","rect");
      block.setAttribute("x", i*block_h);
      block.setAttribute("y", j*block_w);
      block.setAttribute("width", block_h);
      block.setAttribute("height", block_w);
      block.setAttribute("fill", "#ff0000");


      //top
      var wall_1 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_1.setAttribute("x1",i*block_h);
      wall_1.setAttribute("x2",(i+1)*block_h);
      wall_1.setAttribute("y1",j*block_w);
      wall_1.setAttribute("y2",j*block_w);

      //bot
      var wall_2 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_2.setAttribute("x1",i*block_h);
      wall_2.setAttribute("x2",(i+1)*block_h);
      wall_2.setAttribute("y1",(j+1)*block_w);
      wall_2.setAttribute("y2",(j+1)*block_w);

      //left
      var wall_3 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_3.setAttribute("x1",i*block_h);
      wall_3.setAttribute("x2",i*block_h);
      wall_3.setAttribute("y1",j*block_w);
      wall_3.setAttribute("y2",(j+1)*block_w);

      //right
      var wall_4 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_4.setAttribute("x1",(i+1)*block_h);
      wall_4.setAttribute("x2",(i+1)*block_h);
      wall_4.setAttribute("y1",j*block_w);
      wall_4.setAttribute("y2",(j+1)*block_w);

      vimg.appendChild(block);
      vimg.appendChild(wall_1);
      vimg.appendChild(wall_2);
      vimg.appendChild(wall_3);
      vimg.appendChild(wall_4);

      maze[i].push({"block":block,
                    "wall_1":wall_1,
                    "wall_2":wall_2,
                    "wall_3":wall_3,
                    "wall_4":wall_4});
    }
  }
}

//actually make walls
makeTemp(width, height, size, size);

/*
//randomize start and end
var start_i = Math.floor(Math.random()*(width-2))+1
var end_i = Math.floor(Math.random()*(width-2))+1
var start = maze[0][start_i];
var end = maze[width-1][end_i];
start.setAttribute("fill","white");
end.setAttribute("fill","white");
*/


//returns array of neighboring blocks
var getNeighbors = function(block_x, block_y){
    neighbors = [];
    if (block_x+1 <= width-1){
      neighbors.push(maze[block_x+1][block_y]);
    }
    if (block_x-1 >= 0){
      console.log(block_x,block_y);
      console.log(maze[block_x-1][block_y]);
      neighbors.push(maze[block_x-1][block_y]);
    }
    if (block_y+1 <= width-1){
      neighbors.push(maze[block_x][block_y+1]);
    }
    if (block_y-1 >= 0){
      neighbors.push(maze[block_x][block_y-1]);
    }
    return neighbors;
}
//console.log(getNeighbors(0,0));

//returns array of unvisited neighboring blocks
var getUVN = function(neighbors){
  uvn = [];
  for (i = 0; i < neighbors.length; i++){
    //console.log(neighbors);
    if (neighbors[i]["block"].getAttribute("fill") != "white"){
      uvn.push(neighbors[i]);
    }
  }
  return uvn;
}

//returns true if there exists an unvisited neighboring block,
//returns false, otherwise
var hasUVN = function(neighbors){
    for (i = 0; i < neighbors.length; i++){
      if (neighbors[i]["block"].getAttribute("fill") != "white"){
        return true;
      }
    }
    return false;
}

var stack = [];
var start_x = Math.floor(Math.random()*(width-2))+1
var start_y = Math.floor(Math.random()*(width-2))+1

var makePath = function(block_x, block_y){
  neighbors = getNeighbors(block_x, block_y);
  uvn = getUVN(neighbors);
  if (!hasUVN(neighbors)){
    console.log(1);
    return true;
  } else if (hasUVN(neighbors)){
    var curr = maze[block_x][block_y];
    curr["block"].setAttribute("fill","white");

    rand_num = Math.floor(Math.random()*uvn.length);
    uvn[rand_num]["block"].setAttribute("fill", "white");
    stack.push(uvn[rand_num]);
    for (n in curr){
      for (u in uvn){
        if (n == u){
          vimg.removeChild(n);
          vimg.removeChild(u);
        }
      }
    }

    console.log()
    return makePath(uvn[rand_num]["block"].getAttribute("x")/size, uvn[rand_num]["block"].getAttribute("y")/size);

  } else if (stack != []){
    return makePath(stack.pop());
  }
}
console.log(maze[0][0]);
makePath(start_x, start_y)
