$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#successAlert").hide();

        $("#make").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        input_make: $("#input_make").val() // get make value from html form

                     },
                     type: 'POST', // method to use
                     url: '/addmake' // python route to destination

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
                // jquery should stop the form from "moving" as usual /default

                event.preventDefault();
        });// end on submit

});// end ready

// after this file create a python route named / addmake line 14