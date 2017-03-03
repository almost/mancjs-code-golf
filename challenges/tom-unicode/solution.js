var r = c => String.fromCodePoint(0x1f1E6 + c.charCodeAt(0) - 65)
var play = x => x.map(y=>r(y[0]) + r(y[1]))

// var l = "CN🇨🇳DE🇩🇪ES🇪🇸FR🇫🇷GB🇬🇧IT🇮🇹JP🇯🇵KR🇰🇷RU🇷🇺US🇺🇸".match(/.{6}/g);
// var play = x => x.map(y => l.find(z => z.slice(0,2) == y).slice(2))
