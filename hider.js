
// Caching because chrome's storage is async...
var blacklistCache;

init();

function init()
{
	// Watch the DOM for changes
	var observer = new MutationObserver(function()
	{
		addHideButtons();
		if (blacklistCache) hideBlacklisted(blacklistCache);
	});

	observer.observe(document, {childList: true, subtree: true});

	blacklist(function(list)
	{
		blacklistCache = list;
		hideBlacklisted(list);
	});

	chrome.runtime.sendMessage({showPageAction: true});
}

function hideBlacklisted(blacklist)
{
	blacklist.forEach(function(game)
	{
		var selector = 'a.boxart[title="'+game+'"], a.boxart[original-title="'+game+'"]';
		$(selector).each(function(i, element)
		{
			$(element).closest('.stream').hide();
		});
	});

	triggerScroll();
}

// because if there are too few games after filtering it won't trigger ajax for more
function triggerScroll()
{
	var evt = document.createEvent("UIEvents");
	evt.initEvent('scroll', true, true); // event type, bubbling, cancelable
	$('.streams').each(function(e, el) {el.dispatchEvent(evt)});
}

function addHideButtons()
{
	$('.boxart:not(.thg-processed)').each(function(i, boxart)
	{
		var closeButton = $('<div class="thg-hide-button">');
		$(boxart).addClass('thg-processed').append(closeButton);
		closeButton.on('click', blacklistFromButton);
	});
}

function blacklistFromButton(event)
{
	var game = $(event.currentTarget).closest('a').attr('original-title');
	blacklist(game, function(list)
	{
		blacklistCache = list;
		hideBlacklisted(list);
	});
	event.stopImmediatePropagation();
	event.preventDefault();
}