
chrome.runtime.onMessage.addListener(function(request, sender)
{
	if (request.showPageAction)
	{
		chrome.pageAction.show(sender.tab.id);
	}
});