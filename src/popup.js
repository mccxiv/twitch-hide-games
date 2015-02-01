
function addStateClasses()
{
	blacklist(function(list)
	{
		if (!list.length) $('html').addClass('blacklist-empty');
	});
}

function updateContentScript()
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, {settingsUpdated: true});
	});
}

blacklist(function(list)
{
	list.forEach(function(game)
	{
		var gameDom = $('<div class="game" data-game="'+game+'">'+game+'</div>');
		$('.list').append(gameDom);
	});
	addStateClasses();
});

$(document).on('click', '.game', function(e)
{
	var game = $(e.target).data('game');
	unBlacklist(game, function()
	{
		$(e.target).fadeOut(addStateClasses);
		updateContentScript();
	});
});

storageGet('disabled', function(disabled)
{
	if (disabled) $('.disabled-checkbox').prop('checked', true);
});

$(document).on('change', '.disabled-checkbox', function(e)
{
	storageSet('disabled', !!e.target.checked, updateContentScript);
});

$('.version').html(chrome.runtime.getManifest().version);