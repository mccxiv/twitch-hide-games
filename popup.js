
var listDom = $('.list');

blacklist(function(list)
{
	list.forEach(function(game)
	{
		var gameDom = $('<div class="game" data-game="'+game+'">'+game+'</div>');
		gameDom.appendTo(listDom);
	});
});

$(document).on('click', '.game', function(e)
{
	var game = $(e.target).data('game');
	$(e.target).fadeOut();
	unBlacklist(game, function()
	{
		unHide(game);
	});
});

function unHide(game)
{
	chrome.runtime.sendMessage({action: 'unHide', game: game});
}