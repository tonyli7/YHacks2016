var vimg = document.getElementById("vimg");
//var wimg = document.getElementById("wimg");

//=========================================Maze Code==================================
var width = 20;
var height = 20;
var maze = [];
var maze2 = [];
var size = 14;
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
      wall_1.setAttribute("stroke", "black");

      //bot
      var wall_2 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_2.setAttribute("x1",i*block_h);
      wall_2.setAttribute("x2",(i+1)*block_h);
      wall_2.setAttribute("y1",(j+1)*block_w);
      wall_2.setAttribute("y2",(j+1)*block_w);
      wall_2.setAttribute("stroke", "black");

      //left
      var wall_3 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_3.setAttribute("x1",i*block_h);
      wall_3.setAttribute("x2",i*block_h);
      wall_3.setAttribute("y1",j*block_w);
      wall_3.setAttribute("y2",(j+1)*block_w);
      wall_3.setAttribute("stroke", "black");

      //right
      var wall_4 = document.createElementNS("http://www.w3.org/2000/svg","line");
      wall_4.setAttribute("x1",(i+1)*block_h);
      wall_4.setAttribute("x2",(i+1)*block_h);
      wall_4.setAttribute("y1",j*block_w);
      wall_4.setAttribute("y2",(j+1)*block_w);
      wall_4.setAttribute("stroke", "black");

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


