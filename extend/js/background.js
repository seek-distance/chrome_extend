var navText="";
function get(data){
	navText=data.navText;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
           	chrome.runtime.sendMessage(response);
        });  
    })
}
/*发送信息*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message);

	$.get('http://tm.jymao.com/ds/jobs/make-cate',{'name':message})
	.then(function(data){
		console.log(data)
		$.get('http://tm.jymao.com/ds/jobs/gen-descr?category='+data.cates[0],function(data){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	            chrome.tabs.sendMessage(tabs[0].id, {'text': data});  
	        })
		},"text")
	})

	/*$.get('http://tm.jymao.com/ds/jobs/gen-descr?category='+navText,function(data){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {'text': data}, function(response) {
               	//向 content_script 发送消息
            });  
        })
	},"text")*/
})

