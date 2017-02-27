var number_of_robots = 0;
var number_of_fields = 8;
var field_line_height = 18;
var single_robot_string = false;
var ws;

function addRobotOptions() {
    document.getElementById('modal-div').style.display = 'block';
}
function addRobot() {
    number_of_robots += 1;
    var container = document.getElementById('robot-item-container');
    var rc = document.createElement('div');
    rc.style.height = (((number_of_fields + 1) * field_line_height) + 2 )+ 'px';
    rc.id = 'rc_' + number_of_robots;
    rc.classList.add('robot-item-div');
    rc.classList.add('robot-item');
    rc.classList.add('robot-item-' + number_of_robots);
    var cap = document.createElement('div');
    cap.id = 'cap_' + number_of_robots
    cap.classList.add('robot-item-caption');
    cap.classList.add('robot-item');
    cap.classList.add('robot-item-' + number_of_robots);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'remove_robot_button_' + number_of_robots;
    btn.classList.add('remove-robot-button');
    btn.classList.add('robot-item');
    btn.classList.add('robot-item-' + number_of_robots);
    btn.onclick = removeRobot;
    btn.innerHTML = '-';
    cap.innerHTML = 'Robot ' + number_of_robots;
    var field_flex_container = document.createElement('div');
    field_flex_container.id = 'robot_item_field_flex_container_' + number_of_robots;
    field_flex_container.classList.add('field-flex-container');
    field_flex_container.classList.add('robot-item');
    field_flex_container.classList.add('robot-item-' + number_of_robots);
    var value_flex_container = document.createElement('div');
    value_flex_container.id = 'robot_item_value_flex_container_' + number_of_robots;
    value_flex_container.classList.add('value-flex-container');
    value_flex_container.classList.add('robot-item');
    value_flex_container.classList.add('robot-item-' + number_of_robots);
    rc.appendChild(cap);
    rc.appendChild(btn);
    rc.appendChild(field_flex_container);
    rc.appendChild(value_flex_container);
    for(var i = 0; i < number_of_fields; i++) {
        var current_field = document.createElement('div');
        current_field.id = 'field_' + i + '_r_' + number_of_robots;
        current_field.classList.add('display-field');
        current_field.classList.add('robot-item');
        current_field.classList.add('robot-item-' + number_of_robots);
        switch(i) {
            case 0:
                current_field.innerHTML = 'Robot ID'; break;
            case 1:
                current_field.innerHTML = 'Type'; break;
            case 2:
                current_field.innerHTML = 'Battery'; break;
            case 3:
                current_field.innerHTML = 'Position X'; break;
            case 4:
                current_field.innerHTML = 'Position Y'; break;
            case 5:
                current_field.innerHTML = 'Position Z'; break;
            case 6:
                current_field.innerHTML = 'Velocity'; break;
            case 7:
                current_field.innerHTML = 'Heading'; break;
            default:
                current_field.innerHTML = 'N/A'; break;
        }
        var current_value = document.createElement('div');
        current_value.id = 'value_' + i + '_r_' + number_of_robots;
        current_value.classList.add('display-value');
        current_value.classList.add('robot-item');
        current_value.classList.add('robot-item-' + number_of_robots);
        current_value.appendChild(document.createTextNode('0'));
        field_flex_container.appendChild(current_field);
        value_flex_container.appendChild(current_value);
    }
    container.appendChild(rc);
    var all_robot_items = document.querySelectorAll('.robot-item');
    for(var i = 0; i < all_robot_items.length; i++) {
        if(all_robot_items[i].type != 'button')
            all_robot_items[i].onclick = displaySettings;
    }
}
function removeRobot(e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    number_of_robots--;
    var counter = 0;
    var num;
    for(var i = this.id.length - 1; i > -1; i--) {
        if(isNaN(this.id.charAt(i)))
            break;
        else
            num += this.id.charAt(i);
        counter++;
    }
    robot_number_removed = parseInt(this.id.charAt(this.id.length-1));
    this.parentElement.parentElement.removeChild(document.getElementById('rc_' + robot_number_removed));
    for(var i = robot_number_removed + 1; i < (number_of_robots + 2); i++) {
        document.getElementById('rc_' + i).id = 'rc_' + (i - 1);
        document.getElementById('rc_' + (i - 1)).classList.remove('robot-item-' + i);
        document.getElementById('rc_' + (i - 1)).classList.add('robot-item-' + (i - 1));
        document.getElementById('remove_robot_button_' + i).id = 'remove_robot_button_' + (i - 1);
        document.getElementById('remove_robot_button_' + (i - 1)).classList.remove('robot-item-' + i);
        document.getElementById('remove_robot_button_' + (i - 1)).classList.add('robot-item-' + (i - 1));
        document.getElementById('cap_' + i).id = 'cap_' + (i - 1);
        document.getElementById('cap_' + (i - 1)).classList.remove('robot-item-' + i);
        document.getElementById('cap_' + (i - 1)).classList.add('robot-item-' + (i - 1));
        document.getElementById('cap_' + (i - 1)).innerHTML = 'Robot ' + (i - 1);
        document.getElementById('robot_item_field_flex_container_' + i).id = 'robot_item_field_flex_container_' + (i - 1);
        document.getElementById('robot_item_field_flex_container_' + (i - 1)).classList.remove('robot-item-' + i);
        document.getElementById('robot_item_field_flex_container_' + (i - 1)).classList.add('robot-item-' + (i - 1));
        document.getElementById('robot_item_value_flex_container_' + i).id = 'robot_item_value_flex_container_' + (i - 1);
        document.getElementById('robot_item_value_flex_container_' + (i - 1)).classList.remove('robot-item-' + i);
        document.getElementById('robot_item_value_flex_container_' + (i - 1)).classList.add('robot-item-' + (i - 1));
        for(var j = 0; j < number_of_fields; j++) {
            document.getElementById('field_' + j + '_r_' + i).id = 'field_' + j + '_r_' + (i - 1);
            document.getElementById('field_' + j + '_r_' + (i - 1)).classList.remove('robot-item-' + i);
            document.getElementById('field_' + j + '_r_' + (i - 1)).classList.add('robot-item-' + (i - 1));
            document.getElementById('value_' + j + '_r_' + i).id = 'value_' + j + '_r_' + (i - 1);
            document.getElementById('value_' + j + '_r_' + (i - 1)).classList.remove('robot-item-' + i);
            document.getElementById('value_' + j + '_r_' + (i - 1)).classList.add('robot-item-' + (i - 1));
        }
    }
}
function displaySettings() {
    try {
        var robot_item_change_color = parseInt(this.id.charAt(this.id.length-1));
    } catch(err) {
        var robot_item_change_color = -1;
    }
    for(var i = 0; i < number_of_robots; i++) {
        var robot_item = document.querySelectorAll('.robot-item-' + (i + 1));
        if(i == robot_item_change_color - 1) {
            if(robot_item[0].style.backgroundColor != 'lightgrey')
                var color = 'lightgrey';
            else
                var color = 'white';
        }
        else
            var color = 'white';
        for(var j = 0; j < robot_item.length; j++) {
            robot_item[j].style.backgroundColor = color;
        }
    }
}

ws = new WebSocket("ws://127.0.0.1:9002/");
ws.onopen = function() {
    console.log("Connection established!");
}
ws.onclose = function() {
    console.log("Connection closed!");
}
ws.onmessage = function(m) {
    clearConsole();
    if(typeof m.data === 'string') {
        console.log(m.data);
    } else if(m.data instanceof Blob) {
        var reader = new FileReader();
        reader.onload = function() {
            console.log(reader.result);
        }
        reader.readAsText(m.data);
    } else if (m.data instanceof ArrayBuffer) {
        console.log(m.data instanceof ArrayBuffer);
    }
}
function clearConsole() {
    console.API;
    if (typeof console._commandLineAPI !== 'undefined') {
        console.API = console._commandLineAPI; //chrome
    } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
        console.API = console._inspectorCommandLineAPI; //Safari
    } else if (typeof console.clear !== 'undefined') {
        console.API = console;
    }
    console.API.clear();
}