'use strict';
const visual=window.StudyRoomVisual;
const day=new URLSearchParams(location.search).get('day')==='1'?1:0;
const storageKey='colearn-room-v1-'+(day===1?'sun':'sat');
let data={},learning={};
try{data=JSON.parse(localStorage.getItem(storageKey))||{}}catch{}
try{learning=JSON.parse(localStorage.getItem('up-weekend-reading-original-v2'))||{}}catch{}
const record=learning.records?.[day]||{};
record.activity=[...new Set([...(data.roomActivity||[]),...(data.reactions||[]),...(record.activity||[])])].slice(0,12);
delete record.focusedPeer;
const mine=Number.isInteger(record.seat)&&record.seat<9?record.seat:1;
const peers={0:'小麦',2:'小舟',4:'阿禾',6:'小林'};
for(const [seat,name] of Object.entries(record.demoPeers||{}))if(Number(seat)<9&&Number(seat)!==mine)peers[seat]=name;
const title=day===0?'英语说明文阅读 · 找到细节证据':'两句线索，哪句在误导你？';
const completed=learning.records?.filter(r=>r.finished).length||0;
const main=document.querySelector('main');
const dialog=document.querySelector('dialog');
const field=document.querySelector('#shareText');
const escape=visual.escape;
let selectedPeer=null,notice='';

