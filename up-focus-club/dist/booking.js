'use strict';
const params=new URLSearchParams(location.search),R=window.Reservations,V=window.StudyRoomVisual;
const day=params.get('day')==='1'?1:0;
const requested=params.get('date')||'';
const date=Number.isFinite(R.startAt(requested,'19:30'))?requested:R.nextDate(day);
let selected=1,booked=R.get('session-'+date+'-'+day);
if(booked)selected=booked.slot;
function render(){
  const start=R.startAt(date,R.times[selected]);
  document.querySelector('main').innerHTML=V.header(day)+'<section class="bookingContent"><p>未来共学预约</p><h1>'+V.escape(R.titles[day])+'</h1><p>'+R.dateLabel(start)+' · 学习约35分钟</p><p>开场后1小时内都可进入并启动；已经开始的学习可以继续完成。</p><h2>选择方便的场次</h2><div class="bookingSlots">'+R.times.map((time,i)=>'<button class="bookingSlot" type="button" data-slot="'+i+'" aria-pressed="'+(i===selected)+'">'+time+'</button>').join('')+'</div><button class="reservationButton bookingConfirm" id="confirmReservation">'+(booked?'确认改约':'确认预约')+'</button>'+(booked?'<div class="bookingSuccess" role="status"><b>已预约 '+R.dateLabel(booked.startsAt)+' '+R.timeLabel(booked.startsAt)+'</b><p>可启动时间：'+R.timeLabel(booked.startsAt)+'—'+R.timeLabel(booked.startsAt+R.windowMs)+'</p><div class="bookingLinks"><a class="reservationButton" href="wechat-reminders.html?id='+encodeURIComponent(booked.id)+'">查看微信提醒演示</a><a class="reservationButton" href="./?view=reserved&reservation='+encodeURIComponent(booked.id)+'">进入共学室</a></div></div>':'')+'</section>';
  document.querySelector('.roomBack').href='classroom.html?day='+(params.get('from')==='1'?1:0);
}
document.querySelector('main').addEventListener('click',event=>{
  const slot=event.target.closest('[data-slot]');if(slot){selected=Number(slot.dataset.slot);render();return;}
  if(event.target.id==='confirmReservation'){booked=R.upsert({day,slot:selected,startsAt:R.startAt(date,R.times[selected]),title:R.titles[day]});render();}
});
render();
