'use strict';
const R=window.Reservations,params=new URLSearchParams(location.search);
const reservation=R.get(params.get('id'))||R.latest();
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let scene='live',reply='',lastSignature='';
const scenarios=[['live','实际预约时间'],['hour','开场前1小时'],['late','开场10分钟未到'],['arrived','孩子已进入']];
function render(){
  if(!reservation){document.querySelector('main').innerHTML='<section class="bookingContent"><h1>还没有预约</h1><p>先选一个方便的共学时段，再体验微信提醒。</p><a href="./?view=wechat">去预约</a></section>';return;}
  const sample={...reservation};
  let now=Date.now();
  if(scene==='hour'){now=sample.startsAt-3600000;sample.arrivedAt=null;}
  if(scene==='late'){now=sample.startsAt+600000;sample.arrivedAt=null;}
  if(scene==='arrived'){now=sample.startsAt+600000;sample.arrivedAt=sample.startsAt+300000;}
  const notices=R.notices(sample,now),signature=JSON.stringify([scene,notices,reply]);
  if(signature===lastSignature)return;lastSignature=signature;
  const teacher=text=>'<div class="message"><div class="avatar teacher" role="img" aria-label="阿朴老师头像">🌟</div><div class="bubble">'+escape(text).replaceAll('\n','<br>')+'</div></div>';
  document.querySelector('main').innerHTML='<section class="reminderControls"><h1>微信提醒场景</h1><p>'+escape(R.dateLabel(sample.startsAt)+' '+R.timeLabel(sample.startsAt)+' · '+sample.title)+'</p><div class="reasonButtons">'+scenarios.map(([key,label])=>'<button type="button" data-scene="'+key+'" aria-pressed="'+(scene===key)+'">'+label+'</button>').join('')+'</div><p>当前为'+(scene==='live'?'实际时间，按预约时间自动出现提醒':'模拟时间，仅用于体验')+'。开场后1小时内可启动，已开始的学习可继续。</p></section>'
  +'<div class="wxInvitation"><div class="conversation"><header class="chat-header"><h3>阿朴老师<span class="brand">@JOJOUP</span></h3></header><div class="messages"><div class="timestamp">'+escape(R.dateLabel(now)+' '+R.timeLabel(now))+'</div>'
  +teacher('已为睿睿约好本场共学。\n'+R.dateLabel(sample.startsAt)+' '+R.timeLabel(sample.startsAt)+'\n到时从周周阿朴 App 进入。')
  +notices.map(item=>'<div class="timestamp">'+R.timeLabel(item.at)+'</div>'+teacher(item.text)).join('')
  +(scene==='arrived'?teacher('睿睿已经进入共学室啦。\n让孩子按自己的节奏，\n完成学、练、改就好。'):'')
  +(reply?'<div class="message parent"><div class="avatar parent-avatar" role="img" aria-label="睿睿妈妈头像">👩🏻</div><div class="bubble">'+escape(reply)+'</div></div>'+teacher(reply==='进入遇到问题'?'收到，我来帮您。\n先确认已登录周周阿朴 App，\n再从预约入口进入本场。':'收到，谢谢您告诉我。\n本场开场后1小时内都可进入，\n也可以改约方便的场次。'):'')
  +'</div></div></div>'
  +'<section class="reminderControls">'+(scene==='late'?'<div class="reasonButtons"><button data-reply="临时有安排">临时有安排</button><button data-reply="进入遇到问题">进入遇到问题</button></div>':'')+'<a class="reservationButton" href="./?view=reserved&reservation='+encodeURIComponent(sample.id)+'">进入本场共学</a><p class="reminderFoot">本地 Demo · 提醒自动呈现在此页面，不会向真实微信发送消息。</p></section>';
}
document.querySelector('main').addEventListener('click',event=>{
  const sceneButton=event.target.closest('[data-scene]');if(sceneButton){scene=sceneButton.dataset.scene;reply='';render();return;}
  const replyButton=event.target.closest('[data-reply]');if(replyButton){reply=replyButton.dataset.reply;render();}
});
render();setInterval(()=>{if(scene==='live'){const fresh=R.get(reservation?.id);if(fresh)Object.assign(reservation,fresh);render();}},1000);