function save(){data.roomActivity=record.activity;try{localStorage.setItem(storageKey,JSON.stringify(data))}catch{}}
function button(action,label,attrs=''){return '<button type="button" data-action="'+action+'" '+attrs+'>'+label+'</button>';}
function status(person,isMe){
  if(isMe)return record.finished?['已完成','done']:['本节待完成','idle'];
  if(person==='小麦')return ['已完成','done'];
  if(person==='小舟')return ['订正中','repair'];
  if(person==='小林')return ['未启动','idle'];
  return ['学习中','repair'];
}
function feedRows(){
  const rows=[
    {person:'小麦',kind:'已学完',text:'小麦已经学完，保持正学20次'},
    {person:'小舟',kind:'订正中',text:'小舟正在订正！'},
    {person:'小红',kind:'分享收获',text:'我学会了先找题干关键词，再回原文找证据。'},
    {person:'小雨',kind:'分享感受',text:'和伙伴一起学，更愿意坚持把这一课完成。'}
  ];
  if(data.story)rows.unshift({person:'睿睿',kind:'分享'+(data.shareKind||'收获'),text:data.story});
  return rows;
}
function render(){
  for(const [seat,name] of Object.entries(record.demoPeers||{}))if(Number(seat)<9&&Number(seat)!==mine)peers[seat]=name;
  const people=new Set([...Object.values(peers),'睿睿']).size;
  const done=1+Number(!!record.finished);
  const hearts=18+(data.encouragement||0);
  const board='<h3 class="lessonTheme">'+escape(title).replace(' · ','<br>')+'</h3><div class="resultBoardStats"><div><small>本次共学</small><strong>'+people+'人</strong></div><div><small>完成学习</small><strong>'+done+'人</strong></div><div><small>互相鼓励</small><strong>'+hearts+'次</strong></div></div><p class="boardMotto">每一次到场，都是一起进步！</p>';
  const seats=Array.from({length:9},(_,i)=>{
    const isMe=i===mine,person=isMe?'睿睿':peers[i];
    let body='';
    if(person){
      const [label,kind]=status(person,isMe);
      const heart=!isMe&&(i===0||data.hearts?.[i]);
      const portrait='<span class="portrait">'+visual.identity(isMe?'我':person,completed)+(heart?'<span class="heartBadge" aria-label="收到的爱心">♥</span>':'')+'</span><b>'+escape(person)+'</b>';
      body='<span class="seatCompletion '+kind+'">'+label+'</span>'+button('person',portrait,'class="seatPerson '+(isMe?'mine':'')+'" data-seat="'+i+'" aria-label="'+(isMe?'睿睿，本节学习状态':'与'+escape(person)+'互动')+'" '+(isMe?'disabled':''));
      if(!isMe&&selectedPeer===i)body+='<div class="peerPopover '+(i%3===2?'opensLeft':i%3===1?'opensCenter':'')+'" role="group" aria-label="和'+escape(person)+'互动"><div class="popoverTitle"><b>'+escape(person)+'</b>'+button('close','×','class="closePopover" aria-label="关闭互动"')+'</div><div class="popoverActions">'+['wave','highFive','heart'].map((action,j)=>button(action,'<span aria-hidden="true">'+['👋','🙌','❤️'][j]+'</span><small>'+['打招呼','击掌','爱心'][j]+'</small>','class="popoverAction" data-seat="'+i+'" aria-label="'+['打个招呼','击个掌','送颗爱心'][j]+'"')).join('')+'</div></div>';
    }else body='<a class="deskAction" href="./?view=wechat" aria-label="邀请伙伴坐'+(i+1)+'号座">邀请</a>';
    return '<div class="seatSocial '+(selectedPeer===i?'isActive':'')+'" style="'+visual.position(i)+'">'+body+'</div>';
  }).join('');
  window.roomActivities.seed(record);
  const rows=feedRows();
  const next=window.Reservations.upcoming(day,record);
  main.innerHTML=visual.stage({day,mode:'resultsRoom',board,pin:'下次共学<br><a href="#upcomingSessions">去预约</a>',seats,feed:record.activity.slice(0,3).map((text,i)=>'<div class="activityLine '+(i?'previous':'latest')+'">'+escape(text)+'</div>').join('')})
    +'<section class="resultFeed" id="outcomeFeed" aria-label="共学成果"><h2>共学成果</h2><ol>'+rows.map(row=>'<li><span class="feedFace" aria-hidden="true">'+visual.identity(row.person,completed)+'</span><div class="feedContent"><b>'+escape(row.person)+'</b><span class="feedKind">'+escape(row.kind)+'</span><p>'+escape(row.text)+'</p></div></li>').join('')+'</ol>'+button('share','分享我的本节收获','class="shareLesson"')+'<p class="resultNotice" role="status">'+escape(notice)+'</p></section>'
    +'<section class="upcomingSessions" id="upcomingSessions"><h2>下两次共学安排</h2>'+next.map(item=>'<article class="upcomingCard"><p>'+window.Reservations.dateLabel(item.startsAt)+'</p><h3>'+escape(item.title)+'</h3><p>16:30 / 19:30 / 20:30 · 学习约35分钟</p><a class="reservationButton" href="booking.html?day='+item.day+'&date='+item.date+'&from='+day+'">'+(item.booked?'查看预约 / 改约':'选择场次预约')+'</a></article>').join('')+'</section>';
  main.querySelector('.roomBrandNav a').href='#outcomeFeed';
  main.querySelector('.roomBrandNav a:last-child').href='#upcomingSessions';
}
function sharePrompt(){
  const kind=document.querySelector('input[name=shareKind]:checked').value;
  document.querySelector('.sharePrompt').textContent=kind==='感受'?'这节课有什么感受？哪一刻觉得难，或突然懂了？':'这节课学会了什么？下次做题准备怎样用？';
  field.placeholder=kind==='感受'?'刚开始有点难，找到证据后更有信心了。':'我学会了先找题干关键词，再回原文找依据。';
}
main.addEventListener('click',event=>{
  const target=event.target.closest('button[data-action]');
  if(!target){if(selectedPeer!==null&&!event.target.closest('.seatSocial')){selectedPeer=null;delete record.focusedPeer;render()}return;}
  const action=target.dataset.action,seat=Number(target.dataset.seat);
  if(action==='person'){selectedPeer=selectedPeer===seat?null:seat;if(selectedPeer===null)delete record.focusedPeer;else record.focusedPeer=seat;render();return;}
  if(action==='close'){selectedPeer=null;delete record.focusedPeer;render();return;}
  if(action==='share'){
    const choice=document.querySelector('input[name=shareKind][value="'+(data.shareKind==='感受'?'感受':'收获')+'"]');choice.checked=true;
    field.value=data.story||'';field.setCustomValidity('');sharePrompt();dialog.showModal();field.focus();return;
  }
  const person=peers[seat];if(!person)return;
  if(action==='heart'){(data.hearts??={})[seat]=true;notice='睿睿给'+person+'送了颗爱心';}
  if(action==='wave')notice='睿睿和'+person+'打了个招呼';
  if(action==='highFive')notice='睿睿和'+person+'击了个掌';
  data.encouragement=(data.encouragement||0)+1;(data.reactions??=[]).unshift(notice);data.reactions=data.reactions.slice(0,6);window.roomActivities.add(record,notice);selectedPeer=null;delete record.focusedPeer;save();render();
});
document.querySelector('#cancelShare').onclick=()=>dialog.close();
document.querySelector('.shareKinds').addEventListener('change',sharePrompt);
field.addEventListener('input',()=>field.setCustomValidity(''));
document.querySelector('#shareForm').addEventListener('submit',event=>{
  event.preventDefault();if(!field.value.trim()){field.setCustomValidity('先写下一句话吧');field.reportValidity();return;}
  data.story=field.value.trim();data.shareKind=document.querySelector('input[name=shareKind]:checked').value;
  notice='你的'+data.shareKind+'已加入共学成果';window.roomActivities.add(record,'睿睿分享了本节'+data.shareKind);save();dialog.close();render();
  document.querySelector('#outcomeFeed').scrollIntoView({block:'start',behavior:'smooth'});
});
render();
window.roomActivities.start(record,render,Object.keys(peers).map(Number));
