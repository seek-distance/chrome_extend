chrome.runtime.onMessage.addListener(function(request, sender, response){
	if (!request.hasOwnProperty("text")) {
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
						imgItem.last().siblings().attr('value',imgUrl);
					}else{
						var tpl='<div class="thumb-container"><label><input type="radio" name="img_select" value="'+imgUrl+'" checked=""><img src="'+imgUrl+'"></label></div>';
						$(".commodity-image-list-container .col-md-12").append(tpl);
					}
					$(".commodity-image-list-container .thumb-container label").last().click();
					/*var top=Math.random()*100;
					var right=Math.random()*100;
					var price=$('input[data-fv-field="price"]').val();
					var templet='<div class="pswp__price_tag" style="top: '+top+'%; right: '+right+'%;">¥'+price+'</div>';
					$(".commodity-image-upload-container .thumb-container").append(templet);*/
					var formGroup=$(".commodity-image-upload-container .form-group").eq(2);
					formGroup.css('position','relative');
					formGroup.append('<button class="btn btn-danger reload" style="outline:none;position:absolute;right:0;top:0;padding:0 10px">重新生成</button>')
					$(".reload").click(function(){
						chrome.runtime.sendMessage(true);
					})
					$(".reload").click();
				}
				
			},300)
		}else{
			response(false);
		}
	}else{
		$("textarea[data-fv-field='description']").val(request.text);
	}	
	
})