//returns array of neighboring blocks
var getNeighbors = function(block_x, block_y){
    neighbors = [];
    if (block_x+1 <= width-1){
      neighbors.push(maze[block_x+1][block_y]);
    }
    if (block_x-1 >= 0){

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

//return true if there exists an unvisited block
var existsUVC = function(){
  for (i = 0; i < maze.length; i++){
    for (j = 0; j < maze[i].length; j++){

      if (maze[i][j]["block"].getAttribute("fill") == "#ff0000"){

        return true;
      }
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
  var curr = maze[block_x][block_y];
  curr["block"].setAttribute("fill","white");
  if (hasUVN(neighbors)){

      rand_num = Math.floor(Math.random()*uvn.length);

      stack.push(uvn[rand_num]);


      //remove walls
      for (var curr_key in curr){
        for (var uvn_key in uvn[rand_num]){
          if (curr.hasOwnProperty(curr_key) &&
              uvn[rand_num].hasOwnProperty(uvn_key)){
              if ((curr[curr_key].getAttribute("x1") == uvn[rand_num][uvn_key].getAttribute("x1")) &&
                  (curr[curr_key].getAttribute("x2") == uvn[rand_num][uvn_key].getAttribute("x2")) &&
                  (curr[curr_key].getAttribute("y1") == uvn[rand_num][uvn_key].getAttribute("y1")) &&
                  (curr[curr_key].getAttribute("y2") == uvn[rand_num][uvn_key].getAttribute("y2")) &&
                  curr_key != "block"){


                    vimg.removeChild(curr[curr_key]);
                    delete maze[parseInt((curr["block"].getAttribute("x")))/size][parseInt((curr["block"].getAttribute("y")))/size][curr_key];
                    vimg.removeChild(maze[parseInt((uvn[rand_num]["block"].getAttribute("x")))/size][parseInt((uvn[rand_num]["block"].getAttribute("y")))/size][uvn_key]);
                    delete maze[parseInt((uvn[rand_num]["block"].getAttribute("x")))/size][parseInt((uvn[rand_num]["block"].getAttribute("y")))/size][uvn_key];

          }

        }
      }
    }
    return makePath(uvn[rand_num]["block"].getAttribute("x")/size, uvn[rand_num]["block"].getAttribute("y")/size);

    } else if (stack.length != 0){

      var temp = stack.pop()["block"];
      var temp_x = temp.getAttribute("x")/size;
      var temp_y = temp.getAttribute("y")/size;


      return makePath(temp_x, temp_y);

    }

}


// while(existsUVC){
//   makePath(start_x, start_y);
// }

makePath(start_x, start_y);


var end = document.createElementNS("http://www.w3.org/2000/svg","text");
end.textContent = "END"
end.setAttribute("x", width*size - size/2)
end.setAttribute("y", height*size - size/2)
end.setAttribute("font-size", 8)
end.setAttribute("fill","red")
vimg.appendChild(end);

//make second copy
var maze2 = maze;
for (i = 0; i < maze2.length; i++){
  console.log(maze2[i])
  for (j = 0; j < maze2[i].length; j++){
    for (var key in maze2[i][j]){

        if (key == "block"){
          var block = document.createElementNS("http://www.w3.org/2000/svg","rect");
          block.setAttribute("x", parseInt(maze2[i][j][key].getAttribute("x")));
          block.setAttribute("y", parseInt(maze2[i][j][key].getAttribute("y")) + height*size + 30);
          block.setAttribute("fill", maze2[i][j][key].getAttribute("fill"));
          block.setAttribute("width", maze2[i][j][key].getAttribute("width"));
          block.setAttribute("height", maze2[i][j][key].getAttribute("height"));
          vimg.appendChild(block);
        }else{
          var wall = document.createElementNS("http://www.w3.org/2000/svg","line");
          wall.setAttribute("x1", parseInt(maze2[i][j][key].getAttribute("x1")));
          wall.setAttribute("y1", parseInt(maze2[i][j][key].getAttribute("y1")) + height*size + 30);
          wall.setAttribute("x2", parseInt(maze2[i][j][key].getAttribute("x2")));
          wall.setAttribute("y2", parseInt(maze2[i][j][key].getAttribute("y2")) + height*size + 30);
          wall.setAttribute("stroke", maze2[i][j][key].getAttribute("stroke"));
          vimg.appendChild(wall);
        }

    }
  }
}

var end2 = document.createElementNS("http://www.w3.org/2000/svg","text");
end2.textContent = "END"
end2.setAttribute("x", width*size - size/2)
end2.setAttribute("y", height*size - size/2 + height*size + 30)
end2.setAttribute("font-size", 8)
end2.setAttribute("fill", "green")
vimg.appendChild(end2);
//============================================Player Code==========================================================================================

var player = document.createElementNS("http://www.w3.org/2000/svg","circle");
player.setAttribute("cx", size/2)
player.setAttribute("cy", size/2)
player.setAttribute("r", size/4)

vimg.appendChild(player);

var player2 = document.createElementNS("http://www.w3.org/2000/svg","circle");
player2.setAttribute("cx", size/2)
player2.setAttribute("cy", size/2 + height*size + 30)
player2.setAttribute("r", size/4)

vimg.appendChild(player2);

var trail = [{"dir": "none",
              "line": "dummy"}];

var trail2 = [{"dir": "none",
              "line": "dummy"}];

var isIn = function(block_x, block_y, wall){
  //console.log(maze[block_x][block_y]);
  for (var key in maze[block_x][block_y]){
    console.log("key",key);
    if (wall == key){
      return true;
    }
  }
  return false;
}


var upkeydown = false;
var downkeydown = false;
var leftkeydown = false;
var rightkeydown = false;

var wkeydown = false;//87
var skeydown = false;//83
var akeydown = false;//65
var dkeydown = false;//68

document.onkeydown = function(e){
    //console.log(keydown);
    console.log(trail[trail.length-1]["line"]);
    if(e.keyCode==37){
      if (!leftkeydown){
        leftkeydown = true;
        console.log("left")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "red")
        var prevX = parseInt(player.getAttribute("cx"));
        var prevY = parseInt(player.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2

        var leftWall = isIn(block_x/size, block_y/size, "wall_3");
        if (!leftWall){

          player.setAttribute("cx", prevX - size);

          if (trail[trail.length-1]["dir"] == "right"){

            vimg.removeChild(trail[trail.length-1]["line"])
            trail.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX - size);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY);


            vimg.appendChild(trace);

            trail.push({"dir":"left",
                        "line": trace})
          }

        }
      }
    }
    if(e.keyCode==38){
      if (!upkeydown){
        upkeydown = true;
        console.log("up")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "red")
        var prevX = parseInt(player.getAttribute("cx"));
        var prevY = parseInt(player.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2

        var topWall = isIn(block_x/size, block_y/size, "wall_1");
        if (!topWall){
          //console.log("maze[block_x][block_y]", maze[block_x][block_y]["wall_1"]);

          player.setAttribute("cy", prevY - size);

          if (trail[trail.length-1]["dir"] == "down"){

            vimg.removeChild(trail[trail.length-1]["line"])
            trail.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY - size);

            vimg.appendChild(trace);

            trail.push({"dir":"up",
                        "line": trace})
          }
        }
      }
    }
    if(e.keyCode==39){
      if (!rightkeydown){
        rightkeydown = true;
        console.log("right")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "red")

        var prevX = parseInt(player.getAttribute("cx"));
        var prevY = parseInt(player.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2

        var rightWall = isIn(block_x/size, block_y/size, "wall_4");
        if (!rightWall){

          player.setAttribute("cx", prevX + size);
          if (trail[trail.length-1]["dir"] == "left"){

            vimg.removeChild(trail[trail.length-1]["line"])
            trail.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX + size);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY);

            vimg.appendChild(trace);

            trail.push({"dir":"right",
                        "line": trace})
          }
        }
      }

    }
    if(e.keyCode==40){
      if (!downkeydown){
        downkeydown = true;
        console.log("down")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "red")

        var prevX = parseInt(player.getAttribute("cx"));
        var prevY = parseInt(player.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2

        var botWall = isIn(block_x/size, block_y/size, "wall_2");

        if (!botWall){
          player.setAttribute("cy", prevY + size);

          if (trail[trail.length-1]["dir"] == "up"){

            vimg.removeChild(trail[trail.length-1]["line"])
            trail.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY + size);

            vimg.appendChild(trace);

            trail.push({"dir":"down",
                        "line": trace})
          }
        }
      }
    }
    if(e.keyCode==65){
      if (!akeydown){
        akeydown = true;
        console.log("left")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "green")
        var prevX = parseInt(player2.getAttribute("cx"));
        var prevY = parseInt(player2.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2-height*size-30

        var leftWall = isIn(block_x/size, block_y/size, "wall_3");
        if (!leftWall){

          player2.setAttribute("cx", prevX - size);

          if (trail2[trail2.length-1]["dir"] == "right"){

            vimg.removeChild(trail2[trail2.length-1]["line"])
            trail2.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX - size);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY);


            vimg.appendChild(trace);

            trail2.push({"dir":"left",
                        "line": trace})
          }

        }
      }
    }
    if(e.keyCode==87){
      if (!wkeydown){
        wkeydown = true;
        console.log("up")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "green")
        var prevX = parseInt(player2.getAttribute("cx"));
        var prevY = parseInt(player2.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2-height*size-30

        var topWall = isIn(block_x/size, block_y/size, "wall_1");
        if (!topWall){
          //console.log("maze[block_x][block_y]", maze[block_x][block_y]["wall_1"]);

          player2.setAttribute("cy", prevY - size);

          if (trail2[trail2.length-1]["dir"] == "down"){

            vimg.removeChild(trail2[trail2.length-1]["line"])
            trail2.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY - size);

            vimg.appendChild(trace);

            trail2.push({"dir":"up",
                        "line": trace})
          }
        }
      }
    }
    if(e.keyCode==68){
      if (!dkeydown){
        dkeydown = true;
        console.log("right")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "green")

        var prevX = parseInt(player2.getAttribute("cx"));
        var prevY = parseInt(player2.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2-height*size-30

        var rightWall = isIn(block_x/size, block_y/size, "wall_4");
        if (!rightWall){

          player2.setAttribute("cx", prevX + size);
          if (trail2[trail2.length-1]["dir"] == "left"){

            vimg.removeChild(trail2[trail2.length-1]["line"])
            trail2.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX + size);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY);

            vimg.appendChild(trace);

            trail2.push({"dir":"right",
                        "line": trace})
          }
        }
      }

    }
    if(e.keyCode==83){
      if (!skeydown){
        skeydown = true;
        console.log("down")

        var trace = document.createElementNS("http://www.w3.org/2000/svg","line");
        trace.setAttribute("stroke", "green")

        var prevX = parseInt(player2.getAttribute("cx"));
        var prevY = parseInt(player2.getAttribute("cy"));

        var block_x = prevX-size/2
        var block_y = prevY-size/2-height*size-30

        var botWall = isIn(block_x/size, block_y/size, "wall_2");

        if (!botWall){
          player2.setAttribute("cy", prevY + size);

          if (trail2[trail2.length-1]["dir"] == "up"){

            vimg.removeChild(trail2[trail2.length-1]["line"])
            trail2.pop();
          }else{
            trace.setAttribute("x1", prevX);
            trace.setAttribute("x2", prevX);
            trace.setAttribute("y1", prevY);
            trace.setAttribute("y2", prevY + size);

            vimg.appendChild(trace);

            trail2.push({"dir":"down",
                        "line": trace})
          }
        }
      }
    }
}

