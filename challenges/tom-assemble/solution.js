


function play(n) {
  var v = 0;
  n.split('\n').map(x => {
    var [c,p] = x.split(' ');
    p = +p;
    v = {a: v+p, s: v-p, m: v*p}[c[0]];
  });
  return v
}

// console.log(play('ADD 10\nSUB 2\nMUL 3'))
