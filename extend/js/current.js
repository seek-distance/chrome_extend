chrome.runtime.onMessage.addListener(function(request, sender, response){
	if (!request.hasOwnProperty("text")) {
		var taobaoUrl=request.taobaoUrl;
		var name=request.name;
		var description=request.description;
		var imgUrl=request.imgUrl;
		
		if(!$(".modal").hasClass('bootbox')){
			domodal();
		}else{
			response(false);
		}
	}else{
		$("textarea[data-fv-field='description']").val(request.text);
	}
	
	function domodal(){
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
				var imgItem = $(".commodity-image-list-container .thumb-container img");
				if(imgItem.length>=5){
					imgItem.last().attr('src',imgUrl);
					imgItem.last().siblings().attr('value',imgUrl);
				}else{
					var tpl='<div class="thumb-container"><label><input type="radio" name="img_select" value="'+imgUrl+'" checked=""><img src="'+imgUrl+'"></label></div>';
					$(".commodity-image-list-container .col-md-12").append(tpl);
				}
				$(".commodity-image-list-container .thumb-container label").last().click();

				var formGroup=$(".commodity-image-upload-container .form-group").eq(2);
				formGroup.css('position','relative');
				formGroup.append('<button class="btn btn-danger reload" style="outline:none;position:absolute;right:0;top:0;padding:0 10px">重新生成</button>')
				$(".reload").click(function(){
					chrome.runtime.sendMessage(true);
				})
				$(".reload").click();

				$('.modal-footer').prepend('<button class="btn btn-danger insert-pic pull-left">插入图片</button>');
				$('.insert-pic').click(function(){
					var updateSrc=$('.commodity-image-upload-container img').attr('src');
					$('.add-img-manual-button').click();
					var updateTimer=setInterval(function(){
						if($('.commodity-image-upload-container').length == 1){
							clearInterval(updateTimer);
							$('.commodity-image-upload-container img').attr("src",updateSrc);
							$('.commodity-image-upload-container .col-md-7 .form-group').addClass("has-success").find("input").val(updateSrc).siblings("span").find("small").attr("data-fv-result","VALID")
							$('.commodity-image-upload-container textarea').val(name);
							$("button[data-bb-handler='success']").click();
							domodal();
						}
					},300)
				})
			}		
		},300)
	}
})


