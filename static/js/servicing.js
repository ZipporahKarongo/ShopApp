$(document).ready(function(){
// check if form is submitted
   $("#errorAlert2"). hide();
 $("#successAlert2").hide();
  $("#progress").hide();


        $("#service").on('submit',function(event){
          $("#progress").text("Loading Please wait...").show();
           $("#errorAlert2"). hide();
          $("#successAlert2").hide();
          console.log($("#services").val())


        //use ajax to send data to python


                $.ajax({
                    data: {

                          date: $("#date").val() ,
                          time: $("#time").val(),
                          services: $("#services").val(),
                          reg_no: $("#reg_no").val()// get make value from html form

                     },
                     type: 'POST', // method to use
                     url: '/service' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                        if(data.error){
                        // update html with error
                             console.log("error encountered")
                              $("#errorAlert2"). text(data.error).show();
                             $("#successAlert2").hide();
                               $("#progress").hide();



                        }
                        else{
                              console.log("Successfully saved!")
                              $("#errorAlert2"). hide();
                                $("#progress").hide();
                              $("#successAlert2").text(data.success).show();
                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit

});// end ready

// after this file create a python route na