document.onkeyup = function(e){

    leftkeydown = false;
    upkeydown = false;
    rightkeydown = false;
    downkeydown = false;

    wkeydown = false;//87
    skeydown = false;//83
    akeydown = false;//65
    dkeydown = false;//68

}


var intervalID;

// var d = new Date();
var win1 = false;
var win2 = false;
var time = function(){
  var p1 = document.getElementById("p1_time")

  if (!win1){
    p1.innerHTML = parseInt(p1.innerHTML)+1+" sec"
  }
  var p2 = document.getElementById("p2_time")
  if (!win2){
    p2.innerHTML = parseInt(p2.innerHTML)+1+" sec"
  }


  if (player.getAttribute("cx") == end.getAttribute("x") &&
      player.getAttribute("cy") == end.getAttribute("y")){
        //clearInterval(intervalID);

        var winner = document.getElementById("winner")
        if (!win2){
            winner.innerHTML = "Player 1 Wins!";
        }

        win1 = true;
  }
  else if(player2.getAttribute("cx") == end2.getAttribute("x") &&
          player2.getAttribute("cy") == end2.getAttribute("y")){

        //clearInterval(intervalID);
        var winner = document.getElementById("winner")
        if (!win1){
            winner.innerHTML = "Player 2 Wins!";
        }

        win2 = true;

  }
}




intervalID = setInterval(time,1000);
