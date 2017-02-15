function get(data){
	console.log(data);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
           	chrome.runtime.sendMessage(response);
        });  
    })
}
