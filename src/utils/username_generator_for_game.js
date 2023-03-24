const usernameGenerator = () => {
    var a = ['star', 'optimus', 'mega', 'light', 'lightning', 'uri', 'yoshu', 'spider', 'moon', 'shock', 'sound', 'croma', 'diamond', 'swam', 'jet'];
    var b = ['screen', 'prime', 'tron', 'sabber', 'strike', 'san', 'kun', 'man', 'knight', 'wave', 'stone', 'head', 'fire', 'ray'];

    var rA = Math.floor(Math.random() * a.length);
    var rB = Math.floor(Math.random() * b.length);

    var name = a[rA] + b[rB];

    return name;
}

module.exports = { usernameGenerator }