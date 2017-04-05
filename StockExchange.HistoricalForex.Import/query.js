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
	    var	dateReadable = newDate.toDateString() + " " + time.toString();// Your timezone!
		console.log(dateReadable);
		var myDate = new Date(dateReadable); 
		//dateReadable = myDate.toDateString() + time.toString();// Your timezone!
		//console.log(dateReadable);
		var myEpoch = myDate.getTime()/1000.0+86400;
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
				 var tbodyEl = $("#querytable");
                 tbodyEl.html('');
				 res.forEach(function(res){
					 tbodyEl.append('\
					 <tr>\
					 <td>'+res.Time+'</td>\
					 <td>'+res.Price+'</td>\
					 <td>'+res.Size+'</td>\
					 <td>'+res.Exchange+'</td>\
					 </tr>');
				 })
			
		 	}
		})
	})

	$("#avg-button").on('click',function(){
		/*var year = $('#year').val();
		var month = $('#month').val();
		var day = $('#day').val();
		var hour = $('#hour').val();
		var minute = $('#minute').val();
		var second = $('#second').val();
*/
		var avg = $('#avgday').val();
		//var time = $('#time').val();
		console.log(avg);
		//console.log(time);
		//var newDate = new Date(Date.parse(date));
		//dateReadable = newDate.toDateString() + " " + time.toString();// Your timezone!
		//console.log(dateReadable);
		//var myDate = new Date(dateReadable); 
		//dateReadable = myDate.toDateString() + time.toString();// Your timezone!
		//console.log(dateReadable);
		//var myEpoch = myDate.getTime()/1000.0+86400;
		//console.log(myEpoch);
		//time = $('#date').val();
		//console.log(time);
		 $.ajax({
			 url:'/api/average',
			 type:'get',
			 contentType:'application/json; charset=utf-8',
			 dataType: 'json',
			 data: {day: avg},
			 success:function(res){
				 console.log(res);
				 var tbodyEl = $("#dailytable");
                 tbodyEl.html('');
				 res.forEach(function(res){
					 tbodyEl.append('\
					 <tr>\
					 <td>'+res.day+'</td>\
					 <td>'+res.totalprize+'</td>\
					 <td>'+res.totalnumber+'</td>\
					 <td>'+res.average+'</td>\
					 </tr>');
				 })
			
		 	}
		})
	})
});

