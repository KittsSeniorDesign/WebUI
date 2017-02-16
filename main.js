var number_of_robots = 0;
var number_of_fields = 7;
var field_line_height = 18;
var single_robot_string = false;
var ws;

function addButtonCreate() {
    var btn_helper = document.createElement('div');
    btn_helper.style.height = field_line_height + 'px';
    
    var title = document.createElement('div');
    title.appendChild(document.createTextNode('Robot Container'));
    title.style.width = '100%';
    title.style.textAlign = 'center';
    title.style.height = field_line_height + 'px';
    
    var robot_item_container = document.createElement('div');
    robot_item_container.id = 'robot-item-container';
    var h = document.getElementById('robot-container').offsetHeight - field_line_height;
    robot_item_container.style.width = '100%';
    robot_item_container.style.height = h + 'px';
    robot_item_container.style.backgroundColor = 'white';
    
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.style.height = field_line_height + 'px';
    btn.style.width = field_line_height + 'px';
    btn.style.textAlign = 'center';
    btn.style.verticalAlign = 'middle';
    btn.style.padding = '0';
    btn.style.border = 'none';
    btn.style.outline = 'none';
    btn.style.backgroundColor = 'white';
    btn.style.color = 'black';
    btn.onclick = addRobot;
    btn.style.float = 'right';
    btn.style.zIndex = '1';
    btn.style.position = 'relative';
    btn.style.top = '-' + (field_line_height) + 'px';
    btn.style.cursor = 'pointer';
    btn.innerHTML = '&#43;';
    btn_helper.appendChild(title);
    btn_helper.appendChild(btn);
    document.getElementById('robot-container').appendChild(btn_helper);
    document.getElementById('robot-container').appendChild(robot_item_container);
}
function modalCreate() {
    var modal = document.createElement('div');
    modal.id = 'modal-div';
    modal.className = 'modal-div';
    var modal_content = document.createElement('div');
    modal_content.id = 'modal-content';
    modal_content.className = 'modal-content';
    var modal_content_header = document.createElement('div');
    modal_content_header.id = 'modal-content-header';
    modal_content_header.className = 'modal-content-header';
    var modal_content_close = document.createElement('span');
    modal_content_close.className = 'close';
    modal_content_close.innerHTML = '&times;'
    modal_content_close.onclick = function(){document.getElementById('modal-div').style.display = 'none'};
    modal_content_header.appendChild(modal_content_close);
    modal_content.appendChild(modal_content_header);
    modal.appendChild(modal_content);
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(modal);
    modalOptions();
}
function modalOptions() {
    modal_content_header = document.getElementById('modal-content-header');
    var title = document.createElement('div');
    title.className = 'add-robot-title';
    var title_txt = document.createTextNode('Add New Robot');
    title.appendChild(title_txt);
    modal_content_header.appendChild(title);
}
function addRobotOptions() {
    document.getElementById('modal-div').style.display = 'block';
}
function addRobot(robot_number = number_of_robots) {
    number_of_robots += 1;
    var container = document.getElementById('robot-item-container');
    var rc = document.createElement('div');
    rc.style.width = '90%';
    rc.style.height = (((number_of_fields + 1) * field_line_height) + 2 )+ 'px';
    rc.style.margin = '0 auto';
    rc.style.border = '1px solid black';
    rc.style.outline = 'none';
    rc.style.marginTop = '10px';
    rc.id = 'rc_' + number_of_robots;
    rc.className = 'robot';
    rc.className += ' robot-item';
    rc.className += ' robot-item-' + number_of_robots;
    var cap = document.createElement('div');
    cap.style.height = field_line_height + 'px';
    cap.style.textAlign = 'center';
    cap.style.borderBottom = '1px solid black';
    cap.style.width = '100%';
    cap.id = 'cap_' + number_of_robots
    cap.className += 'robot-item';
    cap.className += ' robot-item-' + number_of_robots;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn_r_' + number_of_robots;
    btn.className += ' robot-item';
    btn.className += ' robot-item-' + number_of_robots;
    btn.style.position = 'relative';
    btn.id = 'remove_robot_button_' + number_of_robots;
    btn.style.top = '-' + field_line_height + 'px'
    btn.style.height = field_line_height + 'px';
    btn.style.width = field_line_height + 'px';
    btn.style.textAlign = 'center';
    btn.style.verticalAlign = 'middle';
    btn.style.padding = '0';
    btn.style.border = 'none';
    btn.style.borderBottom = '1px solid black';
    btn.style.outline = 'none';
    btn.style.backgroundColor = 'white';
    btn.style.float = 'right';
    btn.style.color = 'black';
    btn.style.zIndex = '1';
    btn.onclick = removeRobot;
    btn.innerHTML = '-';
    cap.innerHTML = 'Robot ' + number_of_robots;
    var field_flex_container = document.createElement('div');
    field_flex_container.style.display = 'flex';
    field_flex_container.style.float = 'left';
    field_flex_container.style.flexDirection = 'column';
    field_flex_container.id = 'robot_item_field_flex_container_' + number_of_robots;
    field_flex_container.className = 'robot-item';
    field_flex_container.className += ' robot-item-' + number_of_robots;
    var value_flex_container = document.createElement('div');
    value_flex_container.style.display = 'flex';
    value_flex_container.style.float = 'right';
    value_flex_container.style.flexDirection = 'column';
    value_flex_container.style.position = 'relative';
    value_flex_container.style.right = '-' + field_line_height + 'px';
    value_flex_container.id = 'robot_item_value_flex_container_' + number_of_robots;
    value_flex_container.className = 'robot-item';
    value_flex_container.className += ' robot-item-' + number_of_robots;
    rc.appendChild(cap);
    rc.appendChild(btn);
    rc.appendChild(field_flex_container);
    rc.appendChild(value_flex_container);
    for(var i = 0; i < number_of_fields; i++) {
        var current_field = document.createElement('div');
        current_field.style.height = field_line_height + 'px';
        current_field.style.textAlign = 'left';
        current_field.style.margin = '0 auto';
        current_field.style.float = 'left';
        current_field.style.paddingLeft = '2px';
        current_field.style.display = 'block';
        current_field.id = 'field_' + i + '_r_' + number_of_robots;
        current_field.className = 'robot-item';
        current_field.className += ' robot-item-' + number_of_robots;
        current_field.appendChild(document.createTextNode('Field_Name'));
        var current_value = document.createElement('div');
        current_value.style.height = field_line_height + 'px';
        current_value.style.textAlign = 'right';
        current_value.style.margin = '0 auto';
        current_value.style.display = 'block';
        current_value.style.float = 'right';
        current_value.style.paddingRight = '2px';
        current_value.id = 'value_' + i + '_r_' + number_of_robots;
        current_value.className = 'robot-item';
        current_value.className += ' robot-item-' + number_of_robots;
        current_value.appendChild(document.createTextNode('Value'));
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
    console.log(robot_item_change_color);
    for(var i = 0; i < number_of_robots; i++) {
        var robot_item = document.querySelectorAll('.robot-item-' + (i + 1));
        if(i == robot_item_change_color - 1)
            var color = 'lightgrey';
        else
            var color = 'white';
        for(var j = 0; j < robot_item.length; j++) {
            robot_item[j].style.backgroundColor = color;
        }
    }
}
function pageTitleCreate() {
    var title = document.createElement('div');
    title.id = 'title-div';
    title.style.margin = '0 auto';
    title.style.height = '7vh';
    title.style.textAlign = 'center';
    title.style.fontSize = '30px';
    var title_txt = document.createTextNode('Multi-bot Easy Control Hierarchy');
    title.appendChild(title_txt);
    document.getElementsByTagName('body')[0].appendChild(title);
}
function pageTableCreate() {
    var tbl_div = document.createElement('div');
    tbl_div.id = 'page_table-div';
    var tbl = document.createElement('table');
    tbl.id = 'page-table';
    tbl.className = 'page-table';
    var row_1 = document.createElement('tr');
    row_1.id = 'page_table_row_1';
    var col_11 = document.createElement('td');
    col_11.id = 'page_table_col_11';
    col_11.rowSpan = 2;
    var col_12 = document.createElement('td');
    col_12.id = 'page_table_col_12';
    var row_2 = document.createElement('tr');
    row_2.id = 'page_table_row_2';
    var col_21 = document.createElement('td');
    col_21.id = 'page_table_col_21';
    var col_22 = document.createElement('td');
    col_22.id = 'page_table_col_22';
    
    var robot_container = document.createElement('div');
    robot_container.id = 'robot-container';
    
    var settings_container = document.createElement('div');
    settings_container.id = 'settings-container';
    var settings_container_title = document.createElement('div');
    settings_container_title.appendChild(document.createTextNode('Settings Container'));
    settings_container_title.style.width = '100%';
    settings_container_title.style.textAlign = 'center';
    settings_container_title.style.height = '18px';
    settings_container.appendChild(settings_container_title);
    
    var graphics_container = document.createElement('div');
    graphics_container.id = 'graphics-container';
    var graphics_container_title = document.createElement('div');
    graphics_container_title.appendChild(document.createTextNode('Graphics Container'));
    graphics_container_title.style.width = '100%';
    graphics_container_title.style.textAlign = 'center';
    graphics_container_title.style.height = '18px';
    graphics_container.appendChild(graphics_container_title);
    
    col_11.appendChild(robot_container);
    col_12.appendChild(graphics_container);
    col_21.appendChild(settings_container);
    row_1.appendChild(col_11);
    row_1.appendChild(col_12);
    row_2.appendChild(col_21);
    tbl.appendChild(row_1);
    tbl.appendChild(row_2);
    tbl_div.appendChild(tbl);
    document.getElementsByTagName('body')[0].appendChild(tbl_div);
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

pageTitleCreate();
pageTableCreate();
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

