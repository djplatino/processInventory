/*
Jose Gilberto Ponce
5/24/2019
www.poncesolutions.como
Java Script to process inventory from Physical Retail Inventory
*/
$(document).ready(function () {

    $("#imgInp").on('change', function () {
        $("#step-message").empty();
        
        readURL(this);
    });


    function readURL(input) {
        
        if (input.files && input.files[0]) {
          file = input.files[0];
          if(!!file.name.match(/(\.|\/)(json|jpe?g|png|xml)$/i)){
          //alert("valid");
          var formdata = new FormData();
          formdata.append("files[]", file);
          formdata.append("action","uploadFile");
          
          
          //console.log(input.files[0]);
          //&$mysql, $numberOfTickets, $orderId,$imageName,$layoutType,$svgColor, $svgBackgroundColor,$qrLink
          var reader = new FileReader();
          reader.onload = function (e) { 
              console.log("load " + input.files[0].name);

              $("#step04-file-name").html(input.files[0].name);

            };
            reader.readAsDataURL(input.files[0]);
            if (formdata) {
              $("#msg").html("");

              $.ajax({
                url: "process-inventory.php",
                dataType: "json",
                type: "POST",
                data: formdata,
                processData: false,
                            contentType: false, // this is important!!!
                            success: function (res) {
                                console.log(res);
                              $("#step-processing").toggleClass( "d-none" );
                              if (res.status == "success") {
                                
                              }
                              
                                formdata = false;
                                formdata = new FormData();
                              },
                              error: function (res) {
                                  $("#msg").html(res.responseText);
                                console.log(res);
                              }
                            });
            }
          }
          else {
            alert("not valid");
          }
        } 
      }
})