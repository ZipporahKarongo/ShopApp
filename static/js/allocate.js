$(document).ready(function(){
// check if form is submitted
   $("#errorAlert2"). hide();
 $("#successAlert2").hide();

        $("#allocate").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        driver_id: $("#driver_id").val() ,
                         plate_no: $("#plate_no").val()// get make value from html form

                     },
                     type: 'POST', // method to use
                     url: '/allocate' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                        if(data.error){
                        // update html with error
                             console.log("error encountered")
                              $("#errorAlert2"). text(data.error).show();
                             $("#successAlert2").hide();


                        }
                        else{
                              console.log("Successfully saved!")
                              $("#errorAlert2"). hide();
                              $("#successAlert2").text(data.success).show();
                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit

});// end ready

// after this file create a python route nam