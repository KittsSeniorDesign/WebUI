var number_of_robots = 0;
var number_of_fields = 7;
var single_robot_string = false;
var ws;

function addButtonCreate() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'addRobotButton';
    btn.style.display = 'inline-block';
    btn.style.float = 'left';
    btn.id = 'addRobotButton';
    btn.onclick = addRobot;
    var btn_txt = document.createTextNode('+');
    btn.appendChild(btn_txt);
    var div = document.getElementById('robot-container');
    div.appendChild(btn);
}
function modalCreate() {
    var modal = document.createElement('div');
    modal.id = 'modal-div';
    modal.className = 'modal-div';
    var modal_content = document.createElement('div');
    modal_content.id = 'modal-content';
    modal_content.className = 'modal-content';
    var modal_content_close = document.createElement('span');
    modal_content_close.className = 'close';
    modal_content_close.onclick = function(){document.getElementById('modal-div').style.display = 'none'};
    var modal_content_close_txt = document.createTextNode('x');
    modal_content_close.appendChild(modal_content_close_txt);
    modal_content.appendChild(modal_content_close);
    modal.appendChild(modal_content);
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(modal);
}
function addRobot() {
    document.getElementById('modal-div').style.display = 'block';
}

function tableCreate() {
    var tbl = document.createElement('table');
    tbl.id = "table_robot_"+number_of_robots;
    tbl.style.display = 'inline-block';
    tbl.style.float = 'left';
    var cap = document.createElement('caption')
    var cap_txt = document.createTextNode("Robot "+number_of_robots)
    cap.appendChild(cap_txt);
    tbl.appendChild(cap);
    for(var i = 0; i < 6; i++) {
        var tr = document.createElement('tr');
        var current_var;
        var current_var_text;
        switch(i) {
            case 0:
                current_var = "vel";
                current_var_text = "Velocity";
                break;
            case 1:
                current_var = "hdn";
                current_var_text = "Heading";
                break;
            case 2:
                current_var = "alt";
                current_var_text = "Altitude";
                break;
            case 3:
                current_var = "lcx";
                current_var_text = "Location X";
                break;
            case 4:
                current_var = "lcy";
                current_var_text = "Location Y";
                break;
            case 5:
                current_var = "lcz";
                current_var_text = "Location Z";
                break;
        }
        tr.id = "r_"+number_of_robots+"_"+current_var+"_tr";
        for(var j = 0; j < 2; j++) {
            var td = document.createElement('td');
            switch(j) {
                case 0:
                    td.id = "r_"+number_of_robots+"_"+current_var+"_td";
                    td.appendChild(document.createTextNode(current_var_text));
                    td.className = "label";
                    break;
                case 1:
                    td.id = "r_"+number_of_robots+"_"+current_var+"_val";
                    td.innerHTML = 0;
                    td.setAttribute('align','right');
                    td.className = "value";
                    // td.appendChild(document.createTextNode(0));
                    break;
            }
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
    var div = document.getElementById('robot-container');
    var btn = document.getElementById('addRobotButton');
    div.insertBefore(tbl,btn);
}

function placeContent(content_array) {
    var current_var;
    var i = 0;
    for(var x in content_array) {
        if(x == 0) {
            i++;
            continue;
        }
        switch(i) {
            case 1:
                current_var = "vel";
                break;
            case 2:
                current_var = "hdn";
                break;
            case 3:
                current_var = "alt";
                break;
            case 4:
                current_var = "lcx";
                break;
            case 5:
                current_var = "lcy";
                break;
            case 6:
                current_var = "lcz";
                break;
        }
        var childID = "r_"+content_array[0]+"_"+current_var+"_val";
        var nodeToUpdate = document.getElementById(childID);
        nodeToUpdate.innerHTML = content_array[i];
        i++;
    }
}

addButtonCreate();
modalCreate();

ws = new WebSocket("ws://127.0.0.1:5678/");

ws.onmessage = function (e) {
    var content = e.data;
    var content_array = content.split(" ");
    var current_number_of_robots = parseInt(content_array[content_array.length - number_of_fields]);
    if(current_number_of_robots > number_of_robots) {
        number_of_robots = current_number_of_robots;
        tableCreate();
    }
    if(single_robot_string) {
        placeContent(content_array);
    } else {
        for(var i = 0; i < content_array.length; i++) {
            var robot_array = new Array(number_of_fields);
            for(var j = 0; j < number_of_fields; j++) {
                robot_array[j] = content_array[i * number_of_fields + j];
            }
            placeContent(robot_array);
        }
    }
}

ws.onopen = function() {
    ws.send("Connection established!");
    console.log("Connection established!");
}
ws.onclose = function() {
    console.log("Connection closed!");
}
function sendNumberOfRobots() {
    ws.send("Number of Robots: " + number_of_robots);
    console.log("Sending number of robots: " + number_of_robots)
}

function sendMessage(msg) {
    ws.send(msg);
    console.log("Sending " + msg);
}

