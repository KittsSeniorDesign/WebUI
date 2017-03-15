var number_of_robots = 0;
var number_of_fields = 9;
var field_line_height = 18;
var single_robot_string = false;
var ws;
var current_robot_list = [];
var data_timeout = 10000;
var removal_timeout = 100000000000;

function requestDT() {
  if(ws.readyState == 1) {
    ws.send('requestDTconfig()');
    console.log('Requesting channels and sinks from DataTurbine...');
  } else {
    window.alert('Not connected to server.');
  }
}
function reconfigureDT(sinkName,chanName) {
  if(ws.readyState == 1) {
    ws.send('reconfSink2Chan(' + sinkName + ', ' + chanName + ')');
    console.log('Sending updated configuration to DataTurbine.');
  } else {
    window.alert('Not connected to server.')
  }
}
function setDT() {
  
}
function resetValues(r) {
  r.values.forEach((value,i) => {
    if(r.fields[i]!='Robot ID')
      value.innerHTML = '0';
  });
}
function drawRobots() {
  var bound_x = 3874;
  var bound_y = 2775;
  var canvas = document.getElementById('canvas');
  var canvas_container = document.getElementById('canvas-container');
  var width = canvas_container.offsetWidth;
  canvas.width = width;
  var height = canvas_container.offsetHeight - 10; // weird
  canvas.height = height;
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  current_robot_list.forEach((robot) => {
    context.beginPath();
    var current_x = Math.round((robot.x / bound_x) * width);
    var current_y = Math.floor(height - ((robot.y / bound_y) * height));
    context.lineWidth = 3;
    context.arc(current_x, current_y, robot.radius, 0, 2 * Math.PI);
    context.strokeStyle = robot.color_stroke;
    context.fillStyle = robot.color_fill;
    context.fill();
    context.stroke();
  });
}
function generateRandom(low,high) {
    return Math.random() * (high - low) + low;
}
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
    robotNumber: 0,
    timeRemainingDisconnect: 0,
    timeRemainingRemoval: 0,
    x: 0,
    y: 0,
    radius: 15,
    color_fill: fill_color,
    color_stroke: 'white'
  };
  for(var i = 0; i < number_of_fields; i++) {
    var current_field = document.createElement('div');
    current_field.classList.add('display-field');
    current_field.classList.add('robot_item-' + vars[0]);
    current_field.classList.add('unselectable');
    var val_id;
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
      current_value.innerHTML = 'Connected';
    } else if(val_id === 'color') {
      current_value.style.backgroundColor = fill_color;
    } else {
      current_value.innerHTML = vars[i];
    }
    robot.fields.push(current_field);
    robot.values.push(current_value);
  }
  robot.robotNumber = robot.values[0].innerHTML;
  return robot;
}
function timer(r) {
  clearTimeout(r.timeRemainingDisconnect);
  clearTimeout(r.timeRemainingRemoval);
  r.timeRemainingDisconnect = setTimeout(() => {
    r.values[number_of_fields-1].innerHTML = 'Disconnected';
    r.values[number_of_fields-1].classList.remove('status-connected');
    r.values[number_of_fields-1].classList.add('status-disconnected');
  }, data_timeout);
  r.timeRemainingRemoval = setTimeout(() => {
    removeRobot(r);
  }, removal_timeout);
}
function updateRobot(vars) {
  var add_robot_flag = true;
  if(current_robot_list.length) {
    for(var i = 0; i < current_robot_list.length; i++) {
      if(current_robot_list[i].values[0].innerHTML == vars[0]) {
        add_robot_flag = false;
        for(var j = 0; j < number_of_fields; j++) {
          if(current_robot_list[i].fields[j].innerHTML === 'Status') {
            current_robot_list[i].values[j].innerHTML= 'Connected';
            current_robot_list[i].values[j].classList.remove('status-disconnected');
            current_robot_list[i].values[j].classList.add('status-connected');
          } else if(current_robot_list[i].fields[j].innerHTML === 'Position X') {
            current_robot_list[i].x = vars[j];
            current_robot_list[i].values[j].innerHTML = vars[j];
          } else if(current_robot_list[i].fields[j].innerHTML === 'Position Y') {
            current_robot_list[i].y = vars[j];
            current_robot_list[i].values[j].innerHTML = vars[j];
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
function checkMessage(m) {
  if(m.includes('DTConfig: ')) {
    console.log('Received channels and sinks from DataTurbine.');
    setDT(m);
  } else if(m.includes('robot_')) {
    var robot_id = m.split(',')[0].slice(6);
    var robot_vars = m.split(';')[0].split(',');
    robot_vars[0] = robot_id;
    updateRobot(robot_vars);
  } else {
    console.log(m);
  }
}
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
function removeRobot(r) {
  number_of_robots--;
  for(var i = 0; i < current_robot_list.length; i++) {
    if(r.robotNumber === current_robot_list[i].robotNumber) {
      current_robot_list.splice(i,1);
    } 
  }
  r.fields[0].parentElement.parentElement.parentElement.removeChild(document.getElementById('rc-' + r.robotNumber));
}
function displaySettings() {
  current_robot_list.forEach((robot) => {
    if(robot.robotNumber == this.id.slice(this.id.indexOf('-')+1)) {
      if(robot.color_stroke != 'red') {
        resetAllStrokes();
        robot.color_stroke ='red';
      } else {
        robot.color_stroke = 'white';
      }
      drawRobots();
    }
  });
  if(this.style.backgroundColor != 'rgb(24, 24, 24)') {
    resetAllBackgrounds();
    this.style.backgroundColor = 'rgb(24, 24, 24)';
  } else {
    this.style.backgroundColor = 'rgb(34, 34, 34)';
  }
}
function resetAllBackgrounds() {
  document.querySelectorAll('.robot-item-div').forEach((robot_item) => {
     robot_item.style.backgroundColor = 'rgb(34, 34, 34)'; 
  });
}
function resetAllStrokes() {
  current_robot_list.forEach((robot) => {
    robot.color_stroke = 'white';
  });
}
ws = new WebSocket("ws://127.0.0.1:9002/");
// ws.binaryType = 'arraybuffer'
ws.onopen = function() {
  console.log("Connection established!");
}
ws.onclose = function() {
  console.log("Connection closed!");
}
ws.onmessage = function(m) {
  // clearConsole();
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