$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#successAlert").hide();

        $("#vehicle").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        owner_id: $("#owner_id").val(),
                        reg_no: $("#reg_no").val(), // get make value from html form
                        model_id: $("#model_id").val(), // get make value from html form
                        make_id: $("#make_id").val(), // get make value from html form
                        type_id: $("#type_id").val(), // get make value from html form
                        color_name: $("#color_name").val(), // get make value from html form
                        chassis_no: $("#chassis_no").val(), // get make value from html form
                        capacity: $("#capacity").val(), // get make value from html form
                        milleage: $("#milleage").val(),
                        doors: $("#doors").val(),
                        year: $("#year").val(),// get make value from html form
                        accident_free: $("#accident_free").val(),
                        photo: 'Pic of sth',
                        cc_id: $("#cc_id").val()
                     },
                     type: 'POST', // method to use
                     url: '/addvehicle/null' // python route to destination

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

// after this file create a p