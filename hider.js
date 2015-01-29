function init()
{
	// Watch the DOM for changes
	var observer = new MutationObserver(function()
	{
		if ($('.streams').length)
		{
			addHideButtons();
			if (blacklistCache) hideBlacklisted(blacklistCache);
			if (!iconShown)
			{
				console.log('SHOWING ICON');
				iconShown = true;
				chrome.runtime.sendMessage({action: 'showPageAction'});
			}
		}

		else
		{
			if (iconShown)
			{
				console.log('HIDING ICON');
				iconShown = false;
				chrome.runtime.sendMessage({action: 'hidePageAction'});
			}
		}
	});

	observer.observe(document, {childList: true, subtree: true});

	blacklist(function(list)
	{
		blacklistCache = list;
		hideBlacklisted(list);
	});

	chrome.runtime.onMessage.addListener(function(request)
	{
		if (request.action === 'unHide')
		{
			getStreamDom(request.game).fadeIn();
			blacklist(function(list)
			{
				blacklistCache = list;
			});
		}
	});
}

function hideBlacklisted(blacklist)
{
	blacklist.forEach(function(game)
	{
		getStreamDom(game).hide();
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

function getStreamDom(game)
{
	var boxart = 'a.boxart[title="'+game+'"], a.boxart[original-title="'+game+'"]';
	return $(boxart).closest('.stream');
}

// Caching because chrome's storage is async...
var blacklistCache;
var iconShown = false;

init();