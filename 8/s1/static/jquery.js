/* global $ */
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
		var date = $('#date').val();
		var time = $('#time').val();
		console.log(date);
		console.log(time);
		var newDate = new Date(Date.parse(date));
		var dateReadable = newDate.toDateString() + " " + time.toString();// Your timezone!
		console.log(dateReadable);
		var myDate = new Date(dateReadable); 
		//dateReadable = myDate.toDateString() + time.toString();// Your timezone!
		//console.log(dateReadable);
		var myEpoch = myDate.getTime()/1000.0;
		console.log(myEpoch);
		//time = $('#date').val();
		//console.log(time);
		 $.ajax({
			 url:'/api/query',
			 type:'get',
			 contentType:'application/json; charset=utf-8',
			 dataType: 'json',
			 data: {Time: myEpoch},
			 success:function(res){
				 console.log(res);
				 var tbodyEl = $('tbody');
                 tbodyEl.html('');
				 res.forEach(function(res){
					 tbodyEl.append('\
                    <tr>\
                    <td><input typr="text" class="name" value="'+res.Time+'"><br><td>\
                    <td><input type="text" class="age" value="'+res.Price+'"><td>\
                    <td>:<input type="text" class="email" value="'+res.Size+'"><td>\
                    <td><input type="text" class="gender" value="'+res.Exchange+'"><td>\
                    </tr>');
				 })
			
		 	}
		})
	})
});

