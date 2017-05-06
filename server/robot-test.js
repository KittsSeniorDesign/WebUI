var net = require('net');
var timers = require('timers')

var nss = new net.Socket();
var number_of_robots = 1;
var robots = [];
var current_waypoints = [];

var tcpClient;

nss.connect(9001, '127.0.0.1', function() {
  tcpClient = nss;
  console.log('Connected to TCP server.');
});


nss.on('data', function(data) {
  if(data == 'requestDTconfig()') {
    try{
      tcpClient.write('DTConfig: matlab/commands Channel,robot_1 Sink,robot_1-source/states Channel');
    } catch(e) {}
  } else if(data.includes('s')) {
    var msg = data.toString().split('robot_');
    msg.forEach((message) => {
      if(message.includes('s')) {
        var robot_id = parseInt(message.split(' ')[0]);
        var waypoint_number = parseInt(message.split(' ')[2]);
        var waypoint_x = parseInt(message.split(' ')[3]);
        var waypoint_y = parseInt(message.split(' ')[4]);
        while(current_waypoints.length < robot_id + 1) {
          current_waypoints.push({id:undefined,num:undefined,waypoints:[]});
        }
        var max_num = 0;
        if(current_waypoints[robot_id].num != undefined) {
          if(waypoint_number < current_waypoints[robot_id].num) {
            max_num = current_waypoints[robot_id].num;
          } else {
            max_num = waypoint_number;
          }
        }
        if(waypoint_number === 1) {
          beginRoute(robot_id);
        }
        current_waypoints[robot_id].id = robot_id;
        current_waypoints[robot_id].num = max_num;
        if(current_waypoints[robot_id].waypoints.length > waypoint_number - 1) {
          current_waypoints[robot_id].waypoints[waypoint_number-1] = {num:waypoint_number,x:waypoint_x,y:waypoint_y}
        } else if(current_waypoints[robot_id].waypoints.length === max_num + 1) {
          current_waypoints[robot_id].waypoints[waypoint_number-1] = {num:waypoint_number,x:waypoint_x,y:waypoint_y};
        } else {
          current_waypoints[robot_id].waypoints.push({num:waypoint_number,x:waypoint_x,y:waypoint_y})
        }
        console.log(current_waypoints);
      }
    });
  }
});
function beginRoute(id) {
  robots.forEach((robot) => {
    if(robot.number === id) {
      robot.waypoint = true;
      robot.waypoint_number = 0;
    }
  });
}
function endRoute(id) {
  robots.forEach((robot) => {
    if(robot.number === id) {
      robot.waypoint = false;
      robot.waypoint_number = undefined;
    }
  });
}
function loopRoute(robot) {
  robot.waypoint = true;
  robot.waypoint_number = 0;
}
nss.on('close', function() {
  console.log('TCP connection closed.');
});
nss.on('error', (error) => {
  console.log(`An error has occured: ${error.message}`);
  process.exit(1);
})
function generateRandom(low,high) {
  return Math.round(Math.random() * (high - low) + low);
}
function advanceRobot(robot) {
  robot.x_present = robot.x_future;
  robot.y_present = robot.y_future;
  robot.z_present = robot.z_future;
}
function advanceWaypoint(robot) {
  if(withinThreshold(robot)) {
    if(robot.waypoint_number++ < current_waypoints[robot.number].num) {
      try {
        robot.x_end = current_waypoints[robot.number].waypoints[robot.waypoint_number].x;
        robot.y_end = current_waypoints[robot.number].waypoints[robot.waypoint_number].y;
        robot.z_end = current_waypoints[robot.number].waypoints[robot.waypoint_number].z;
      } catch(e) {
        loopRoute(robot);
      }
    } else {
      loopRoute(robot);
    }
  }
}
function withinThreshold(robot) {
  var threshold = 10;
  var x_squared = Math.pow((robot.x_end - robot.x_present),2);
  var y_squared = Math.pow((robot.y_end - robot.y_present),2);
  var distance = Math.sqrt(x_squared + y_squared);
  if(distance < threshold) {
    console.log(`Finished Waypoint ${robot.waypoint_number}`);
    return true;
  }
  return false;
}
function setFuture(robot) {
  if(!robot.waypoint) {
    var robot_heading_delta = generateRandom(-180,180);
    var heading_offset = 0.04;
  
    if(robot_heading_delta < 0)
      robot.heading_degrees -= (heading_offset * Math.abs(robot_heading_delta));
    if(robot_heading_delta > 0)
      robot.heading_degrees += (heading_offset * Math.abs(robot_heading_delta));
    if(robot.heading_degrees < -180)
      robot.heading_degrees += 360;
    if(robot.heading_degrees > 180)
      robot.heading_degrees -= 360;
    robot.heading = robot.heading_degrees * Math.PI / 180;
    var speed_offset = 10;
    
    robot.y_future = Math.round(robot.y_present + (speed_offset * Math.sin(robot.heading)));
    robot.x_future = Math.round(robot.x_present + (speed_offset * Math.cos(robot.heading)));
    
    if(robot.x_future > 3946)
      robot.x_future = 0;
    else if(robot.x_future < 0)
      robot.x_future = 3946;
    if(robot.y_future > 2854)
      robot.y_future = 0;
    else if(robot.y_future < 0)
      robot.y_future = 2854;
  } else {
    robot.x_end = current_waypoints[robot.number].waypoints[robot.waypoint_number].x;
    robot.y_end = current_waypoints[robot.number].waypoints[robot.waypoint_number].y;
    robot.z_end = current_waypoints[robot.number].waypoints[robot.waypoint_number].z;
    advanceWaypoint(robot);
    calculateFuture(robot);
  }
}
function calculateFuture(robot) {
  var heading = calculateHeading(robot.x_present,robot.y_present,robot.x_end,robot.y_end);
  robot.heading_delta = heading - robot.heading_degrees;
  if(robot.heading_delta < -180)
    robot.heading_delta += 360;
  if(robot.heading_delta > 180)
    robot.heading_detla -= 360;
  
  var heading_offset = 0.1;
  
  if(robot.heading_delta < 0)
    robot.heading_degrees -= (heading_offset * Math.abs(robot.heading_delta));
  if(robot.heading_delta > 0)
    robot.heading_degrees += (heading_offset * Math.abs(robot.heading_delta));
  if(robot.heading_degrees < -180)
    robot.heading_degrees += 360;
  if(robot.heading_degrees > 180)
    robot.heading_degrees -= 360;
  robot.heading = robot.heading_degrees * Math.PI / 180;
  
  var speed_offset = 10;
  
  robot.y_future = Math.round(robot.y_present + (speed_offset * Math.sin(robot.heading)));
  robot.x_future = Math.round(robot.x_present + (speed_offset * Math.cos(robot.heading)));
  
  if(robot.x_future > 3946)
    robot.x_future = 0;
  else if(robot.x_future < 0)
    robot.x_future = 3946;
  if(robot.y_future > 2854)
    robot.y_future = 0;
  else if(robot.y_future < 0)
    robot.y_future = 2854;  
}
function generateRobots() {
  for(var i = 0; i < number_of_robots; i++) {
    robots.push({
      name:`robot_${i}`,
      number:i,
      type:'dd',
      x_present:generateRandom(100,2900),
      y_present:generateRandom(100,2800),
      z_present:0,
      x_future:0,
      y_future:0,
      z_future:0,
      x_end:0,
      y_end:0,
      z_end:0,
      color:0,
      velocity:0,
      heading:Math.PI/2,
      heading_degrees:90,
      heading_delta:0,
      waypoint:false,
      waypoint_number:undefined,
      timer:undefined
    });
  }
}
function sendRobot(robot) {
  var send_string = `${robot.name}, ${robot.type}, ${robot.color}, ${robot.x_present}, ${robot.y_present}, ${robot.z_present}, ${robot.velocity}, ${robot.heading};`;
  try {
    tcpClient.write(send_string);
  } catch(e) {
    console.error(`An error has occured: ${e.message}`);
    process.exit(1);
  }
}
function setUpdates() {
  robots.forEach((robot) => {
    var t = timers.setInterval(function() {
      setFuture(robot);
      advanceRobot(robot);
      sendRobot(robot);
    },25);
  });
}
generateRobots();
setUpdates();
function calculateHeading(current_x,current_y,waypoint_x,waypoint_y) {
  var theta_radians = Math.atan2((waypoint_y - current_y),(waypoint_x - current_x));
  var theta_degrees =  theta_radians * 180 / Math.PI;
  return theta_degrees;
}