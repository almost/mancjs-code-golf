play=n=>{
  var o = "";
  for (var i = 0; i < 8*n; i++) {
    for (var j = 0; j < 8; j++) {
      o += ((Math.floor(i/n)+j) % 2 ? ' ' : '#').repeat(n)
    }
    o += '\n'
  }
  return o;
}

a = 
b = ('#'.repeat(n)+' '.repeat(n)).repeat(4)+'\n';
play=n=>((('#'.repeat(n)+' '.repeat(n)).repeat(4)+'\n') +((' '.repeat(n)+'#'.repeat(n)).repeat(4)+'\n')).repeat(4)



r=(s,n=4)=>s.repeat(n);play=n=>r(['# ',' #'].map(y=>r(r(r(y[0],n)+r(y[1],n))+'\n',n)).join(''))


play=n=>['# ',' #'].map(y=>((y[0].repeat(n)+y[1].repeat(n)).repeat(4)+'\n').repeat(n)).join('').repeat(4)
// console.log(play(4))

play=n=>['# ',' #'].map(
  y=>
    (
      (
        y[0].repeat(n)+y[1].repeat(n)
      ).repeat(4)+'\n'
    ).repeat(n)
).join('').repeat(4)
