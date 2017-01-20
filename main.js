var number_of_robots = 0;
var ws;

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
    div.appendChild(tbl);
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

ws = new WebSocket("ws://127.0.0.1:5678/");
ws.onmessage = function (e) {
    ws.send("Message Received!");
    var content = e.data;
    var content_array = content.split(" ");
    var current_number_of_robots = parseInt(content_array[0]);
    if(current_number_of_robots > number_of_robots) {
        number_of_robots = current_number_of_robots;
        tableCreate();
    }
    placeContent(content_array);
};
ws.onopen = function() {
    ws.send("Connection established!");
    console.log("Connection established!");
}

function sendMessage() {
    ws.send("hello");
    console.log("sending hello...");
}

