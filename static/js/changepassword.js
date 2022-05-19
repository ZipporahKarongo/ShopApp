$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#successAlert").hide();
  $("#progress").hide();



        $("#changepassword").on('submit',function(event){
        //use ajax to send data to python
           $("#errorAlert"). hide();
 $("#successAlert").hide();
  $("#progress").show();


                $.ajax({
                    data: {
                        current: $("#current").val(),
                        new1: $("#new1").val(), // get make value from html form
                         confirm: $("#confirm").val()

                     },
                     type: 'POST', // method to use
                     url: '/changepassword' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                        if(data.error){
                        // update html with error
                        console.log("error encountered")
                            $("#errorAlert"). text(data.error).show();
                             $("#successAlert").hide();
                               $("#progress").hide();

                        }
                        else{
//                          console.log("Successfully saved!")
                           $("#errorAlert"). hide();
                            $("#successAlert").text(data.success).show();
                              $("#progress").hide();

                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit

});// end ready

