
chrome.runtime.onMessage.addListener(function(request, sender)
{
	if (request.action === 'showPageAction')
	{
		chrome.pageAction.show(sender.tab.id);
	}

	else if (request.action === 'hidePageAction')
	{
		chrome.pageAction.hide(sender.tab.id);
	}
});