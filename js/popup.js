var listTemplet='<li><div class="shop-img"><a href="#{taobaoUrl}" target="_blank"><img src="#{imgUrl}"></a></div><div class="shop-detail"><p class="shop-title"><a href="#{taobaoUrl}" target="_blank">#{name}</a></p><p class="shop-price">¥<span>#{price}</span><button data-descr="#{originalDescr}" data-time="#{createdAt}" data-imgUrl="#{imgUrl}" data-url="#{taobaoItemUrl}" class="fr addToPic">加入图集</button><a href="#{originalCollectionUrl}" target="_blank" class="origin fr">源</a></p></div></li>';

$(".nav-item").click(function() {
	$(".equal-header").text($(this).find("p").text());
	if(!$(this).hasClass('on')){
		$(this).addClass("on").siblings().removeClass("on");
		//$(".page-item").eq($(this).index()).fadeIn().siblings().hide();
		if($(this).hasClass('home-item')){
			$('.home').css('transform','translateX(0)');
			$('.user').css('transform','translateX(320px)');
		}else{
			$('.user').css('transform','translateX(0)');
			$('.home').css('transform','translateX(320px)');
		}
	}
})
$(".classify-nav").on("click","li",function() {
	if(!$(this).hasClass('on')){
		$(this).addClass("on").siblings().removeClass("on");
		$(".shopList").html('');
		var url="";
		if ($(this).index()==0) {
			url="http://www.jymao.com/ds/jobs/commodities";
		}else{
			url="http://www.jymao.com/ds/g/Commodity?condition[categories]="+ $(this).text() +"&limit=30"
		}
		doGet(url,listTemplet,$('.shopList'));
	}
})

$(".lose-title").click(function() {
	$(".lose-content").slideToggle();
})
$(".confirm-pwd").blur(function() {
	if($(this).val() != $('.pwd').val() || $(this).val()==""){
		$('.error').text('两次输入密码不一致').show();
	}else{
		$('.error').hide();
	}
})
$(".pwd").blur(function() {
	if($('.confirm-pwd').val() != ""  &&  $(this).val() != $('.confirm-pwd').val()){
		$('.error').text('两次输入密码不一致').show();
	}else{
		$('.error').hide();
	}
})

doGet("http://www.jymao.com/ds/g/Category","<li>#{name}</li>",$(".classify-nav"));
doGet("http://www.jymao.com/ds/jobs/commodities",listTemplet,$(".shopList"));

$(".shopList").on('click','button',function(){
	var taobaoUrl=$(this).attr('data-url');
	var description=$(this).attr('data-descr');
	var name=$(this).parent().siblings('.shop-title').text();
	var imgUrl=$(this).attr('data-imgUrl');
	var data={"taobaoUrl":taobaoUrl,"name":name,"description":description,"imgUrl":imgUrl};

	chrome.tabs.getSelected(null, function(tab) {
	 	if(/http(s{0,1})\:\/\/kolplatform\.jinritemai\.com\/index\/article\/addArticle.*/.test(tab.url)){
	 		var bg=chrome.extension.getBackgroundPage();
	 		bg.get(data);
	 	}else{
	 		$('.message').text("请进入添加图集页面");
	 		$('.link').html('<a target="_blank" href="https://kolplatform.jinritemai.com/index/article/addArticle?content_type=2&sig=1487080371312.262">确定</a>');
	 		$('.message-fix').fadeIn();
	 	}
	});
	
})
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(!message){
 		$('.message').text("请进入添加宝贝窗口");
 		$('.link').html('确定');
		$('.message-fix').fadeIn();
	}
})
$('.modal span').click(function(event){
	event.stopPropagation();
	$('.message-fix').fadeOut();
})
$(document).click(function(){
	console.log(2)
	$('.modal span').last().click();
})

var isOk=true;
$(".shopList").scroll(function(){
	setTimeout(function(){
		if(checkSlide() && isOk){
			isOk=false;
			var url="";
			var lastShopTime =  $(".shopList li").last().find('button').attr('data-time');
			if($('.classify-nav .on').index()==0){
				url="http://www.jymao.com/ds/g/Commodity?olderThan="+ lastShopTime +"&limit=30";
			}else{
				url="http://www.jymao.com/ds/g/Commodity?condition[categories]="+ $('.classify-nav .on').text() +"&limit=30&olderThan="+ lastShopTime;
			}
			$.get(url,function(data){
				for (var i = 1; i < data.length; i++) {
					if(data[i].taobaoUrl.indexOf(".jd.com")!= -1 || data[i].taobaoUrl.indexOf("ai.taobao.com") != -1)	continue;
					var str=listTemplet;
					var newStr=repeatStr(str,data[i]);
					$(".shopList").append(newStr);
				}
				isOk=true;
			})
		}
	},300)
	
})


function checkSlide(){
	var lastShopTop=$(".shopList li").last().get(0).offsetTop + ($(".shopList li").last().outerHeight())/2;
	var winH=$(".shopList").scrollTop() + $(".shopList").outerHeight();
	return (winH > lastShopTop) ? true : false;
}

function doGet(url,tpl,ele,fn){
	$.get(url,function(data){
		for (var i = 0; i < data.length; i++) {
			if(data[i].taobaoUrl){
				if(data[i].taobaoUrl.indexOf(".jd.com")!= -1 || data[i].taobaoUrl.indexOf("ai.taobao.com") != -1)	continue;
			}
			var newStr=repeatStr(tpl,data[i]);
			ele.append(newStr);
		}
		fn && fn();
	})
}
function repeatStr(str,data){
	var s=str.replace(/#\{(.*?)\}/ig,function(match,value){
		return data[value];
	})
	return s;
}

/*获取url
chrome.tabs.getSelected(null, function(tab) { console.log(tab.url); });
*/

/*页面通信background，content，popup
C->P 或者 C->B 或者 b->p
chrome.runtime.sendMessage({'名称':'传送数据'})
P->C  B->C
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
           chrome.tabs.sendMessage(tabs[0].id, {'名称':'值'}, function(response) {
               	//向 content_script 发送消息
           });  
       })
接收消息都是 
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
alert(JSON.stringify(message)) //这里获取到消息值与名称
})*/