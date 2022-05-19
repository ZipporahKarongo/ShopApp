$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#successAlert").hide();

        $("#owner").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        input_first_name: $("#input_first_name").val(), // get make value from html form
                        input_last_name: $("#input_last_name").val(),
                        input_idno: $("#input_idno").val(),
                        input_email: $("#input_email").val(),
                        input_phone_number: $("#input_phone_number").val(),
                        input_pswrd: $("#input_pswrd").val()

                     },
                     type: 'POST', // method to use
                     url: '/addowner' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                        if(data.error){
                        // update html with error
                        console.log("error encountered")
                            $("#errorAlert"). text(data.error).show();
                             $("#successAlert").hide();


                        }
                        else{
//                          console.log("Successfully saved!")
                           $("#errorAlert"). hide();
                            $("#successAlert").text(data.success).show();
                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit

});// end ready

// after this file create a python route named