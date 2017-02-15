chrome.runtime.onMessage.addListener(function(request, sender, response){
	var taobaoUrl=request.taobaoUrl;
	var name=request.name;
	var description=request.description;
	var imgUrl=request.imgUrl;
	
	if(!$(".modal").hasClass('bootbox')){
		$(".add-commodity-auto-button").parent().parent().find("input").val(taobaoUrl);
		$(".add-commodity-auto-button").click();
		var timer=setInterval(function(){
			var nameInput=$("input[data-fv-field='name']");
			if(nameInput.val()!=undefined){
				clearInterval(timer);
				nameInput=$("input[data-fv-field='name']");				
				if(nameInput.val()!="" && (nameInput.val().length>20 || nameInput.val().length<6)){
					nameInput.val(name);
				}
				$("textarea[data-fv-field='description']").val(description);
				var imgItem = $(".commodity-image-list-container .thumb-container img");
				if(imgItem.length>=5){
					imgItem.last().attr('src',imgUrl);
				}else{
					var tpl='<div class="thumb-container"><label><input type="radio" name="img_select" value="'+imgUrl+'" checked=""><img src="'+imgUrl+'"></label></div>';
					$(".commodity-image-list-container .col-md-12").append(tpl);
				}
				/*var top=Math.random()*100;
				var right=Math.random()*100;
				var price=$('input[data-fv-field="price"]').val();
				var templet='<div class="pswp__price_tag" style="top: '+top+'%; right: '+right+'%;">¥'+price+'</div>';
				$(".commodity-image-upload-container .thumb-container").append(templet);*/

			}
			
		},300)
	}else{
		response(false);
	}
	
})

