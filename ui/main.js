var number_of_robots = 0;
var number_of_fields = 9;
var field_line_height = 18;
var single_robot_string = false;
var ws;
var current_robot_list = [];
var selected_robots = [];
var data_timeout = 1000;
var removal_timeout = 100000000000;
var pozyx_x_max = 3946;
var pozyx_y_max = 2854;
var canvas_flag_active = false;
var canvas_flag_position = {x:undefined,y:undefined};
var current_coordinate_list = [];
var number_of_coordinates = 0;
var current_clusters = [];
var current_sinks = [];
var current_channels = [];
var current_sources = [];
var manual_control = false;

function submitTextWaypoint() {
  var key = window.event.keyCode;
  var canvas = document.querySelector('#canvas');
  if(key == 13) {
    number_of_coordinates++;
    var x_actual = document.querySelector('#textarea-x').value;
    var y_actual = document.querySelector('#textarea-y').value;
    document.querySelector('#textarea-x').value = "";
    document.querySelector('#textarea-y').value = ""
    document.querySelector('#textarea-x').blur();
    document.querySelector('#textarea-y').blur();
    var x = Math.round((x_actual * canvas.width) / pozyx_x_max);
    var y = Math.round(((pozyx_y_max - y_actual) * canvas.height) / pozyx_y_max);
    current_coordinate_list.push({x:x,x_actual:x_actual,y:y,y_actual:y_actual});
    var coordinates = document.createElement('div');
    coordinates.innerHTML = `Waypoint ${number_of_coordinates}: [ ${x_actual} , ${y_actual} ] [ ${x} , ${y} ]`;
    coordinates.classList.add('coordinates');
    var parent = document.getElementById('coordinates-list-actual');
    parent.insertBefore(coordinates,parent.firstChild);
    if(document.querySelector('#waypoints-button').style.display != 'inline' && selected_robots.length > 0)
      document.querySelector('#waypoints-button').style.display = 'inline';
    drawRobots();
  }
}
/* set the canvas' size once the page has loaded (js gets executed afterward) */
setCanvasDimensions();
/* adjust canvas size if window is resized */
window.onresize = setCanvasDimensions;
/* toggles the shown content of a div dropdown */
function toggleDropdown(dropdown) {
  document.getElementById(dropdown).classList.toggle("show");
}
/* removes all currently timed out robot cards */
function removeDisconnected() {
  current_robot_list.forEach((robot) => {
    if(robot.status === 'Disconnected') {
      removeRobot(robot);
    }
  });
  drawRobots();
}
/* if a robot has been set to be in a cluster, it removes it */
function removeRobotFromCluster(robot) {
  for(var i = 0; i < current_clusters[robot.cluster].length; i++) {
    if( current_clusters[robot.cluster].robotNumber === robot.robotNumber) {
       current_clusters[robot.cluster].splice(i,1);
    }
  }
}
/* adjusts the cluster dropdown accordingly, pushes all robots in a cluster to an array */ 
function setDropdown(dropdown,option) {
  document.getElementById(dropdown).innerHTML = option;
  var clstr = [];
  selected_robots.forEach((robot) => {
    /* we have specified that the robot is not in a cluster with the dropdown */
    if(robot.configuration === 'Cluster') {
      if(option != 'Cluster') {
        removeRobotFromCluster(robot);
      }
    }
    /* set the new configuration option */
    robot.configuration = option;
    /* add to list of clusters if the configuration is a cluster */
    if(option === 'Cluster') {
      robot.cluster = current_clusters.length;
      clstr.push(robot);
    }
  })
  if(option === 'Cluster')
    current_clusters.push(clstr);
}
/* if we click on the dropdown */
window.onclick = function(event) {
  /* if we clicked on the button, show all the content */
  if (!event.target.matches('.dropbtn')) {
    document.querySelectorAll('.dropdown-content').forEach((dropdown) => {
      if(dropdown.classList.contains('show'))
        dropdown.classList.remove('show')
    });
  }
}
/* function to recognize key events */
document.addEventListener('keydown', function(e) {
  /* if escape is pressed, we deactivate the waypoint flag, and unselect any selected robots */
  if(e.key === 'Escape' || e.keyCode === 27) {
    if(canvas_flag_active) {
      escapeFlag();
    } else if(!canvas_flag_active && selected_robots.length > 0) {
      unselectAll();
      drawRobots();
    } else {
      
    }
  /* we remove the last active waypoint */
  } else if(e.key === 'Backspace' || e.keyCode == 8) {
    if(document.activeElement.id != "textarea-x" && document.activeElement.id != "textarea-y") {
      removeLastWaypoint();
    }
  } else if(e.key === 'f' || e.keyCode === 70) {
    var canvas = document.getElementById('canvas');
    canvas.addEventListener('mousemove', showFlag);
    canvas_flag_active = true;
  } else if(e.key === 'm') {
    // if(manual_control)
    //   manual_control = false;
    // else
    //   manual_control = true;
  } else if(manual_control && e.key === 'ArrowUp') {
    controlRobots('u');
  } else if(manual_control && e.key === 'ArrowDown') {
    controlRobots('d');
  } else if(manual_control && e.key === 'ArrowLeft') {
    controlRobots('l');
  } else if(manual_control && e.key === 'ArrowRight') {
    controlRobots('r');
  } else {
    // console.log(e.key, e.keyCode);
  }
});
function controlRobots(key) {
  selected_robots.forEach((robot) => {
    if(key === 'u') {
      var vars = [];
      vars.push(`${robot.robotNumber}`);
      vars.push(` dd`);
      vars.push(` 0`);
      vars.push(` ${robot.x}`);
      var y = parseInt(robot.y) + 20;
      if(y > pozyx_y_max)
        y = 0;
      else if(y < 0)
        y = pozyx_y_max - 1;
      vars.push(` ${y}`);
      vars.push(` 0`);
      vars.push(` 0`);
      vars.push(` ${robot.heading}`);
      updateRobot(vars);
    } else if(key === 'd') {
      var vars = [];
      vars.push(`${robot.robotNumber}`);
      vars.push(` dd`);
      vars.push(` 0`);
      vars.push(` ${robot.x}`);
      var y = parseInt(robot.y) - 20;
      if(y > pozyx_y_max)
        y = 0;
      else if(y < 0)
        y = pozyx_y_max - 1;
      vars.push(` ${y}`);
      vars.push(` 0`);
      vars.push(` 0`);
      vars.push(` ${robot.heading}`);
      updateRobot(vars);
    } else if(key === 'l') {
      var vars = [];
      vars.push(`${robot.robotNumber}`);
      vars.push(` dd`);
      vars.push(` 0`);
      var x = parseInt(robot.x) - 20;
      if(x > pozyx_x_max)
        x = 0;
      else if(x < 0)
        x = pozyx_x_max - 1;
      vars.push(` ${x}`);
      vars.push(` ${robot.y}`);
      vars.push(` 0`);
      vars.push(` 0`);
      vars.push(` ${robot.heading}`);
      updateRobot(vars);
    } else if(key === 'r') {
      var vars = [];
      vars.push(`${robot.robotNumber}`);
      vars.push(` dd`);
      vars.push(` 0`);
      var x = parseInt(robot.x) + 20;
      if(x > pozyx_x_max)
        x = 0;
      else if(x < 0)
        x = pozyx_x_max - 1;
      vars.push(` ${x}`);
      vars.push(` ${robot.y}`);
      vars.push(` 0`);
      vars.push(` 0`);
      vars.push(` ${robot.heading}`);
      updateRobot(vars);
    }
  });
}
/* reset the background on the robot cards, reset outline of robots on canvas, empty selected robots array */
function unselectAll() {
  resetAllStrokes();
  resetAllBackgrounds();
  selected_robots = [];
}
/* send waypoints over websocket */
function sendWaypoints() {
  for(var i = 0; i < current_coordinate_list.length; i++) {
    selected_robots.forEach((robot) => {
      var send_string = `robot_${robot.robotNumber} w ${current_coordinate_list[i].x_actual} ${current_coordinate_list[i].y_actual}`;
      ws.send(send_string);
      send_string = `robot_${robot.robotNumber} s ${i+1} ${current_coordinate_list[i].x_actual} ${current_coordinate_list[i].y_actual}`;
      ws.send(send_string);
      console.log(send_string);
    });
  }
}
/* removes the little flag that accompanies the cursor when it's active */
function escapeFlag() {
  canvas.removeEventListener('mousemove', showFlag);
  canvas_flag_active = false;
  canvas_flag_position = {x:undefined,y:undefined};
}
/* removes the last active waypoint from both the canvas, and the waypoints container */
function removeLastWaypoint() {
  if(number_of_coordinates > 0) {
    number_of_coordinates--;
    if(number_of_coordinates == 0) {
      document.querySelector('#waypoints-button').style.display = 'none';
    }
    current_coordinate_list = current_coordinate_list.slice(0,-1);
    document.querySelector('#coordinates-list-actual').removeChild(document.querySelector('#coordinates-list-actual > div'));
  }
}
/* removes all waypoints, both from the container and canvas, currently unused */
function removeAllWaypoints() {
  if(!canvas_flag_active) {
    number_of_coordinates = 0;
    current_coordinate_list = [];
    canvas_flag_position = {x:undefined,y:undefined};
    var coordinates = document.querySelectorAll('#coordinates-list > div');
    coordinates.forEach((coordinate) => {
      document.querySelector('#coordinates-list').removeChild(coordinate);
    });
  }
}
/* original flag style, currently unused */
function actualFlag(x,y) {
  var ctx = canvas.getContext('2d');
  ctx.lineTo(x+21,y+22);
  ctx.lineTo(x+28,y+22);
  ctx.lineTo(x+28,y+25);
  ctx.lineTo(x+12,y+25);
  ctx.lineTo(x+12,y+22);
  ctx.lineTo(x+19,y+22);
  ctx.lineTo(x+19,y+8);
  ctx.lineTo(x+12,y+4);
  ctx.lineTo(x+21,y+0);
}
/* alternate flag style */
function alternateFlag(x,y) {
  var ctx = canvas.getContext('2d');
  ctx.lineTo(x+21,y+25);
  ctx.lineTo(x+19,y+25);
  ctx.lineTo(x+19,y+12);
  ctx.lineTo(x+8,y+8);
  ctx.lineTo(x+21,y+0);
}
/* draws the flag on the canvas at x,y and includes a counter i */
function drawFlag(x,y,i) {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFFFFF'
    ctx.font = "10px Arial"
    if(i)
      ctx.fillText(i.toString(),x+27,y+27);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.fillStyle = '#FF0000';
    ctx.strokeStyle = '#FFFFFF'
    ctx.moveTo(x+21,y+0);
    alternateFlag(x,y);
    ctx.closePath()
    ctx.stroke();
    ctx.fill();
  }
}
/* draw all currently active flags at their respective locations on the canvas */
function drawFlags() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  for(var i = 0; i < number_of_coordinates; i++) {
    if(i > 0) {
      context.setLineDash([5]);
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = '#FFFFFF';
      context.moveTo(current_coordinate_list[i].x,current_coordinate_list[i].y);
      context.lineTo(current_coordinate_list[i-1].x,current_coordinate_list[i-1].y);
      context.stroke();
      context.setLineDash([]);
    }
  }
  for(var i = 0; i < number_of_coordinates; i++) {
    drawFlag(current_coordinate_list[i].x-20,current_coordinate_list[i].y-35,i+1);
  }
}
/* connects selected robots together with a line, also shows central point */
function connectSelected() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
  var mid_x = undefined;
  var mid_y = undefined;
  context.setLineDash([5]);
  if(selected_robots.length > 1) {
    mid_x = 0;
    mid_y = 0;
    for(var i = 1; i < selected_robots.length; i++) {
      var current_x = Math.round((selected_robots[i].x / pozyx_x_max) * width);
      var current_y = Math.floor(height - ((selected_robots[i].y / pozyx_y_max) * height));
      var prev_x = Math.round((selected_robots[i-1].x / pozyx_x_max) * width);
      var prev_y = Math.floor(height - ((selected_robots[i-1].y / pozyx_y_max) * height));
      mid_x += prev_x;
      mid_y += prev_y;
      if(i === (selected_robots.length - 1)) {
        mid_x += current_x;
        mid_y += current_y;
      }
      context.beginPath();
      context.lineWidth = 3;
      context.strokeStyle = '#0000FF';
      context.moveTo(current_x,current_y);
      context.lineTo(prev_x,prev_y);
      context.stroke();
      if((i === (selected_robots.length - 1)) && selected_robots.length != 2) {
        var prev_x = Math.round((selected_robots[0].x / pozyx_x_max) * width);
        var prev_y = Math.floor(height - ((selected_robots[0].y / pozyx_y_max) * height));
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = '#0000FF';
        context.moveTo(current_x,current_y);
        context.lineTo(prev_x,prev_y);
        context.stroke();
      }
    }
    mid_x /= i;
    mid_y /= i;
    context.moveTo(mid_x, mid_y);
    context.setLineDash([]);
    context.fillStyle = '#FFFF00';
    context.arc(mid_x, mid_y, 5, 0, 2 * Math.PI);
    context.fill();
  }
  context.setLineDash([]);
}
/* sends a request message to dataturbine for sources, sinks, and channels */
function requestDT() {
  if(ws.readyState == 1) {
    ws.send('requestDTconfig()');
    console.log('Requesting channels and sinks from DataTurbine...');
  } else {
    window.alert('Not connected to server.');
  }
}
function reconDT() {
  controller_name = document.querySelector('#controllers-button').innerHTML;
  robot_name = document.querySelector('#robots-button').innerHTML;
  reconfigureDT(robot_name,controller_name);
}
/* sends reconfigured settings to dataturbine */
function reconfigureDT(sinkName,chanName) {
  if(ws.readyState == 1) {
    ws.send('reconfSink2Chan(' + sinkName + ', ' + chanName + ')');
    console.log('Sending updated configuration to DataTurbine.');
  } else {
    window.alert('Not connected to server.');
  }
}
/* parses info received from datatubine for sources, sinks, channels, sets dropdown accordingly */
function setDT(message) {
  message = message.substring(10);
  var m = message.split(',');
  current_channels = [];
  current_sinks = [];
  current_sources = [];
  document.querySelectorAll('#controllers-dropdown>div').forEach((element) => {
    if(element.innerHTML != 'Waypoints')
      document.querySelector('#controllers-dropdown').removeChild(element);
  });
  document.querySelectorAll('#robots-dropdown>div').forEach((element) => {
    document.querySelector('#robots-dropdown').removeChild(element);
  });
  m.forEach((msg) => {
    console.log(msg.trim());
    if(msg.includes('Channel') && msg.length > 0) {
      console.log(msg);
      var msg = msg.split(' ')[0];
      current_channels.push(msg);
      if(!msg.includes('robot')) { /* controller */
        var non_duplicate = true;
        try {
          document.querySelectorAll('#controllers-dropdown>div').forEach((element) => {
            if(elemnent.innerHTML === msg) {
              non_duplicate = false;
            }
          });
        } catch(e) {}
        if(non_duplicate) {
          var parent = document.querySelector('#controllers-dropdown');
          var child = document.createElement('div');
          child.addEventListener('click', function() {
            setDropdown('controllers-button', msg);
          });
          child.innerHTML = msg;
          parent.appendChild(child);
        }
      } else { /* robot */
        msg = msg.split('-');
        console.log(msg);
        var non_duplicate = true;
        try {
          document.querySelectorAll('#robots-dropdown>div').forEach((element) => {
            if(elemnent.innerHTML === msg) {
              non_duplicate = false;
            }
          });
        } catch(e) {};
        if(non_duplicate) {
          var parent = document.querySelector('#robots-dropdown');
          var child = document.createElement('div');
          child.addEventListener('click', function() {
            setDropdown('robots-button', msg);
          });
          child.innerHTML = msg;
          parent.appendChild(child);
        }
      }
    } else if(msg.includes('Sink')) {
      var msg = msg.split(' ')[0];
      current_sinks.push(msg);
    } else if(msg.includes('Source')) {
      var msg = msg.split(' ')[0];
      current_sources.push(msg);
    } else {}
  });
}
/* sets the robot card fields to 0 */
function resetValues(r) {
  r.values.forEach((value,i) => {
    if(r.fields[i]!='Robot ID')
      value.innerHTML = '0';
  });
}
function drawCornerFlag() {
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  var canvas_container = document.getElementById('canvas-container');
  var width = canvas_container.offsetWidth;
  var height = canvas_container.offsetHeight;
  context.beginPath();
  context.lineWidth=2;
  context.rect(width-50,10,40,40);
  context.strokeStyle = '#FFFFFF';
  context.stroke();
}
function drawGrid() {
  
}
/* draws all active robots on the canvas */
function drawRobots() {
  var bound_x = pozyx_x_max;
  var bound_y = pozyx_y_max;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var canvas_container = document.getElementById('canvas-container');
  var width = canvas_container.offsetWidth;
  var height = canvas_container.offsetHeight;
  context.clearRect(0, 0, width, height);
  drawFlag(width-48,18);
  if(canvas_flag_active) {
    drawFlag(canvas_flag_position.x,canvas_flag_position.y);
  }
  drawFlags();
  connectSelected();
  current_robot_list.forEach((robot) => {
    context.beginPath();
    var current_x = Math.round((robot.x / bound_x) * width);
    var current_y = Math.floor(height - ((robot.y / bound_y) * height));
    context.lineWidth = 3;
    context.arc(current_x, current_y, robot.radius, 0, 2 * Math.PI);
    context.moveTo(current_x, current_y);
    context.lineTo(current_x + ((robot.radius) * Math.cos(2*Math.PI - robot.heading)),current_y + ((robot.radius) * Math.sin(2*Math.PI - robot.heading)));
    context.strokeStyle = robot.color_stroke;
    context.fillStyle = robot.color_fill;
    context.fill();
    context.stroke();
    drawCornerFlag();
  });
}
window.setInterval(drawRobots, 50);
/* sets the canvas dimensions */
function setCanvasDimensions() {
  var canvas = document.getElementById('canvas');
  var width = window.innerWidth * 0.73408;
  var height = window.innerHeight * 0.58378;
  canvas.width = width;
  canvas.height = height;
}
/* generates a random number number between low and high, used in color generation for robots */
function generateRandom(low,high) {
    return Math.random() * (high - low) + low;
}
/* creates a robot object with the array of variables supplied in the argument */
function createRobot(vars) {
  var r_f = Math.round(generateRandom(0,255));
  var g_f = Math.round(generateRandom(0,255));
  var b_f = Math.round(generateRandom(0,255));
  var r_s = Math.round(generateRandom(0,255));
  var g_s = Math.round(generateRandom(0,255));
  var b_s = Math.round(generateRandom(0,255));
  var fill_color = `rgb(${r_f}, ${g_f}, ${b_f})`;
  var stroke_color = `rgb(${r_s}, ${g_s}, ${b_s})`;
  var robot = {
    fields: [],
    values: [],
    robotNumber: undefined,
    timeRemainingDisconnect: 0,
    timeRemainingRemoval: 0,
    status:'Connected',
    x: undefined,
    y: undefined,
    heading: 0, /* radians */
    radius: 15,
    color_fill: fill_color,
    color_stroke: '#FFFFFF',
    configuration: 'Single',
    controller: 'Waypoint',
    cluster: undefined
  };
  for(var i = 0; i < number_of_fields; i++) {
    var current_field = document.createElement('div');
    current_field.classList.add('display-field');
    current_field.classList.add('robot_item-' + vars[0]);
    current_field.classList.add('unselectable');
    var val_id;
    /* sets the robot card fields */
    switch(i) {
      case 0:
        current_field.innerHTML = 'Robot ID';   val_id = 'robot_id';   break;
      case 1:
        current_field.innerHTML = 'Type';       val_id = 'type';       break;
      case 2:
        current_field.innerHTML = 'Color';      val_id = 'color';      break;
      case 3:
        current_field.innerHTML = 'Position X'; val_id = 'position_x'; break;
      case 4:
        current_field.innerHTML = 'Position Y'; val_id = 'position_y'; break;
      case 5:
        current_field.innerHTML = 'Position Z'; val_id = 'position_z'; break;
      case 6:
        current_field.innerHTML = 'Velocity';   val_id = 'velocity';   break;
      case 7:
        current_field.innerHTML = 'Heading';    val_id = 'heading';    break;
      case 8:
        current_field.innerHTML = 'Status';     val_id = 'status';     break;
      default:
        current_field.innerHTML = 'N/A'; break;
    }
    var current_value = document.createElement('div');
    current_value.classList.add('display-value');
    current_value.classList.add('robot_item-' + vars[0]);
    current_value.classList.add('unselectable');
    if(val_id === 'status') {
      current_value.classList.add('status-connected');
      current_value.innerHTML = robot.status;
    } else if(val_id === 'color') {
      current_value.style.backgroundColor = fill_color;
    } else {
      current_value.innerHTML = vars[i];
    }
    robot.fields.push(current_field);
    robot.values.push(current_value);
  }
  robot.robotNumber = parseInt(robot.values[0].innerHTML);
  return robot;
}
/* handles robot timeout */
function timer(r) {
  clearTimeout(r.timeRemainingDisconnect);
  clearTimeout(r.timeRemainingRemoval);
  r.timeRemainingDisconnect = setTimeout(() => {
    r.status = 'Disconnected';
    r.values[number_of_fields-1].innerHTML = r.status;
    r.values[number_of_fields-1].classList.remove('status-connected');
    r.values[number_of_fields-1].classList.add('status-disconnected');
  }, data_timeout);
  r.timeRemainingRemoval = setTimeout(() => {
    removeRobot(r);
  }, removal_timeout);
}
/* updates existing robots with provided variables, otherwise creates them */
function updateRobot(vars) {
  var add_robot_flag = true;
  if(vars.length < 8) { // probably no velocity, so we pad
    vars[7] = vars[6];
    vars[6] = 0;
  }
  if(current_robot_list.length) {
    for(var i = 0; i < current_robot_list.length; i++) {
      if(current_robot_list[i].values[0].innerHTML == vars[0]) {
        add_robot_flag = false;
        for(var j = 0; j < number_of_fields; j++) {
          if(current_robot_list[i].fields[j].innerHTML === 'Status') {
            current_robot_list[i].status = 'Connected';
            current_robot_list[i].values[j].innerHTML = current_robot_list[i ].status;
            current_robot_list[i].values[j].classList.remove('status-disconnected');
            current_robot_list[i].values[j].classList.add('status-connected');
          } else if(current_robot_list[i].fields[j].innerHTML === 'Position X') {
            current_robot_list[i].x = vars[j];
            current_robot_list[i].values[j].innerHTML = vars[j];
          } else if(current_robot_list[i].fields[j].innerHTML === 'Position Y') {
            current_robot_list[i].y = vars[j];
            current_robot_list[i].values[j].innerHTML = vars[j];
          } else if(current_robot_list[i].fields[j].innerHTML === 'Heading') {
            current_robot_list[i].heading = parseFloat(vars[j]);
            current_robot_list[i].values[j].innerHTML = Math.round(((parseFloat(vars[j])) * 180 / Math.PI) * 100)/100;
          } else if(current_robot_list[i].fields[j].innerHTML === 'Color') {
            
          } else {
             current_robot_list[i].values[j].innerHTML = vars[j];
          }
        }
        timer(current_robot_list[i]);
      }
    }
    drawRobots();
    if(add_robot_flag) {
      addRobot(createRobot(vars));
    }
  } else {
    addRobot(createRobot(vars));
  }
}
/* parses message received from websocket */
var number_of_messages = 0;
function checkMessage(m) {
  console.log(++number_of_messages);
  if(m.includes('DTConfig: ')) {
    console.log('Received channels and sinks from DataTurbine.');
    setDT(m);
  } else if(m.includes('Source') || m.includes('Sink') || m.includes('Channel')) {
    setDT(m);
  } else if(manual_control == false && m.includes('robot_')) {
    var robots_ = m.split(';');
    robots_.forEach((message) => {
      if(message.length > 0) {
        var robot_vars = message.split(',');
        robot_vars[0] = message.split(',')[0].slice(6);
        updateRobot(robot_vars);
      }
    });
    // var robot_id = m.split(',')[0].slice(6).split('-')[0];
    // var robot_vars = m.split(';')[0].split(',');
    // robot_vars[0] = robot_id;
    // updateRobot(robot_vars);
  } else {
    // console.log(m);
  }
}
/* adds a new robot card */
function addRobot(r) {
  number_of_robots += 1;
  var container = document.getElementById('robot-item-container');
  var rc = document.createElement('div');
  rc.style.height = (((number_of_fields + 1) * field_line_height) + 2 )+ 'px';
  rc.id = 'rc-' + r.robotNumber;
  rc.classList.add('robot-item-div');
  rc.classList.add('robot-item-' + r.robotNumber);
  rc.addEventListener('mousedown', displaySettings);
  var cap = document.createElement('div');
  cap.id = 'cap-' + r.robotNumber
  cap.classList.add('robot-item-caption');
  cap.classList.add('robot-item-' + r.robotNumber);
  cap.classList.add('unselectable');
  cap.innerHTML = 'Robot ' + r.values[0].innerHTML;
  var field_flex_container = document.createElement('div');
  field_flex_container.id = 'robot_item_field_flex_container-' + r.robotNumber;
  field_flex_container.classList.add('field-flex-container');
  field_flex_container.classList.add('robot-item-' + r.robotNumber);
  var value_flex_container = document.createElement('div');
  value_flex_container.id = 'robot_item_value_flex_container-' + r.robotNumber;
  value_flex_container.classList.add('value-flex-container');
  value_flex_container.classList.add('robot-item-' + r.robotNumber);
  rc.appendChild(cap);
  rc.appendChild(field_flex_container);
  rc.appendChild(value_flex_container);
  for(var i = 0; i < number_of_fields; i++) {
    field_flex_container.appendChild(r.fields[i]);
    value_flex_container.appendChild(r.values[i]);
  }
  current_robot_list.push(r);
  container.appendChild(rc);
  timer(r);
  
}
/* removes a robot */
function removeRobot(r) {
  if(r.configuration === 'Cluster') {
    removeRobotFromCluster(r);
  }
  number_of_robots--;
  for(var i = 0; i < current_robot_list.length; i++) {
    if(r.robotNumber === current_robot_list[i].robotNumber) {
      current_robot_list.splice(i,1);
    } 
  }
  r.fields[0].parentElement.parentElement.parentElement.removeChild(document.getElementById('rc-' + r.robotNumber));
}
/* sets robot card background color, canvas robot outline color, brings up cluster information */
function displaySettings(event, id, graphics) {
  if(current_coordinate_list.length > 0)
    document.getElementById('waypoints-button').style.display = 'block';
  
  var rnumber = 0;
  var container;
  var selection_flag = false;
  if(id) {
    rnumber = id
  }
  current_robot_list.forEach((robot) => {
    if(!graphics)
      rnumber = this.id.slice(this.id.indexOf('-')+1)
    if(robot.robotNumber == rnumber) {
      if(robot.color_stroke != '#00FF00') {
        if(!event.shiftKey)
          resetAllStrokes();
        robot.color_stroke = '#00FF00';
      } else {
        resetAllStrokes();
        robot.color_stroke = '#00FF00';
      }
      if(robot.configuration === 'Cluster') {
        if(!event.shiftKey) {
          selected_robots = [];
          resetAllStrokes();
          resetAllBackgrounds();
        }
        current_clusters[robot.cluster].forEach((robot) => {
          selected_robots.push(robot);
          robot.color_stroke = '#0000FF';
          document.getElementById('rc-'+robot.robotNumber).style.backgroundColor = 'rgb(24, 24, 24)';
          selection_flag = true;
        });
      } else {
        selected_robots.push(robot);
      }
      document.getElementById('configuration-button').style.display = 'block';
      document.getElementById('configuration-button').innerHTML = robot.configuration;
      drawRobots();
    }
  });
  if(!selection_flag) {
    if(!graphics)
      container = this;
    else
      container = document.getElementById('rc-'+id);
    if(container.style.backgroundColor != 'rgb(24, 24, 24)') {
      if(!event.shiftKey)
        resetAllBackgrounds();
      container.style.backgroundColor = 'rgb(24, 24, 24)';
    } else {
      resetAllBackgrounds()
      container.style.backgroundColor = 'rgb(24, 24, 24)';
    }
  }
  if(current_coordinate_list.length > 0)
    document.querySelector('#waypoints-button').style.display = 'inline';
}
/* resets the background color of the robot cards */
function resetAllBackgrounds() {
  document.querySelectorAll('.robot-item-div').forEach((robot_item) => {
     robot_item.style.backgroundColor = 'rgb(34, 34, 34)'; 
  });
}
/* gets the mouse position relative to the canvas */
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
/* sets the flag to follow the cursor */
function showFlag(evt) {
  var pos = getMousePos(canvas, evt);
    canvas_flag_position.x = pos.x - 20;
    canvas_flag_position.y = pos.y - 27;
    drawFlag(pos.x - 20,pos.y - 27);
  canvas_flag_active = true;
}
/* resets the outline of the robots on the canvas */
function resetAllStrokes() {
  document.getElementById('waypoints-button').style.display = 'none';
  selected_robots = [];
  document.getElementById('configuration-button').style.display = 'none';
  current_robot_list.forEach((robot) => {
    robot.color_stroke = '#FFFFFF';
  });
}
/* creates a new websocket */
ws = new WebSocket("ws://127.0.0.1:9002/");
/* listen to clicks on canvas, determine if robot was clicked */
document.getElementById('canvas').addEventListener('mousedown', function canvasClick(e) {
  var canvas = document.getElementById('canvas')
  var canvas_coord = canvas.getBoundingClientRect();
  var x = parseInt(e.clientX) - parseInt(canvas_coord.left);
  var y = (canvas_coord.bottom - canvas_coord.top) - (parseInt(e.clientY) - parseInt(canvas_coord.top));
  x_actual = Math.round((x / canvas.width) * pozyx_x_max);
  y_actual = Math.round((y / canvas.height) * pozyx_y_max);
  var canvas_container = document.getElementById('canvas-container');
  var width = canvas_container.offsetWidth;
  var height = canvas_container.offsetHeight;
  var shiftFlag = false;
  var onRobot = false;
  /* flag box */
  if((x > (width - 50) && x < (width - 10)) && (y > (height - 50) && (y < height-10))) {
    if(!canvas_flag_active) {
      var canvas = document.getElementById('canvas');
      canvas.addEventListener('mousemove', showFlag);
      canvas_flag_active = true;
    } else if(canvas_flag_active) {
      canvas.removeEventListener('mousemove', showFlag);
      canvas_flag_active = false;
    }
  } else if(canvas_flag_active) {
    current_coordinate_list.push({x:x,y:height-y,x_actual:x_actual,y_actual:y_actual});
    var coordinates = document.createElement('div');
    coordinates.innerHTML = `Waypoint ${++number_of_coordinates}: [ ${x_actual} , ${y_actual} ] [ ${x} , ${y} ]`;
    coordinates.classList.add('coordinates');
    var parent = document.getElementById('coordinates-list-actual');
    parent.insertBefore(coordinates,parent.firstChild);
    if(document.querySelector('#waypoints-button').style.display != 'inline' && selected_robots.length > 0)
      document.querySelector('#waypoints-button').style.display = 'inline';
  } else {
    current_robot_list.forEach((robot) => {
      if(Math.abs(robot.x - x_actual) < 80 && Math.abs(robot.y - y_actual) < 80) {
        displaySettings(e, robot.robotNumber, true);
        onRobot = true;
      } else {

      }
    });
    if(!onRobot && !e.shiftKey) {
      resetAllStrokes();
      resetAllBackgrounds();
    }
  }
});
/* websocket connection is active */
ws.onopen = function() {
  console.log("Connection established!");
}
/* websocket connection is closed */
ws.onclose = function() {
  console.log("Connection closed!");
}
/* whenever there's a message received over the websocket */
ws.onmessage = function(m) {
  /* handle message */
  if(typeof m.data === 'string') {
    checkMessage(m.data);
  } else if(m.data instanceof Blob) {
    var reader = new FileReader();
    reader.onload = function() {
      checkMessage(reader.result);
    }
    reader.readAsText(m.data);
  } else if (m.data instanceof ArrayBuffer) {
    console.log(m.data instanceof ArrayBuffer);
  }
}
/* clear the console of all text */
function clearConsole() {
  console.API;
  if (typeof console._commandLineAPI !== 'undefined') {
    console.API = console._commandLineAPI;
  } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
    console.API = console._inspectorCommandLineAPI;
  } else if (typeof console.clear !== 'undefined') {
    console.API = console;
  }
  console.API.clear();
}