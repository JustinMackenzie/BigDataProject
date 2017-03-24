/* gobal $ */
$(document).ready(function() {
	//GET
	$("#query-button").on('click',function(){
		/*var year = $('#year').val();
		var month = $('#month').val();
		var day = $('#day').val();
		var hour = $('#hour').val();
		var minute = $('#minute').val();
		var second = $('#second').val();
*/
		var date = document.getElementById("date");
		var time = document.getElementById("time");

		var myDate = new Date(date, time); // Your timezone!
		
		var myEpoch = myDate.getTime()/1000.0;
		//time = $('#date').val();
		console.log(time);
		 $.ajax({
			 url:'/api/query',
			 type:'get',
			 contentType:'application/json; charset=utf-8',
			 dataType: 'json',
			 data: {Time: time},
			 success:function(res){
				 console.log(res);
        		var output = '<div>';
        		$.each(res, function(key,res){
            
        	output += '<div class="well "style="background-color: #eaf7f9">';
        	output += '<h3>TIME: <i>  ' +res.Time +'</i></h3>';
        	output += '<p>PRICE: <i> ' +res.Price+'</i></p>';
        	output += '<p>SIZE:  <i> ' +res.Size +'</i></p>';
        	output += '<p>EXCHANGE:  <i> ' +res.Exchange +'</i></p>';
        	output += '<hr/>';
        //}
        	output += '</div>';  
    		});
    	output += '</div>';
    	$('#stocks').html(output);
			 }
		 })
	})
});

var myDate = new Date("July 1, 1978 02:30:00"); // Your timezone!
var myEpoch = myDate.getTime()/1000.0;
document.write(myEpoch);