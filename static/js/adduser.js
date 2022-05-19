$(document).ready(function(){
// using radio button to select it
  var selection;
  $('.gender').change(function()
  {
   selection = $(this).val();
  });

// check if form is submitted
   $("#errorAlert"). hide();
     $("#successAlert").hide();
       $("#progress").hide();


        $("#adduser").on('submit',function(event){
        //use ajax to send data to python
         $("#errorAlert"). hide();
         $("#successAlert").hide();
          $("#progress").show();

          var form_data = new FormData();
//          get the first file in the array
          form_data.append("files[]", document.getElementById("profile_pic").files[0])
          form_data.append("first_name",  $("#first_name").val())
          form_data.append("last_name",  $("#last_name").val())
          form_data.append("password",  $("#password").val())
          form_data.append("email",  $("#email").val())
          form_data.append("role",  $("#role").val())
          form_data.append("status",  $("#status").val())
          form_data.append("phone",  $("#phone").val())
          form_data.append("gender",  selection)

                $.ajax({
                     data: form_data,
                     type: 'POST', // method to use
                     url: '/adduser',
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

// after this file create a python route named / addmake line