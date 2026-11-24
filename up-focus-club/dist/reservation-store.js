'use strict';
window.Reservations=(()=>{
  const key='up-reservations-v1',windowMs=60*60*1000;
  const titles=['英语说明文阅读 · 找到细节证据','两句线索，哪句在误导你？'];
  const times=['16:30','19:30','20:30'];
  function read(){try{const value=JSON.parse(localStorage.getItem(key));return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return {}}}
  function write(value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
  function dateKey(stamp){return new Date(stamp+8*3600000).toISOString().slice(0,10)}
  function startAt(date,time){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!times.includes(time))return NaN;const value=Date.parse(date+'T'+time+':00+08:00');return Number.isFinite(value)&&dateKey(value)===date?value:NaN}
  function get(id){const value=read()[id];return value&&Number.isFinite(value.startsAt)?value:null}
  function latest(){return Object.values(read()).filter(r=>Number.isFinite(r.startsAt)&&r.status!=='rescheduled').sort((a,b)=>b.updatedAt-a.updatedAt)[0]||null}
  function upsert(input){
    if(!Number.isFinite(input.startsAt)||![0,1].includes(input.day))throw new Error('无效预约时间');
    const all=read(),id='session-'+dateKey(input.startsAt)+'-'+input.day,old=all[id]||{};
    if(input.replaceId&&input.replaceId!==id&&all[input.replaceId])all[input.replaceId].status='rescheduled';
    all[id]={...old,id,day:input.day,slot:input.slot??1,startsAt:input.startsAt,title:input.title||titles[input.day],createdAt:old.createdAt||Date.now(),updatedAt:Date.now(),status:'booked',arrivedAt:old.startsAt===input.startsAt?old.arrivedAt:null};
    write(all);return all[id];
  }
  function arrive(id){const all=read();if(all[id]){all[id].arrivedAt=Date.now();write(all)}}
  function timeLabel(stamp){return new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(stamp)}
  function dateLabel(stamp){return new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(stamp)}
  function nextDate(day,now=Date.now()){
    const local=new Date(now+8*3600000),delta=((6+day)%7-local.getUTCDay()+7)%7;
    local.setUTCDate(local.getUTCDate()+delta);return local.toISOString().slice(0,10);
  }
  function upcoming(day,record={}){
    const candidate=record.waitingStart||record.startsAt;
    let base=Number.isFinite(candidate)&&new Date(candidate+8*3600000).getUTCDay()===(6+day)%7?candidate:startAt(nextDate(day),'19:30');
    const offsets=day===0?[1,7]:[6,7];
    return offsets.map((offset,i)=>{
      const nextDay=day===0?(i===0?1:0):(i===0?0:1),date=dateKey(base+offset*86400000),startsAt=startAt(date,'19:30');
      const id='session-'+date+'-'+nextDay;
      return {id,day:nextDay,date,startsAt,title:titles[nextDay],booked:get(id)};
    });
  }
  function notices(reservation,now,forceAbsent=false){
    if(!reservation||reservation.status==='rescheduled')return [];
    const start=reservation.startsAt,end=start+windowMs,items=[];
    const arrived=forceAbsent?null:reservation.arrivedAt;
    const hourAt=start-3600000;
    if((reservation.createdAt??-Infinity)<=hourAt&&now>=hourAt&&(!arrived||arrived>hourAt))items.push({id:'hour',at:hourAt,text:'睿睿妈妈，共学还有1小时。\n请提醒孩子'+timeLabel(start)+'进入共学室，\n和伙伴一起学、练、改。'});
    if((reservation.createdAt??-Infinity)<=start+600000&&now>=start+600000&&(!arrived||arrived>start+600000))items.push({id:'late',at:start+600000,text:'睿睿妈妈，共学已开始10分钟。\n还没见孩子，是遇到问题了吗？\n还有50分钟，可在'+timeLabel(end)+'前进入。'});
    return items;
  }
  return {windowMs,titles,times,dateKey,startAt,get,latest,upsert,arrive,timeLabel,dateLabel,upcoming,notices,nextDate};
})();
