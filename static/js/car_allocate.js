$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#dresults").hide();
 $("#notfound").hide();

        $("#finddriver").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        id_no: $("#id_no").val() // get make value from html form

                     },
                     type: 'POST', // method to use
                     url: '/finddriver' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                        if(data.error){
                        // update html with error
                            console.log("error encountered");
                            $("#errorAlert").text(data.error).show();
                            $("#notfound").hide();
                            $("#dresults").hide();
                            $("#dresults2").hide()

                        }
                        else if(data.notfound){
                            console.log("data not found");
                            $("#notfound"). text(data.notfound).show();
                            $("#errorAlert").hide();
                            $("#dresults").hide();$("#dresults2").hide()


                        }
                        else{
                            console.log(data.data[1]);
                            $("#errorAlert").hide();
                            $("#notfound").hide();
                            $("#dresults").text(data.data[1] + " "+ data.data[2]).show();
                            $("#dresults2").text("DL:  "+data.data[5] + "  ID:  "+ data.data[6]).show();
                            document.getElementById("driver_id").value = data.data[0]
//                            what happens at 43,44 and 45

                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit

//        do for vehicle
   $("#errorAlert1"). hide();
 $("#dresults1").hide();
 $("#notfound1").hide();


        $("#findvehicle").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        reg_no: $("#reg_no").val() // get make value from html form

                     },
                     type: 'POST', // method to use
                     url: '/findvehicle' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                                            if(data.error){
                        // update html with error
                            console.log("error encountered");
                            $("#errorAlert1").text(data.error).show();
                            $("#notfound1").hide();
                            $("#vresults").hide();

                        }
                        else if(data.notfound){
                            console.log("data not found");
                            $("#notfound1"). text(data.notfound).show();
                            $("#errorAlert1").hide();
                            $("#vresults").hide();


                        }
                        else{
                            console.log(data.data[1]);
                            $("#errorAlert1").hide();
                            $("#notfound1").hide();
                            $("#vresults").html(data.data[0] + "<br>Make "+ data.data[3]).show();
                             document.getElementById("plate_no").value = data.data[0]


                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit

});// end ready

// after this file create a python route named