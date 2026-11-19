// Механика понятности: тот же расчёт, что scripts/mechanics.py. Сайт подключает этот файл,
// тест сравнивает его числа с Python на одном наборе текстов (tests/run_tests.py, шаг «механика»).
// Граница слова — любой символ, кроме буквы; округление половины вверх.
(function(root){
const VOW=new Set('аеёиоуыэюяaeiouy');
const words=s=>s.match(/[а-яёa-z]+(?:-[а-яёa-z]+)*/gi)||[];
const syl=w=>[...w.toLowerCase()].filter(c=>VOW.has(c)).length;
const CONN=["потому что","поэтому","значит","то есть","так что","поскольку","следовательно","однако","но","зато","хотя","если","тогда","например","скажем","во-первых","во-вторых","итак","в итоге"];
const B='(^|[^а-яёa-z])',E='(?=[^а-яёa-z]|$)';
const ADDR=new RegExp(B+'(ты|тебе|тебя|тобой|твой|твоя|твоё|твое|твои|вы|вам|вас|ваш|ваша|ваши|you|your|yours)'+E,'gi');
const EX=new RegExp(B+'(например|скажем|вот|допустим|к примеру)'+E,'gi');
function sentences(t){const flat=t.replace(/([^\n])\n(?!\n)/g,'$1 ');return flat.split(/(?<=[.!?…])[»"”)]*\s+|\n{2,}/).map(x=>x.trim()).filter(x=>words(x).length)}
function paragraphs(t){let b=t.split(/\n\s*\n/).filter(p=>words(p).length);if(b.length<=1)b=t.split('\n').filter(p=>words(p).length);return b}
const median=a=>{const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length?(s.length%2?s[m]:(s[m-1]+s[m])/2):0};
// подсчёт без пересечений с учётом того, что граница-символ входит в совпадение: «но но» считается дважды
const cnt=(re,t)=>{let c=0;re.lastIndex=0;let m;while((m=re.exec(t))){c++;re.lastIndex=m.index+m[1].length+m[2].length}return c};
const rnd=(x,nd=0)=>{const k=10**nd;return Math.floor(x*k+0.5)/k};
function mech(t){
 const W=words(t);if(!W.length)return null;
 const n=W.length,S=sentences(t),L=S.map(s=>words(s).length),P=paragraphs(t).map(p=>words(p).length),low=t.toLowerCase();
 const Ls=L.length?L:[0],Ps=P.length?P:[0];
 const per=c=>rnd(c*1000/n,1);
 const longS=S.filter((s,i)=>L[i]>=25).sort((a,b)=>b.length-a.length);
 const longW=W.filter(w=>syl(w)>=5).length;
 let conn=0;CONN.forEach(c=>{conn+=cnt(new RegExp(B+'('+c.replace('-','\\-')+')'+E,'g'),low)});
 return {n,sent:S.length,par:P.length,med:median(Ls),mean:rnd(Ls.reduce((a,b)=>a+b,0)/Ls.length,1),long:rnd(100*longS.length/(S.length||1)),
  lw:rnd(100*longW/n,1),pmed:median(Ps),pmax:Math.max(...Ps),conn:per(conn),q:per((t.match(/\?/g)||[]).length),
  addr:per(cnt(ADDR,t)),ex:per(cnt(EX,t)),excl:per((t.match(/!/g)||[]).length),longS};
}
root.textcheckMech=mech;
if(typeof module!=='undefined')module.exports=mech;
})(typeof window!=='undefined'?window:globalThis);
