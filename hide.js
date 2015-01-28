
// create an observer instance
var observer = new MutationObserver(function(mutations)
{
	$('.boxart:not(.thg-processed)').each(function(i, boxart)
	{
		var closeButton = $('<div class="thg-hide-button">');
		$(boxart).addClass('thg-processed').append(closeButton);
		closeButton.on('click', function(e)
		{
			var game = $(e.currentTarget).closest('a').attr('original-title');
			blacklist(game);
			e.stopImmediatePropagation();
			e.preventDefault();
		});
	})
});

observer.observe(document, {childList: true, subtree: true});

function blacklist(arg1, arg2)
{
	storageGet('blacklist', function(list)
	{
		if (typeof arg1 === 'function') arg1(list);
		else
		{
			var blacklist = list || [];
			blacklist.push(arg1);
			storageSet('blacklist', blacklist);
			console.log('LIST', blacklist);
			hideBlacklisted(blacklist);
			if (arg2) arg2(blacklist);
		}
	});
}

function hideBlacklisted(blacklist)
{
	blacklist.forEach(function(game)
	{
		$('[original-title="'+game+'"]').closest('.stream').hide();
	});
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