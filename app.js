const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const P={users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5a3.3 3.3 0 010 6.5M18 14.4c2 .7 3.5 2.4 3.5 5.6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',grid:'<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.7"/></g>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',video:'<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/>',slash:'<path d="M4 4l16 16"/>',flip:'<path d="M4 8h12l-3-3M20 16H8l3 3"/>',spk:'<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z"/><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11"/>',end:'<path d="M3 14.5c5-4.5 13-4.5 18 0l-2.2 2.6-3.3-1.4v-2.6c-2.2-.8-4-.8-6 0v2.6l-3.3 1.4z" fill="currentColor"/>',plus:'<path d="M12 5v14M5 12h14"/>',back:'<path d="M20 6L9 17l-5-5"/>'};
const ico=(n,x='')=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n]}${x}</svg>`;
const DEF={name:'',mirror:true,q:'auto',theme:'auto',vol:70,vib:true,cam:'',mic:'',echo:true};
const D=Object.assign({contacts:[],recents:[]},JSON.parse(localStorage.getItem('vcp')||'{}'));D.s=Object.assign({},DEF,D.s);
const save=()=>localStorage.setItem('vcp',JSON.stringify(D));
let tab='contacts',q='',kd='',stream,facing='user',bag=[],last=-1,call=null,ac,ringT;
const T={contacts:['Contactos','users'],recents:['Recientes','clock'],keypad:['Teclado','grid'],settings:['Ajustes','gear']};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ini=n=>(n.trim()[0]||'#').toUpperCase();
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600)}
function theme(){const t=D.s.theme;document.documentElement.dataset.theme=t==='auto'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):t}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function when(t){const d=new Date(t),n=new Date();return (d.toDateString()===n.toDateString()?'Hoy':d.toLocaleDateString())+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
function render(){
 $('#ttl').textContent=T[tab][0];$('#addTop').innerHTML=ico('plus');$('#addTop').style.display=tab==='contacts'?'':'none';
 $$('nav button').forEach(b=>{b.className=b.dataset.tab===tab?'on':'';b.innerHTML=ico(T[b.dataset.tab][1])});
 const v=$('#view');
 if(tab==='contacts'){
  const l=D.contacts.filter(c=>(c.name+c.num).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name));
  v.innerHTML=`<input class="search" id="q" placeholder="Buscar contactos" value="${esc(q)}">`+(l.length?l.map(c=>`<div class="row"><div class="av">${ini(c.name)}</div><div class="t" data-act="edit" data-id="${c.id}"><b>${esc(c.name)}</b><small>${esc(c.num)}</small></div><button class="cb" data-act="call" data-n="${esc(c.name)}" data-u="${esc(c.num)}">${ico('video')}</button></div>`).join(''):`<div class="empty">${D.contacts.length?'Sin resultados':'Aún no tienes contactos.<br>Pulsa + para añadir el primero.'}</div>`);
  const i=$('#q');i.oninput=e=>{q=e.target.value;const p=e.target.selectionStart;render();const n=$('#q');n.focus();n.setSelectionRange(p,p)}
 }else if(tab==='recents'){
  v.innerHTML=D.recents.length?D.recents.map(r=>`<div class="row"><div class="av">${ini(r.name)}</div><div class="t"><b>${esc(r.name)}</b><small>${when(r.t)} · ${r.dur?fmt(r.dur):'Sin respuesta'}</small></div><button class="cb" data-act="call" data-n="${esc(r.name)}" data-u="${esc(r.num)}">${ico('video')}</button></div>`).join('')+'<button class="btn g" data-act="clr">Borrar historial</button>':'<div class="empty">No hay llamadas recientes</div>';
 }else if(tab==='keypad'){
  v.innerHTML=`<div class="kd">${esc(kd)||'&nbsp;'}</div><div class="pad">${'123456789*0#'.split('').map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div><div class="kr"><button class="ib" data-act="ksave" aria-label="Guardar">${ico('plus')}</button><button class="cb" data-act="kcall">${ico('video')}</button><button class="ib" data-act="kdel" aria-label="Borrar">⌫</button></div>`;
 }else settings();
}
async function settings(){
 const s=D.s,v=$('#view');let cams=[],mics=[];
 try{const d=await navigator.mediaDevices.enumerateDevices();cams=d.filter(x=>x.kind==='videoinput');mics=d.filter(x=>x.kind==='audioinput')}catch(e){}
 const op=(a,cur,ph)=>`<option value="">${ph}</option>`+a.map((x,i)=>`<option value="${x.deviceId}" ${x.deviceId===cur?'selected':''}>${esc(x.label||ph+' '+(i+1))}</option>`).join('');
 const sel=(k,o)=>`<select data-s="${k}">${o.map(([a,b])=>`<option value="${a}" ${s[k]===a?'selected':''}>${b}</option>`).join('')}</select>`;
 const ck=k=>`<input type="checkbox" data-s="${k}" ${s[k]?'checked':''}>`;
 if(tab!=='settings')return;
 v.innerHTML=`<div class="sec">Perfil</div><div class="set"><span>Tu nombre</span><input data-s="name" value="${esc(s.name)}" placeholder="Nombre visible"></div>
 <div class="sec">Vídeo</div><div class="set"><span>Cámara</span><select data-s="cam">${op(cams,s.cam,'Predeterminada')}</select></div>
 <div class="set"><span>Calidad</span>${sel('q',[['auto','Automática'],['hd','HD 720p'],['sd','Ahorro 480p']])}</div><div class="set"><span>Espejo en tu vista</span>${ck('mirror')}</div>
 <div class="sec">Audio</div><div class="set"><span>Micrófono</span><select data-s="mic">${op(mics,s.mic,'Predeterminado')}</select></div>
 <div class="set"><span>Cancelación de eco</span>${ck('echo')}</div><div class="set"><span>Volumen del tono</span><input type="range" min="0" max="100" data-s="vol" value="${s.vol}"></div><div class="set"><span>Vibración</span>${ck('vib')}</div>
 <div class="sec">Apariencia</div><div class="set"><span>Tema</span>${sel('theme',[['auto','Automático'],['dark','Oscuro'],['light','Claro']])}</div>
 <div class="sec">Datos</div><button class="btn g" data-act="perm">Revisar permisos de cámara y micrófono</button><button class="btn g d" data-act="wipe">Borrar todos los datos</button>
 <p class="empty">VideoChat Pro 2.4.1</p>`;
}
document.addEventListener('input',e=>{const k=e.target.dataset.s;if(!k)return;const t=e.target;D.s[k]=t.type==='checkbox'?t.checked:t.type==='range'?+t.value:t.value;save();if(k==='theme')theme()});
document.addEventListener('click',async e=>{
 const nb=e.target.closest('nav button');if(nb){tab=nb.dataset.tab;return render()}
 const kb=e.target.closest('[data-k]');if(kb){kd+=kb.dataset.k;return render()}
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='add')modal();else if(a==='edit')modal(D.contacts.find(c=>c.id===b.dataset.id));
 else if(a==='call')startCall(b.dataset.n,b.dataset.u);
 else if(a==='clr'){D.recents=[];save();render()}
 else if(a==='kdel'){kd=kd.slice(0,-1);render()}
 else if(a==='ksave'){if(kd)modal({num:kd})}
 else if(a==='kcall'){if(kd){const c=D.contacts.find(c=>c.num.replace(/\D/g,'')===kd.replace(/\D/g,''));startCall(c?c.name:kd,kd)}}
 else if(a==='perm')showPerm();
 else if(a==='wipe'&&confirm('¿Borrar contactos, historial y ajustes?')){localStorage.removeItem('vcp');location.reload()}
});
function modal(c={}){
 const m=$('#modal');m.classList.remove('hide');
 m.innerHTML=`<div class="box"><h2>${c.id?'Editar contacto':'Nuevo contacto'}</h2><input id="mn" placeholder="Nombre" value="${esc(c.name||'')}"><input id="mu" type="tel" inputmode="tel" placeholder="Número de teléfono" value="${esc(c.num||'')}"><button class="btn" id="ms">Guardar</button>${c.id?'<button class="btn g d" id="md">Eliminar</button>':''}<button class="btn g" id="mc">Cancelar</button></div>`;
 const close=()=>m.classList.add('hide');$('#mc').onclick=close;
 $('#ms').onclick=()=>{const n=$('#mn').value.trim(),u=$('#mu').value.trim();if(!n||!/\d{3,}/.test(u))return toast('Escribe un nombre y un número válido');
  if(c.id)Object.assign(D.contacts.find(x=>x.id===c.id),{name:n,num:u});else D.contacts.push({id:Date.now()+'',name:n,num:u});save();close();render()};
 if(c.id)$('#md').onclick=()=>{D.contacts=D.contacts.filter(x=>x.id!==c.id);save();close();render()};
}
async function getStream(){
 if(stream)stream.getTracks().forEach(t=>t.stop());
 const r={auto:{},hd:{width:{ideal:1280},height:{ideal:720}},sd:{width:{ideal:640},height:{ideal:480}}}[D.s.q]||{};
 const v={...r};if(D.s.cam&&facing==='user')v.deviceId={ideal:D.s.cam};else v.facingMode=facing;
 const au={echoCancellation:D.s.echo,noiseSuppression:true};if(D.s.mic)au.deviceId={ideal:D.s.mic};
 try{stream=await navigator.mediaDevices.getUserMedia({video:v,audio:au})}catch(e){if(e.name==='NotAllowedError'||e.name==='SecurityError')throw e;stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})}
 const lv=$('#lv');lv.srcObject=stream;lv.style.transform=facing==='user'&&D.s.mirror?'scaleX(-1)':'none';lv.play().catch(()=>{});return stream;
}
function showPerm(err){$('#perm').classList.remove('hide');$('#permTx').textContent=err?'No pudimos acceder a la cámara o al micrófono. Actívalos en los permisos del navegador o de la app y vuelve a intentarlo.':'VideoChat Pro necesita acceso a tu cámara y micrófono para hacer videollamadas.';$('#permBtn').textContent=err?'Reintentar':'Permitir acceso'}
$('#permBtn').onclick=async()=>{try{await getStream();stream.getTracks().forEach(t=>t.stop());localStorage.setItem('vcp-perm',1);$('#perm').classList.add('hide');render()}catch(e){showPerm(true)}};
const pick=()=>{if(!bag.length){bag=[0,1,2,3].sort(()=>Math.random()-.5);if(bag[0]===last)bag.push(bag.shift())}return last=bag.shift()};
function ring(on){clearInterval(ringT);if(!on||!D.s.vol)return;ac=ac||new(window.AudioContext||window.webkitAudioContext)();ac.resume();
 const beep=()=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=425;g.gain.value=D.s.vol/100*.12;o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+1)};beep();ringT=setInterval(beep,3000)}
const rnd=(a,b)=>(a+Math.random()*(b-a))*1000;
async function startCall(name,num){
 if(call)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return toast('Este navegador no permite cámara. Abre el enlace con HTTPS.');
 try{await getStream()}catch(e){return showPerm(true)}
 const rv=$('#rv'),c=call={name,num,t:Date.now(),timers:[],live:false,mic:true,cam:true,spk:true,dur:0};
 rv.src='videos/v'+(pick()+1)+'.mp4';rv.volume=0;rv.muted=false;rv.play().then(()=>{rv.pause();rv.currentTime=0}).catch(()=>{});
 $('#cName').textContent=name;$('#cAv').textContent=ini(name);$('#call').className='';
 $$('.ctl button').forEach(b=>{const k=b.dataset.c;b.className=k==='end'?'end':'';b.innerHTML=ico({mic:'mic',cam:'video',flip:'flip',spk:'spk',end:'end'}[k])});
 const st=t=>$('#cSt').textContent=t;st('Llamando…');ring(true);
 c.timers.push(setTimeout(()=>{ring(false);st('Conectando…');
  c.timers.push(setTimeout(()=>{
   rv.currentTime=0;rv.volume=1;
   rv.play().catch(()=>{rv.muted=true;rv.play();toast('Toca la pantalla para activar el sonido');$('#call').addEventListener('click',()=>rv.muted=false,{once:true})});
   rv.onplaying=()=>{if(c.live)return;c.live=true;$('#call').className='live';if(D.s.vib&&navigator.vibrate)navigator.vibrate(120);const t0=Date.now();st('00:00');c.iv=setInterval(()=>{c.dur=Math.round((Date.now()-t0)/1000);st(fmt(c.dur))},1000)};
   rv.onended=()=>{clearInterval(c.iv);st('Llamada finalizada');c.timers.push(setTimeout(hang,1400))};
  },rnd(2.5,4.5)))},rnd(3,5)));
 document.title=name+' · VideoChat Pro';$('#call').classList.remove('hide');
}
function hang(){
 const c=call;if(!c)return;call=null;c.timers.forEach(clearTimeout);clearInterval(c.iv);ring(false);
 const rv=$('#rv');rv.onplaying=rv.onended=null;rv.pause();rv.removeAttribute('src');rv.load();
 if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('#lv').srcObject=null;
 D.recents.unshift({name:c.name,num:c.num||'',t:c.t,dur:c.dur});D.recents=D.recents.slice(0,50);save();
 $('#call').classList.add('hide');document.title='VideoChat Pro';render();
}
$('.ctl').onclick=async e=>{const b=e.target.closest('button');if(!b||!call)return;const k=b.dataset.c,c=call;
 if(k==='end')return hang();
 if(k==='mic'){c.mic=!c.mic;stream.getAudioTracks().forEach(t=>t.enabled=c.mic);b.classList.toggle('off',!c.mic);b.innerHTML=ico('mic',c.mic?'':P.slash)}
 if(k==='cam'){c.cam=!c.cam;stream.getVideoTracks().forEach(t=>t.enabled=c.cam);b.classList.toggle('off',!c.cam);b.innerHTML=ico('video',c.cam?'':P.slash)}
 if(k==='spk'){c.spk=!c.spk;$('#rv').volume=c.spk?1:.35;b.classList.toggle('off',!c.spk)}
 if(k==='flip'){facing=facing==='user'?'environment':'user';try{await getStream();stream.getAudioTracks().forEach(t=>t.enabled=c.mic);stream.getVideoTracks().forEach(t=>t.enabled=c.cam)}catch(x){facing=facing==='user'?'environment':'user';toast('No se pudo cambiar de cámara')}}
};
theme();render();
if(!localStorage.getItem('vcp-perm'))setTimeout(()=>showPerm(),400);
if('serviceWorker'in navigator&&location.protocol.startsWith('http')&&location.hostname!=='localhost')navigator.serviceWorker.register('sw.js').catch(()=>{});
