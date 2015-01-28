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
			storageSet('blacklist', blacklist);
			if (arg2) arg2(blacklist);
		}
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

function unique(array)
{
	return array.sort().filter(function(element, index, array) {
		return element !== array[index - 1]
	});
}