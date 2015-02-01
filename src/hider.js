var blacklistCache;
var disabledCache;
var isIconShown;

function init()
{
	onSettingsUpdate(function()
	{
		updateCaches(processBlacklist);
	});

	updateCaches(function()
	{
		var observer = new MutationObserver(domChangeHandler);
		observer.observe(document, {childList: true, subtree: true});
	})
}

function onSettingsUpdate(handler)
{
	chrome.runtime.onMessage.addListener(function(request)
	{
		if (request.settingsUpdated)
		{
			handler();
		}
	});
}

function domChangeHandler()
{
	if (pageHasStreamsOrGames())
	{
		processBlacklist();
		showPageAction();
	}

	else
	{
		hidePageAction();
	}
}

function showPageAction()
{
	if (!isIconShown)
	{
		isIconShown = true;
		chrome.runtime.sendMessage({action: 'showPageAction'});
	}
}

function hidePageAction()
{
	if (isIconShown)
	{
		isIconShown = false;
		chrome.runtime.sendMessage({action: 'hidePageAction'});
	}
}

function updateCaches(cb)
{
	blacklist(function(list)
	{
		blacklistCache = list;
		storageGet('disabled', function(disabled)
		{
			disabledCache = disabled;
			if (cb) cb();
		})
	})
}

function pageHasStreamsOrGames()
{
	return getStreams().length > 0 || getGames().length > 0;
}

function processBlacklist()
{
	$('.stream').show();
	$('.game.item').show();
	if (disabledCache)
	{
		$('.thg-hide-button').hide();
	}
	else
	{
		$('.thg-hide-button').show();
		addHideButtons();
		blacklistCache.forEach(function(game)
		{
			getStreams(game).hide();
			getGames(game).hide()
		});
		triggerScroll();
	}
}

// because if there are too few games after filtering it won't trigger ajax and load more
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
		closeButton.on('click', blacklistFromButton); // todo change to generic event
	});
}

function blacklistFromButton(event)
{
	var gameA = $(event.currentTarget).closest('a');
	var game = gameA.attr('original-title') || gameA.attr('title');

	console.log('GAME CLICKED:', game);

	blacklist(game, function(list)
	{
		blacklistCache = list;
		processBlacklist();
	});
	event.stopImmediatePropagation();
	event.preventDefault();
}

/**
 * Get stream elements that are candidates for blacklisting
 * That is, excludes streams the user is following
 *
 * @param {string} [game] - No game means return all
 * @returns {jQuery}
 */
function getStreams(game)
{
	var selector = 'a.boxart';
	if (game) selector = 'a.boxart[title="'+game+'"], a.boxart[original-title="'+game+'"]';
	var streams = $(selector).closest('.stream');
	return streams.filter(function()
	{
		// if it has [data-tt_medium] then it's a stream in the followers page, do not return it
		return $(this).find('a[data-tt_medium]').length === 0;
	});
}

/**
 * Get game elements that are candidates for blacklisting
 * That is, excludes games the user is following
 *
 * @param {string} [game] - No game means return all
 * @returns {jQuery}
 */
function getGames(game)
{
	var selector = 'a.game-item:not([data-tt_medium])';
	if (game) selector = 'a.game-item[title="'+game+'"]:not([data-tt_medium])';
	return $(selector).closest('.game.item');
}

init();