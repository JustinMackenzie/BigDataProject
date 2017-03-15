/* gobal $ */
$(document).ready(function() {
	//GET
	$("#query-button").on('click',function(){
		time = $('#date').val();
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
