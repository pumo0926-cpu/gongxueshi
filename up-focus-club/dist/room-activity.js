'use strict';
// Local demonstration events; no messages are sent to other people.
window.roomActivities = (() => {
  let timer;
  function add(record,text) {
    (record.activity??=[]).unshift(text);
    record.activity=record.activity.slice(0,12);
  }
  function seed(record){
    record.activity??=[];
    for(const text of ['小麦和小舟打了个招呼','小舟给阿禾点了个赞','小林邀请了小雨一起共学'])if(record.activity.length<3&&!record.activity.includes(text))record.activity.push(text);
  }
  function stop(){clearInterval(timer);}
  function start(record,changed,occupied=[]) {
    stop();
    seed(record);
    timer=setInterval(()=>{
      if(document.hidden||Number.isInteger(record.focusedPeer))return;
      const step=(record.activityStep??0)%5;
      record.activityStep=(record.activityStep??0)+1;
      if(step===0)add(record,'小麦和小舟击了个掌');
      if(step===1)add(record,'小舟给小麦点了个赞');
      if(step===2){
        record.demoPeers??={};
        const seated=Object.values(record.demoPeers).includes('小雨');
        const offered=Object.entries(record.invited||{}).find(([i,name])=>name==='小雨'&&Number(i)!==record.seat&&!record.demoPeers[i]);
        const seat=offered?Number(offered[0]):[8,7,5,3,2,1].find(i=>i!==record.seat&&!occupied.includes(i)&&!record.demoPeers[i]&&!record.invited?.[i]);
        if(!seated&&seat!==undefined){record.demoPeers[seat]='小雨';add(record,'小雨占了'+(seat+1)+'号座');}
        else add(record,'小雨和小麦打了个招呼');
      }
      if(step===3)add(record,'小麦邀请了阿禾一起共学');
      if(step===4)add(record,'小舟和小麦打了个招呼');
      changed();
    },4500);
  }
  return {add,seed,start,stop};
})();
