$(document).ready(function(){
// check if form is submitted
   $("#errorAlert"). hide();
 $("#aresults").hide();
 $("#notfound").hide();

        $("#findassignment").on('submit',function(event){
        //use ajax to send data to python


                $.ajax({
                    data: {
                        driver_id2: $("#driver_id2").val() // get make value from html form

                     },
                     type: 'POST', // method to use
                     url: '/findassignment' // python route to destination

                })// end ajax
                .done(function(data){
                     // from python route, this code expects success or errors
                        if(data.error){
                        // update html with error
                            console.log("error encountered");
                            $("#errorAlert").text(data.error).show();
                            $("#notfound").hide();
                            $("#aresults").hide();

                        }
                        else if(data.notfound){
                            console.log("data not found");
                            $("#notfound"). text(data.notfound).show();
                            $("#errorAlert").hide();
                            $("#aresults").hide();


                        }
                        else{

                            $("#aresults").text("");
                             for(let i = 0; i < data.data.length; i++){
//                             understand how to change a list to json
                                 $("#aresults").append(data.data[i].assign_date + "<br/>Time:" + data.data[i].assign_time+"<br/>From:" + data.data[i].assign_from+"<br/>To:"+data.data[i].assign_to+"<br/><br/>").show();

                             }

                            console.log("Data"+data.data[0].assign_date);
                            $("#errorAlert").hide();
                            $("#notfound").hide();
//                            $("#aresults").text(data.data).show();

//                            what happens at 43,44 and 45

                        // update html with success
                        }
                });// end of done
                // jquery should stop the from from "moving" as usual /default

                event.preventDefault();
        });// end on submit
});