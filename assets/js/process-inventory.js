/*
Jose Gilberto Ponce
5/24/2019
www.poncesolutions.como
Java Script to process inventory from Physical Retail Inventory
*/

$( document ).ready(function() {
    //Start instead of clicking
    //$( "#home-start-inventory-button" ).click(function() {
        //alert( "Handler for .click() called." );
    //});
    //$('#home-start-inventory-button').modal("show");
    
    //$('#modal-add-inventory').modal('show')


    //We are going to place here functions related to inventory
    //Start inventory
    
    //$('#home-start-inventory-button').click();

    //All dropdown-items will be handled here


    //It will start with nothing until it is created or selected
    var inventories = [];
    var auditors    = [];
    var supervisors = [];
    var times       = [];
    var customers   = [];
    
    setTimes(6);
    //setMenu("start-time-menu",times);
    //setMenu("end-time-menu",times);

    

    


    var currentInventory = {
        id: 0,
        customer_id:0,
        supervisor_id:0,
        start_date_time:0,
        end_date_time:0,
        comments:""
    };

    /*

    $(".dropdown-item").click(function(e){
        e.preventDefault();
        var elementId = $(this).attr('id');
        var elementArray = elementId.split("-");
        switch(elementArray[0]) {
            case "customer":
                break;
            case "inventory":
                break;
            case "supervisor":
                break;
            case "start":
                break;
            case "end":
                break;
            default:
                break;

        }



        console.log("clicked" + elementId + elementArray[0]);

    })//
    **/


    function handleClick(d,i) {
        var elementId = this.id;
        var elementArray = elementId.split("-");
        switch(elementArray[0]) {
            case "customer":
                break;
            case "inventory":
                break;
            case "supervisor":
                break;
            case "start":
                break;
            case "end":
                break;
            default:
                break;

        }



        console.log("clicked" + elementId + elementArray[0]);
        //console.log(d);
        //console.log(this);
        //console.log(this.id);
        //$("#" + this.id).click();
    }


    function setMenu(menuName,data){
        $("#" + menuName).empty();
        d3.select("#" + menuName)
        .selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d.id
        })
        .html(function(d){
            switch(menuName) {
                case "inventory-menu":
                    return d.customer_name + " " + d.start_date;
                    break;
                case "customer-menu":
                    return d.customer_name;
                    break;
                case "supervisor-menu":
                    return d.auditor_name;
                    break;
                default:
                    return d.time;

            }
            
        });
        d3.select("#" + menuName)
        .append("option")
        .attr("selected","selected")
        .attr("value", function(){
            return 0
        })
        .html(function(d){
            switch(menuName) {
                case "inventory-menu":
                    return "Select existing inventory";
                    break;
                case "customer-menu":
                    return "Select customer";
                    break;
                case "supervisor-menu":
                    return "Select supervisor";
                    break;
                default:
                    return "Select Time";

            }
            
        });




        /*
        d3.select("#" + menuName)
        .selectAll("button")
        .data(data)
        .enter()
        .append("button")
        .on("click",handleClick)
        .attr("class","dropdown-item")
        .attr("type","button")
        .attr("id",function(d){
            return "inventory-dropdown-" + d.id;
        })
        .html(function(d){
            switch(menuName) {
                case "inventory-menu":
                    return d.customer_name + " " + d.start_date;
                    break;
                case "customer-menu":
                    return d.customer_name;
                    break;
                case "supervisor-menu":
                    return d.auditor_name;
                    break;
                default:
                    return d.time;

            }
            
        });
        */
        

    }
   //<button class="dropdown-item" id="inventory-dropdown-1" type="button">5/24/2019</button>
    var params = {action: "getInitialData"};
	executeAjax("getInitialData",params);

    //End inventorys

    //General functions
    //$("#waiting-for-process").toggleClass( "d-none" );

    function executeAjax(action, params) { //Start executeAjax
        $("#waiting-for-process").toggleClass( "d-none" );
        $.ajax({
              method: "POST",
              dataType: "json",
              data: params,
              url: "process-inventory.php"
          })
          .done(function( msg ) {
            $("#waiting-for-process").toggleClass( "d-none" );
            var dateFormat = d3.time.format("%m-%d-%Y");
            var timeFormat = d3.time.format("%I:%M %p");
              console.log(msg);
              inventories = msg.inventories;
              auditors    = msg.auditors;
              auditors.forEach(function(d){
                if (d.is_supervisor == 0) {
                    d.is_supervisor = false;
                }
                else {
                    d.is_supervisor = true;
                }
              });
              supervisors = auditors.filter(function(d){
                  return d.is_supervisor == true;
              });
              console.log(supervisors);
              customers   = msg.customers;
              inventories.forEach(function(d) {
                d.id = d.id * 1;
                d.customer_id = d.customer_id * 1;
                d.start_date_time = d.start_date_time * 1;
                d.end_date_time = d.end_date_time * 1;
                var startDateTime = new Date(d.start_date_time * 1000);
                d.start_date = dateFormat(startDateTime);
                d.start_time = timeFormat(startDateTime);
                var endDateTime = new Date(d.end_date_time * 1000);
                d.end_date = dateFormat(endDateTime);
                d.end_time = timeFormat(endDateTime);
              });
              //var date = new Date(inventories[0].start_date_time * 1000);
              //console.log(date);
              
              //console.log(dateFormat(date) + " " + timeFormat(date));


              console.log(inventories);

              setMenu("inventory-menu",inventories);
              setMenu("customer-menu",customers);
              setMenu("supervisor-menu",supervisors);
              //$(".waiting-for-process").toggleClass( "hidden-xs-up" );;
              
              if (msg.status == "success") {
                  
                  if (action == "login") {
                      $("#modal-login-form").modal('hide');
                      login();
                  }
                  if (action == "reset"){
                      $("#modal-forgot-password-form").modal("hide");
                  }
                  if (action == "register"){
                      $("#modal-signup-form").modal("hide");
                  }
              }
              else {
                  if (action == "reset"){
                      $("#forgot-password-message").empty();
                      d3.select("#forgot-password-message")
                        .append('div')
                        .attr('class','alert alert-danger')
                        .html(msg.message);
                  }
                  if (action == "register"){
                      $("#signup-message").empty();
                      d3.select("#signup-message")
                        .append('div')
                        .attr('class','alert alert-danger')
                        .html(msg.message);
                  }
                  if (action == "login"){
                      $("#login-message").empty();
                      d3.select("#login-message")
                        .append('div')
                        .attr('class','alert alert-danger')
                        .html(msg.message);;
                }
              }
          })
          .fail(function( msg){
              $("#waiting-for-process").toggleClass( "d-none" );
              console.log("failed");
              console.log(msg);
              $("#general-message").empty();
              d3.select("#general-message")
                        .append('div')
                          .attr('class','alert alert-danger text-center')
                          .html(msg.responseText);

              //$(".waiting-for-process").toggleClass( "hidden-xs-up" );
              if (action == "reset"){
                      $("#forgot-password-message").empty();
                      d3.select("#forgot-password-message")
                        .append('div')
                          .attr('class','alert alert-danger text-center')
                          .html('Error connecting to webserver');
              }
              if (action == "register"){
                      $("#signup-message").empty();
                      d3.select("#signup-message")
                        .append('div')
                          .attr('class','alert alert-danger text-center')
                          .html('Error connecting to webserver');
              }
              if (action == "login"){
                      $("#login-message").empty();
                      d3.select("#login-message")
                        .append('div')
                          .attr('class','alert alert-danger text-center')
                          .html('Error connecting to webserver');
            }
          }); 
    }//End executeAjax

    function setTimes(minutes) {
        var currentDate = new Date();
        var increments   = 60 / minutes * 24;
        var timeFormat1 = d3.time.format("%I:%M %p");
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        //times.push()

        for (i = 0; i < increments;i++) {
            
            times.push({"id":i,"time":timeFormat1(currentDate)})
            currentDate = new Date(currentDate.getTime() + (minutes * 60000));
            //times.push(timeFormat1(currentDate));
        }
    }

    


    


    
});
