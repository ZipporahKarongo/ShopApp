$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#successAlert").hide();

        $("#driver").on('submit',function(event){
        //use ajax to send data to python

        var form_data = new FormData();

         form_data.append("first_name",  $("#first_name").val()), // get make value from html form
                        form_data.append("last_name",  $("#last_name").val()) // get make value from html form
                         form_data.append("surname", $("#surname").val()), // get make value from html form
                        form_data.append("resid_id", $("#resid_id").val()), // get make value from html form
                        form_data.append("dl_no", $("#dl_no").val()), // get make value from html form
                        form_data.append("id_no", $("#id_no").val()), // get make value from html form
                        form_data.append("psv_no", $("#psv_no").val()), // get make value from html form
                        form_data.append("dob", $("#dob").val()), // get make value from html form
                        form_data.append("email", $("#email").val()),
                        form_data.append("phone", $("#phone").val()),
                        form_data.append("gender", $("#gender").val()),// get make value from html form
                        form_data.append("files[]", document.getElementById("passport").files[0])


                $.ajax({
                    data:form_data,
                     type: 'POST', // method to use
                     url: '/adddriver',
                      cache: false,
                      contentType:false,
                      processData: false,// python route to destination

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

// after this file create a python route named / addmake line