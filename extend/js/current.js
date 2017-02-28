var openUrl,oldVal,taobaoUrl,name,description,imgUrl;
var isSend=false;
var iframe=$($('iframe').get(0).contentWindow.document);
chrome.runtime.onMessage.addListener(function(request, sender, response){
	if (!request.hasOwnProperty("text")) {
		taobaoUrl=request.taobaoUrl;
		name=request.name;
		description=request.description;
		imgUrl=request.imgUrl;
		isSend=true;

		openUrl=taobaoUrl;
		
		domodal();
		/*if($("input[data-fv-field='name']").length==0){
			domodal();
		}else{
			response(false);
		}*/
	}else{
		$("textarea[data-fv-field='description']").val(request.text);
	}
})

function domodal(){
	if ($('.add-commodity-auto-button').length==0)	return;
	console.log(openUrl)
	$(".add-commodity-auto-button").parent().parent().find("input").val(openUrl);
	$(".add-commodity-auto-button").click();
	if (!isSend)	return;
	var timer=setInterval(function(){
		var nameInput=$("input[data-fv-field='price']");
		if(nameInput.val()!=undefined && nameInput.val()!=oldVal){
			clearInterval(timer);
			oldVal=nameInput.val();
			nameInput=$("input[data-fv-field='name']");				
			if(nameInput.val()!="" && (nameInput.val().length>20 || nameInput.val().length<6)){
				nameInput.val(name);
			}

			/*var imgItem = $(".commodity-image-list-container .thumb-container img");
			if(imgItem.length>=5){
				imgItem.last().attr('src',imgUrl);
				imgItem.last().siblings().attr('value',imgUrl);
			}else{
				var tpl='<div class="thumb-container"><label><input type="radio" name="img_select" value="'+imgUrl+'" checked=""><img src="'+imgUrl+'"></label></div>';
				$(".commodity-image-list-container .col-md-12").append(tpl);
			}
			$(".commodity-image-list-container .thumb-container label").last().click();*/

			setTimeout(function(){
				$(".reload").click();
			},200)
						
		}		
	},300)
}

setInterval(function(){
	iframe.find('.commodity-container .selectCommodityBtn').unbind("click");
	iframe.find('.commodity-container .selectCommodityBtn').click(function(){
		isSend=false;
		openUrl=$(this).parent().attr('_href');
		console.log(isSend)
	})
	if($('.togglePriceDirectionBtn').length == 1){
		if ($('.reload').length==0){
			var formGroup=$(".commodity-image-upload-container .form-group").eq(2);
			formGroup.css('position','relative');				
			formGroup.append('<button class="btn btn-danger reload" style="outline:none;position:absolute;right:0;top:0;padding:0 10px">重新生成</button>')
			$(".reload").click(function(){
				chrome.runtime.sendMessage(true);
			})
		}

		if ($('.insert-pic').length==0){
			$('.modal-footer').prepend('<button class="btn btn-danger insert-pic pull-left">插入图片</button>');
			$('.insert-pic').click(function(){
				var text=$("input[data-fv-field='name']").val();
				var updateSrc=$('.commodity-image-upload-container img').attr('src');
				$('.add-img-manual-button').click();
				var updateTimer=setInterval(function(){
					if($('.commodity-image-upload-container').length == 1){
						clearInterval(updateTimer);
						$('.commodity-image-upload-container img').attr("src",updateSrc);
						$('.commodity-image-upload-container .col-md-7 .form-group').addClass("has-success").find("input").val(updateSrc).siblings("span").find("small").attr("data-fv-result","VALID")
						$('.commodity-image-upload-container textarea').val(text);
						$("button[data-bb-handler='success']").click();
						$('.add-baby-button').click();
						$('iframe').get(0).contentWindow.document.getElementsByClassName('addLinkCommodityBtn')[0].click();
						domodal();							
					}
				},300)
			})
		}

	}

},300)


