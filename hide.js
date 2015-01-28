
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
}

function blacklist(arg1, arg2)
{
	storageGet('blacklist', function(list)
	{
		if (typeof arg1 === 'function') arg1(list);
		else
		{
			var blacklist = list || [];
			blacklist.push(arg1);
			blacklist = unique(blacklist);
			console.log('BLACKLIST', blacklist);
			storageSet('blacklist', blacklist);
			hideBlacklisted(blacklist);
			blacklistCache = blacklist;
			if (arg2) arg2(blacklist);
		}
	});
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

function triggerScroll()
{
	var evt = document.createEvent("UIEvents");
	evt.initEvent('scroll', true, true); // event type,bubbling,cancelable
	$('.streams').get(0).dispatchEvent(evt);
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
	blacklist(game);
	event.stopImmediatePropagation();
	event.preventDefault();
}

function unBlackList(game)
{
	console.log('unblacklist NYI');
}

function storageSet(key, value)
{
	var obj = {};
	obj[key] = value;
	chrome.storage.sync.set(obj);
}

function storageGet(key, cb)
{
	chrome.storage.sync.get(key, function(result)
	{
		cb(result[key])
	});
}

/**
 * Returns a copy of array with duplicates removed
 * @param array {Array}
 * @returns {Array}
 */
function unique(array)
{
	return array.sort().filter(function(element, index, array) {
		return element !== array[index - 1]
	});
}