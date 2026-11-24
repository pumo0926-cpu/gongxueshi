'use strict';

const courses = [
  {
    day:'周六', title:'看动作，猜心情', hook:'小宇攥紧试卷，又慢慢松了手。他起初是什么心情？',
    passage:'进门时，小宇把试卷攥得皱皱的。听见老师说「你可以慢慢讲」，他的手才慢慢松开，把试卷放在桌角。',
    guesses:['紧张','生气'], explain:'读人物心情时，把变化前后的两个动作连起来，再看中间发生了什么。',
    questions:[
      { title:'先把前后动作连起来', prompt:'下面哪组动作是文中写到的变化？', choices:['先攥紧，后来松开','先松开，后来攥紧'], answer:0, hint:'先看他进门时在做什么，再看听完老师的话以后。', detail:'「攥紧」和「松开」是同一双手前后的状态。' },
      { title:'用动作推断心情', prompt:'联系老师说的话，小宇的心情最可能是怎样变化的？', choices:['从紧张到放松','从生气到害怕'], answer:0, hint:'想想「可以慢慢讲」是在给他压力，还是在帮他放松。', detail:'老师允许他慢慢讲，随后他的手松了下来。从紧张到放松更符合上下文。' },
      { title:'把证据写进答案', prompt:'下面哪个答案把心情变化解释得更完整？', choices:['他把试卷放在桌角，所以原来很生气。','他先攥紧试卷，听到老师安慰后手慢慢松开，可见他从紧张变得放松。'], answer:1, hint:'找同时写到变化前和变化后，并且符合原文的答案。', detail:'前后两个动作放在一起，就能看出心情的变化。' }
    ],
    evidence:['「把试卷攥得皱皱的」','「你可以慢慢讲」','「他的手才慢慢松开」'],
    evidenceWhy:['先攥紧试卷，表现出紧张。','老师的话解释了他为什么开始放松。','手松开了，说明他的紧张缓解了。'],
    wallTitle:'大家从不同的地方，看懂了同一个变化', wallHint:'把「攥紧」和「松开」连起来，再看老师说了什么，就是一条完整的证据链。',
    next:'明天有两句话都像线索。你能挑出那句容易让人误判的吗？'
  },
  {
    day:'周日', title:'两句线索，哪句在误导你？', hook:'阿遥决定上台，哪句话能解释他为什么改变主意？',
    passage:'阿遥原本想把演讲稿塞回书包。窗外雨停了。同学递来一张练习时写满建议的小纸条，说：「你上次讲得很好。」阿遥把稿子重新摊开，朝讲台走去。',
    guesses:['窗外雨停了','同学递来纸条并鼓励他'], explain:'解释人物为什么改变主意，可以先找转折发生在哪里，再判断前一句究竟只是同时发生，还是能解释这个变化。',
    questions:[
      { title:'找到改变主意的瞬间', prompt:'下面哪一处最直接写出阿遥从退缩到愿意上台？', choices:['窗外雨停了。','他重新摊开稿子，朝讲台走去。'], answer:1, hint:'找阿遥自己做了什么，天气变化只交代背景。', detail:'重新摊开稿子并走向讲台，说明他改变了主意。' },
      { title:'分清先发生和有关系', prompt:'哪件事更能解释阿遥愿意走上讲台？', choices:['同学给了他具体的肯定。','雨停了，天亮了一些。'], answer:0, hint:'想想哪件事会影响他对演讲的信心。', detail:'同学提起上次的表现，给了他信心。' },
      { title:'删掉一条干扰线索', prompt:'这份草稿里，哪一处应该从理由中删掉？', choices:['同学递来写满建议的纸条，还肯定了他的表现。','窗外恰好停雨了。'], answer:1, hint:'先后出现的事情，并不都能解释人物为什么这么做。', detail:'「停雨」没有解释他为什么敢上台。真正有用的线索是同学的鼓励。' }
    ],
    evidence:['「递来一张练习时写满建议的小纸条」','「你上次讲得很好」','「把稿子重新摊开，朝讲台走去」'],
    evidenceWhy:['纸条让同学的支持变得具体。','肯定上一次的表现，给了阿遥信心。','这是阿遥改变主意的表现。'],
    wallTitle:'全场最容易被哪句骗到？', wallHint:'「雨停了」恰好出现在转折前，却解释不了阿遥为什么敢上台。',
    next:'这周的两道共学题可以随时回看。'
  }
];

Object.assign(courses[0], {
 title:'英语说明文阅读 · 找到细节证据', hook:'题干问 How many kinds，回原文时你先找什么？',
 guesses:['种类和数量','作者的态度'], evidence:['How many kinds','sixteen personality types','such as INFJ'],
 evidenceWhy:['疑问词提示要找数量。','原文给出了种类总数。','such as 后面是例子，只列出了其中几种。'],
 wallTitle:'大家在哪里找到了 16 的依据？',wallHint:'把题干里的 kinds 和原文的 types 连起来，就能找到 sixteen。'
});
const times = ['16:30','19:30','20:30'];
const steps = ['课程邀约','共学入场','学—练—改','学习评价与分享'];
const feelings=['原来还可以这样想','刚才有点难，改完懂了','还想再试一道'];
const waitingPreview=new URLSearchParams(location.search).get('view')==='waiting';
const reservedPreview=new URLSearchParams(location.search).get('view')==='reserved';
let stateKey = waitingPreview?'up-waiting-preview':reservedPreview?'up-reserved-preview':'up-weekend-reading-original-v2';
const emptyRecord = () => ({ slot:1, booked:null, guess:null, lamp:false, question:0, choice:null, result:'', evidence:null, solo:false, finished:false, posted:false });
const freshState = () => ({ clock:0, day:0, page:'wxDraft', records:[emptyRecord(),emptyRecord()] });
const screen = document.querySelector('#screen');
const experience = screen.closest('.experience');

function restore() {
  if(!location.search || new URLSearchParams(location.search).get('view')==='wechat')return freshState();
  if(new URLSearchParams(location.search).get('view')==='reserved'){
    const reservation=window.Reservations.get(new URLSearchParams(location.search).get('reservation'));
    if(reservation&&reservation.status!=='rescheduled'){
      const preview=freshState();preview.day=reservation.day;preview.page='booking';
      Object.assign(preview.records[reservation.day],{booked:reservation.slot,slot:reservation.slot,startsAt:reservation.startsAt,reservationId:reservation.id});
      return preview;
    }
  }
  if(waitingPreview){
    const preview=freshState();
    preview.page='booking';
    Object.assign(preview.records[0],{booked:1,startsAt:Date.now()+12*60*1000});
    return preview;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(stateKey));
    if(saved?.records?.length===2 && saved.day in courses) return saved;
  } catch {}
  return freshState();
}

let state = restore();
const btn = (act, label, kind='primary', attrs='') => '<button type="button" class="'+kind+'" data-act="'+act+'" '+attrs+'>'+label+'</button>';
const actions = (...items) => '<div class="actions">'+items.join('')+'</div>';
const heading = (meta,title) => '<div class="meta">'+meta+'</div><h2 class="stage-title" tabindex="-1">'+title+'</h2>';
const optionList = (list, key, selected, horizontal=false, locked=false) => '<div class="options '+(horizontal?'horizontal':'')+'" role="group" aria-label="选择一项">'+list.map((label,index)=>btn(key,label,'choice','data-index="'+index+'" aria-pressed="'+(index===selected)+'" '+(locked?'disabled':''))).join('')+'</div>';
// Example reservations across the available sessions, not live participant data.
const bookedPeers=[[274,568,426],[274,568,426]];
function opts(record){
  const peers=bookedPeers[state.day];
  const recommended=peers.indexOf(Math.max(...peers));
  return '<div class="options time-slots" role="group" aria-label="选择共学时间">'+times.map((time,i)=>{
    const count=peers[i]+Number(record.booked===i);
    const label='<strong>'+time+'</strong><span>'+count+' 人已约</span>'+(i===recommended?'<small>推荐时段</small>':'');
    return btn('slot',label,'choice','data-index="'+i+'" aria-pressed="'+(i===record.slot)+'"');
  }).join('')+'</div>';
}
const currentTime = (course,record) => course.day+' '+times[record.booked ?? record.slot];
function sessionStart(day,slot,now=Date.now()){
  const shanghai=new Date(now+8*3600000);
  const delta=((6+day)%7-shanghai.getUTCDay()+7)%7;
  const [hour,minute]=times[slot].split(':').map(Number);
  shanghai.setUTCDate(shanghai.getUTCDate()+delta);
  shanghai.setUTCHours(hour,minute,0,0);
  return shanghai.getTime()-8*3600000;
}
let countdownTimer;
function updateBlackboard(r){
  const clock=document.querySelector('#startClock');
  if(!clock)return;
  const seconds=Math.max(0,Math.ceil((r.startsAt-Date.now())/1000));
  const parts=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60];
  clock.textContent=seconds?parts.map(n=>String(n).padStart(2,'0')).join(':'):'共学室已开场';
  const caption=document.querySelector('#clockCaption');
  caption.textContent=seconds?'距离共学开始':'';
  caption.hidden=!seconds;
  const enter=document.querySelector('[data-act="enter"]');
  const expired=Date.now()>=r.startsAt+window.Reservations.windowMs;
  enter.disabled=seconds>0 || expired || !Number.isInteger(r.seat);
  enter.textContent=seconds?'等待共学':expired?'本场启动已截止':'开始共学';
  const toggle=document.querySelector('#demoClockToggle');
  if(toggle)toggle.checked=seconds===0;

}
const phase = () => ({ invite:0, booking:0, lobby:1, lesson:2, paused:2, evidence:2, reveal:3, wall:3 }[state.page] ?? 0);

function presence(record, count, text) {
  if(record.solo) return '<div class="pill">独自学习</div>';
  return '<div class="lamps" aria-hidden="true">'+Array.from({length:count},()=>'<i class="lamp"></i>').join('')+(record.lamp?'<i class="lamp mine"></i>':'')+'</div><p class="small">'+text+'</p>';
}

function notes(course,record) {
  const examples = record.solo || record.booked===0;
  const selected = record.posted ? '<div class="note mine"><div class="from">我贴的线索</div><strong>'+course.evidence[record.evidence]+'</strong><p>'+course.evidenceWhy[record.evidence]+'</p></div>' : '';
  const others = (examples?[0]:[0,2]).map(i=>'<div class="note"><div class="from">'+(examples?'教研示例':'场内同学 · 示例')+'</div><strong>'+course.evidence[i]+'</strong><p>'+course.evidenceWhy[i]+'</p></div>').join('');
  return '<div class="wall">'+selected+others+'</div>';
}

const drills=[
 {text:'The MBTI test divides people into sixteen personality types, such as INFJ, INTP, ESTP and ESTJ.',items:[['How many personality types are there in the MBTI test?','Four','Sixteen',1,'such as 后面是举例。回到 types 前面找表示总数的词。'],['哪组词可以帮助你从题干定位到原文？','kinds → types','many → such as',0,'想一想，原文里哪个词也表示“种类”？']]},

 {text:'小岚原本想退出朗读比赛。走廊的灯亮了。老师递来一张她上周进步的记录，她读完，又拿起报名表。',items:[['什么能解释小岚改变主意？','走廊亮灯','看到了自己的进步记录',1,'找和她对朗读的信心有关的事件。'],['哪个动作说明她准备重新参加？','拿起报名表','走廊亮灯',0,'找人物自己的行动。']]}
];
const desks=Array.from({length:9},(_,i)=>(i+1)+'号');
const peers={0:'小麦',2:'小舟',4:'阿禾',6:'小林'};
const roomMate=(r,i)=>peers[i]||r.demoPeers?.[i];
function identity(person){
 return window.StudyRoomVisual.identity(person,state.records.filter(r=>r.finished).length);
}
function roomScene(r, board, reviewing=false){
 const grid=desks.map((name,i)=>{
   const mine=r.seat===i, person=mine?'我':peers[i];
   return '<button class="desk '+(mine?'mine':'')+'" data-act="sit" data-index="'+i+'" '+(reviewing||person||!r.greeting?'disabled':'')+'><span class="occupant">'+(person?identity(person):'')+'</span><b>'+name+' · '+(person||'空位')+'</b></button>';
 }).join('');
 return '<div class="roomScene"><div class="windows">☀　窗 边</div><div class="chalkBoard"><h3 class="lessonTheme">'+courses[state.day].title.replace(' · ','<br>')+'</h3>'+board+'</div><div class="tables">'+grid+'</div><small>同场伙伴与成绩为演示数据</small></div>';
}
function room(r){
 const seated=Number.isInteger(r.seat);
 const tables=desks.map((desk,i)=>{
  const mate=roomMate(r,i), mine=r.seat===i;
  const attr='data-index="'+i+'"';
  const style='style="'+window.StudyRoomVisual.position(i)+'"';
  let body;
  if(mate||mine){
   const nick=mine?'睿睿':mate;
   const heart=!mine&&(i===0||r.hearts?.includes(i));
   const portrait='<span class="portrait">'+identity(mine?'我':mate)+(heart?'<span class="heartBadge '+(r.heartAt>Date.now()-1200&&r.heartSeat===i?'heartSent':'')+'" aria-label="收到的爱心">♥</span>':'')+'</span><b>'+nick+'</b>';
   body=btn('peerMenu',portrait,'seatPerson '+(mine?'mine':''),attr+' aria-expanded="'+(r.focusedPeer===i)+'" aria-label="'+(mine?'睿睿，自己的'+desk+'座':'与'+mate+'互动')+'" '+(mine?'disabled':''));
   if(!mine&&r.focusedPeer===i){
     body+='<div class="peerPopover '+(i%3===2?'opensLeft':i%3===1?'opensCenter':'')+'" role="group" aria-label="和'+mate+'互动"><div class="popoverTitle"><b>'+mate+'</b>'+btn('peerClose','×','closePopover','aria-label="关闭互动"')+'</div><div class="popoverActions">'+['wave','highFive','peerHeart'].map((act,j)=>btn(act,'<span aria-hidden="true">'+['👋','🙌','❤️'][j]+'</span><small>'+['打招呼','击掌','爱心'][j]+'</small>','popoverAction','aria-label="'+['打个招呼','击个掌','送颗爱心'][j]+'" data-index="'+i+'" '+(!seated||(act==='wave'?r.waves:act==='highFive'?r.highFives:r.hearts)?.includes(i)?'disabled':''))).join('')+'</div>'+(!seated?'<small class="seatFirst">先选个座位，再和伙伴互动</small>':'')+'</div>';
   }
  }else if(!seated)body=btn('reserveSeat','占座','deskAction',attr+' aria-label="占'+desk+'座"');
  else if(r.picking===i)body=btn('inviteSeat','选伙伴','deskAction',attr);
  else body=btn('inviteSeat',r.invited?.[i]?'已邀请':'邀请','deskAction',attr+' aria-label="邀请伙伴坐'+desk+'座" '+(r.invited?.[i]?'disabled':''));
  return '<div class="seatSocial '+(r.focusedPeer===i?'isActive':'')+'" '+style+'>'+body+'</div>';
 }).join('');
 const inviting=Number.isInteger(r.picking)?'<section class="inviteTray"><b>邀请伙伴坐'+desks[r.picking]+'座</b>'+['小林','阿禾','小雨'].map((name,j)=>btn('sendInvite',name,'deskAction','data-index="'+r.picking+'" data-person="'+j+'" '+([...Object.values(peers),...Object.values(r.demoPeers||{}),...Object.values(r.invited||{})].includes(name)?'disabled':''))).join('')+'</section>':'';
 window.roomActivities.seed(r);
 const lines=r.activity.slice(0,3);
 return window.StudyRoomVisual.stage({day:state.day,board:'<h3 class="lessonTheme">'+courses[state.day].title.replace(' · ','<br>')+'</h3><span id="clockCaption">距离共学开始</span><strong id="startClock" role="timer"></strong>',pin:'本场约定<br>'+currentTime(courses[state.day],r),seats:tables,feed:lines.map(line=>'<div class="activityLine latest">'+line+'</div>').join('')})+inviting;
}
function filmScreen(r,c){
 const d=state.day, stage=r.media||'opening', material=drills[d];
 if(stage==='practice'||stage==='repair'){
   const repair=stage==='repair', i=repair?r.wrongs[r.cursor]:r.cursor, q=material.items[i];
   return heading(repair?'改 · 我的错题':'练 · 独立做题',q[0])+'<p class="passage block">'+material.text+'</p>'+(repair?'<p class="block">我的原答案：'+q[1+r.first[i]]+'。提示：'+q[4]+'</p>':'')+optionList(q.slice(1,3),'pick',r.pick)+(r.retry?'<p role="status">再读一次提示，试着换个答案。</p>':'')+actions(btn('submitDrill',repair?'确认订正':'提交作答','primary',r.pick==null?'disabled':''));
 }
 if(stage==='result')return heading('学习评价',r.wrongs.length?'自己的错题都改完了':'两道练习全对！')+'<p>首次答对 '+(2-r.wrongs.length)+' / 2 · 已订正 '+r.wrongs.length+' 题</p>'+actions(btn('leaveFilm','提交本课 · 查看共学成果'));
 const voting=stage==='vote'||stage==='stars',show=stage==='stars';
 const file=d*2+(stage==='ending'?1:0);
 const peerTotal=new Set([...Object.values(peers),...Object.values(r.demoPeers||{})]).size;
 const counts=[Math.ceil(peerTotal/2),Math.floor(peerTotal/2)];
 const members=['我',...new Set([...Object.values(peers),...Object.values(r.demoPeers||{})])];
 const presence=r.solo?'':'<div class="colearnPresence" role="group" aria-label="当前共学伙伴"><div class="colearnStack">'+members.slice(0,5).map(person=>'<span class="colearnAvatar" role="img" aria-label="'+(person==='我'?'睿睿':person)+'的头像"><span aria-hidden="true">'+identity(person)+'</span></span>').join('')+(members.length>5?'<span class="colearnAvatar more">+'+(members.length-5)+'</span>':'')+'</div><span class="colearnLabel"><strong>'+members.length+'</strong> 人正在共学</span></div>';
 return heading(d===0?'学 · 英语原课节选':'学 · 演示交互短片',c.title)+presence+'<div class="cinema"><video muted playsinline '+(voting?'':'controls autoplay')+' src="story'+file+'.mp4" aria-label="带字幕的课堂动画"></video></div>'
 +(voting?'<div class="block"><h3>'+c.hook+'</h3>'+(show?'<div class="votegrid">'+['A','B'].map((letter,i)=>'<div><b>'+(r.solo?letter:counts[i]+' 位伙伴选了 '+letter)+'</b>'+(r.guess===i?'<small class="myVote">我的选择</small>':'')+'</div>').join('')+'</div>'+(r.solo?'<p>已记下你的判断。</p>':'')+actions(btn('continueFilm','继续看讲解')):optionList(c.guesses.map((label,i)=>['A','B'][i]+' · '+label),'voteFilm',null,true))+'</div>':'<p class="small block">'+(stage==='opening'?'视频会在关键画面停下，等你选。':'对照讲解，看看你的选择有什么依据。')+'</p>');
}

function render(focus=false) {
  clearInterval(countdownTimer);
  window.roomActivities.stop();
  const course = courses[state.day];
  const record = state.records[state.day];
  const future = state.day > state.clock;
  const sampleCount = record.booked===0 ? 1 : state.day===0 ? 6 : 8;
  const reveal = state.day===0 ? '翻开全场线索墙' : '揭晓全场易错线索';
  let html = '';
  experience.dataset.compact = String(phase()>0);
  document.querySelector('#days').innerHTML = courses.map((c,i)=>{
    const r = state.records[i];
    const status = r.finished ? '已完成' : r.booked!==null ? (i>state.clock?'已预约 · 待解锁':'已预约 '+times[r.booked]) : i>state.clock ? '周日解锁 · 可预订' : '已解锁';
    return btn('day','<span>'+c.day+' · '+status+'</span><strong>'+c.title+'</strong>','day','data-index="'+i+'" aria-current="'+(i===state.day)+'"');
  }).join('');
  document.querySelector('#steps').innerHTML=steps.map((s,i)=>'<li '+(i===phase()?'aria-current="step"':'')+'><i aria-hidden="true"></i>'+s+'</li>').join('');

  document.body.classList.toggle('chatWindow',['wxDraft','wxInbox','wxBooked'].includes(state.page));
  document.body.dataset.surface=state.page.startsWith('wx')?'wechat':'app';
  switch(state.page) {
    case 'wxDraft':
    case 'wxInbox':
    case 'wxBooked':
      html=window.renderWechatInvitation({course,times,peers:bookedPeers[state.day],record,confirmed:record.booked!==null});
      break;
    case 'wxChoose':
      html=heading('共学邀请 · 孩子选择','你想几点和大家一起学？')+'<div class="block"><h3>周六 · 约 35 分钟</h3>'+opts(record)+'</div>'+actions(btn('wxConfirm','我参加 '+times[record.slot]+' 这场'));
      break;
    case 'invite':
      html=heading(course.day+'共学题'+(future?' · 待解锁':''),course.title)
        +'<p>'+course.hook+'</p>'
        +'<div class="block"><h3>选择'+course.day+'的场次</h3>'+opts(record)+'</div>'
        +actions(btn('book',future?'预约周日共学':'约这场一起学'),future?btn('unlock','进入周日课程','secondary'):btn('solo','现在自己学','secondary'));
      break;
    case 'booking':
      record.startsAt??=sessionStart(state.day,record.booked??record.slot);
      html=room(record)+'<div class="actions roomEntryActions">'+btn('reschedule','换个场次','secondary')+btn('enter',record.startsAt>Date.now()?'等待共学':'开始共学')+'</div><label class="demoClockSwitch"><input id="demoClockToggle" type="checkbox" role="switch" '+(record.startsAt<=Date.now()?'checked':'')+'><span>演示开关：已到开场时间</span></label>';
      break;
    case 'lobby':
      html=record.solo?heading('独自学习',course.title)+actions(btn('start','开始学习')):room(record);
      break;
    case 'lesson': html=filmScreen(record,course); break;
    case 'paused':
      html=heading(course.day+' · 已暂停','进度留在你的书桌上')+'<p>回来就从「'+['学','练','改'][record.question]+'」这一步接着做。</p>'+actions(btn('resume','继续这一讲'),btn('back','回到共学安排','secondary'));
      break;
    case 'evidence':
      html=heading('课后留档','哪一句是你想留下的线索？')+'<p>点一句原文，给今天的学习留个记号。</p>'
        +'<div class="block">'+optionList(course.evidence,'evidence',record.evidence)+'</div>'
        +(record.evidence!==null?'<div class="feedback right" role="status">'+course.evidenceWhy[record.evidence]+'</div>':'')
        +actions(btn('finish','保存我的线索','primary',record.evidence===null?'disabled':''));
      break;
    case 'reveal':
      html=heading(course.day+'散场',state.day===0?'你的线索，能和大家的拼起来吗？':'哪条干扰线索最容易让人误判？')
        +'<div class="block tile"><strong>我留下的线索</strong><p>'+course.evidence[record.evidence]+'</p></div>'
        +actions(btn('post',record.solo?'把我的线索加入示例墙':'贴上我的线索 · 一起揭晓'),btn('view',reveal,'secondary'));
      break;
    case 'wall': {
      if(!record.solo){
        try { localStorage.setItem(stateKey,JSON.stringify(state)); } catch {}
        location.replace('classroom.html?day='+state.day);return;
      }
      const items=drills[state.day].items;
      const correct=items.filter((q,i)=>(record.finalAnswers?.[i]??record.first?.[i])===q[3] || (!record.finalAnswers && record.media==='result' && record.wrongs?.includes(i))).length;
      const message=String(record.message||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
      const examples=state.day===0?['原来 kinds 和 types 指的是同一个意思，回原文找词容易多了。','我一开始数了四个例子。看到 such as 才明白，题目问的是总数。']:['把前后两个动作连起来，心情就能读出来了。','找到鼓励他的那句话，我才懂他为什么改变主意。'];
      html=heading(course.title,'本场共学成果')+roomScene(record,'<h3>本节改后正确率</h3><div class="chalkScores"><b>我 <strong>'+Math.round(100*correct/items.length)+'% · '+correct+'/'+items.length+' 题</strong></b><b>小麦 <strong>100% · 2/2 题</strong></b><b>小舟 <strong>50% · 1/2 题（订正中）</strong></b></div><small>按每题最后一次提交计算</small>',true)
      +'<section class="block"><h3>本课收获与感受墙</h3><label for="reflection">这节课你学会了什么？哪一刻觉得难，或者突然懂了？</label><textarea id="reflection" maxlength="240" rows="3" placeholder="写下我的收获或感受…">'+message+'</textarea>'+actions(btn('publishReflection',message?'更新我的分享':'把我的感受贴上墙'))+'<div class="wall">'+(message?'<article class="note mine"><b>我</b><p>'+message+'</p></article>':'')+examples.map((t,i)=>'<article class="note"><b>'+['小麦','小舟'][i]+' · 示例</b><p>'+t+'</p></article>').join('')+'</div></section>'
      +actions(btn('day',state.day===0?'再约周日共学':'回看周六共学','primary','data-index="'+(1-state.day)+'"'));
      break;
    }
  }
  document.body.classList.toggle('nativeBooking',state.page==='booking');
  if(state.page==='lesson' && !record.solo && Number.isInteger(record.seat))html='<div class="seatTag">'+identity('我')+' 我 · '+desks[record.seat]+'座</div>'+html;
  screen.innerHTML='<div class="content">'+html+'</div>';
  if(state.page==='booking'){countdownTimer=setInterval(()=>updateBlackboard(record),1000);updateBlackboard(record);window.roomActivities.start(record,()=>render(),Object.keys(peers).map(Number));}
  const video=screen.querySelector('video');
  if(video){
    if(['vote','stars'].includes(record.media))video.onloadedmetadata=()=>{video.currentTime=Math.max(0,video.duration-.08);};
    else video.onended=()=>{record.media=record.media==='ending'?'practice':'vote';record.cursor=0;record.first??=[];record.wrongs??=[];render();};
  }
  try { localStorage.setItem(stateKey,JSON.stringify(state)); } catch {}
  if(focus) {
    screen.querySelector('.stage-title')?.focus({preventScroll:true});
    if(innerWidth<=760) (phase()===1?experience:screen).scrollIntoView({block:'start'});
  }
}

function chooseDay(index) {
  if(index===state.day) return;
  state.day=index;
  const record=state.records[index];
  state.page=record.finished?'wall':record.lamp?'paused':record.booked!==null?'booking':'invite';
}

document.addEventListener('click',event=>{
  const button=event.target.closest('button[data-act]');
  if(!button) return;
  const action=button.dataset.act;
  const index=Number(button.dataset.index);
  const record=state.records[state.day];
  const course=courses[state.day];

  switch(action) {
    case 'voteFilm': record.guess=index;record.media='stars';break;
    case 'continueFilm': record.media='ending';break;
    case 'pick': record.pick=index;record.retry=false;break;
    case 'submitDrill': {
      const repair=record.media==='repair';
      const i=repair?record.wrongs[record.cursor]:record.cursor;
      const correct=record.pick===drills[state.day].items[i][3];
      record.finalAnswers??={};record.finalAnswers[i]=record.pick;
      if(repair&&!correct){record.retry=true;record.pick=null;break;}
      if(!repair){record.first[i]=record.pick;if(!correct)record.wrongs.push(i);}
      record.pick=null;record.retry=false;record.cursor++;
      if(record.cursor===(repair?record.wrongs.length:2)){
        record.media=!repair&&record.wrongs.length?'repair':'result';record.cursor=0;
      }
      break;
    }
    case 'leaveFilm': record.finished=true;state.page='wall';break;
    case 'publishReflection': {
      const field=document.querySelector('#reflection');
      if(!field.value.trim()){field.setCustomValidity('写一句收获或感受，再贴到墙上吧。');field.reportValidity();field.oninput=()=>field.setCustomValidity('');return;}
      record.message=field.value.trim();break;
    }
    case 'previewFilm': record.solo=false;record.lamp=true;record.booked??=1;state.page='lesson';break;
    case 'wxOpen': state.page='wxChoose';break;
    case 'wxDiscuss': record.wxReply='discuss';break;
    case 'wxExplain': record.wxReply='explain';break;
    case 'wxSend': {
      const value=document.querySelector('#wxParentMessage')?.value.trim();
      if(!value)return;
      record.wxMessage=value;record.wxReply='message';break;
    }
    case 'wxBookSlot': record.slot=index;
      // Both invitation views share the same booking confirmation.
    case 'wxConfirm': record.booked=record.slot;record.startsAt=sessionStart(state.day,record.slot);record.reservationId=window.Reservations.upsert({day:state.day,slot:record.slot,startsAt:record.startsAt,replaceId:record.reservationId}).id;state.page='wxBooked';break;
    case 'wxApp': state.page='booking';break;
    case 'reset': state=freshState(); break;
    case 'day': chooseDay(index); break;
    case 'shareFeel': record.shared=record.feel; render(); return;
    case 'feel':
    case 'slot':
    case 'guess':
    case 'answer':
    case 'evidence':
      if(action==='answer'){
        record.choice=index;
        record.result='';
      } else record[action]=index;
      render();
      screen.querySelector('[data-act="'+action+'"][data-index="'+index+'"]')?.focus({preventScroll:true});
      return;
    case 'book': if(record.booked!==record.slot){delete record.seat;delete record.greeting;delete record.waves}record.booked=record.slot;record.startsAt=sessionStart(state.day,record.slot);record.reservationId=window.Reservations.upsert({day:state.day,slot:record.slot,startsAt:record.startsAt,replaceId:record.reservationId}).id; state.page='booking'; break;
    case 'reschedule': state.page='invite'; break;
    case 'unlock': state.clock=1; state.page=record.booked===null?'invite':'booking'; break;
    case 'checkin': record.checked=true;break;
    case 'hello': record.greeting=index?'挥挥手 👋':'大家好，我来啦！';break;
    case 'sit': if(record.greeting && desks[index] && !peers[index])record.seat=index;break;
    case 'arrivalMood': record.arrivalMood=index;break;
    case 'reserveSeat': if(desks[index]&&!roomMate(record,index)){record.seat=index;record.checked=true;window.Reservations.arrive(record.reservationId);window.roomActivities.add(record,'睿睿占了'+(index+1)+'号座')}break;
    case 'peerMenu': record.focusedPeer=index;break;
    case 'peerClose': delete record.focusedPeer;break;
    case 'inviteSeat': record.picking=index;break;
    case 'sendInvite': {
      const name=['小林','阿禾','小雨'][Number(button.dataset.person)];
      if(!name||[...Object.values(peers),...Object.values(record.demoPeers||{}),...Object.values(record.invited||{})].includes(name))return;
      (record.invited??={})[index]=name;delete record.picking;
      window.roomActivities.add(record,'睿睿邀请了'+name+'一起共学');break;
    }
    case 'peerLike': if(!Number.isInteger(record.seat)||!roomMate(record,index)||record.likes?.includes(index))return;
      (record.likes??=[]).push(index);window.roomActivities.add(record,'睿睿给'+roomMate(record,index)+'点了个赞');break;
    case 'peerHeart': if(!Number.isInteger(record.seat)||!roomMate(record,index)||record.hearts?.includes(index))return;
      (record.hearts??=[]).push(index);record.heartAt=Date.now();record.heartSeat=index;
      window.roomActivities.add(record,'睿睿给'+roomMate(record,index)+'送了颗爱心');delete record.focusedPeer;break;
    case 'highFive': if(!Number.isInteger(record.seat)||!roomMate(record,index)||record.highFives?.includes(index))return;
      (record.highFives??=[]).push(index);window.roomActivities.add(record,'睿睿和'+roomMate(record,index)+'击了个掌');delete record.focusedPeer;break;
    case 'wave': if(!Number.isInteger(record.seat)||!roomMate(record,index))return;
      if(record.waves?.includes(index))return;
      window.roomActivities.add(record,'睿睿和'+roomMate(record,index)+'打了个招呼');
      record.lastMate=roomMate(record,index);record.greeting='你好，'+record.lastMate+'！';record.waves=[...new Set([...(record.waves||[]),index])];delete record.focusedPeer;break;
    case 'advanceClock': record.startsAt=Date.now();break;
    case 'enter':
      if(record.startsAt>Date.now()||Date.now()>=record.startsAt+window.Reservations.windowMs||!Number.isInteger(record.seat))return;
      record.solo=false;record.lamp=true;state.clock=Math.max(state.clock,state.day);state.page='lesson';
      if(reservedPreview){try{const prior=JSON.parse(localStorage.getItem('up-weekend-reading-original-v2'))||freshState();prior.records??=[emptyRecord(),emptyRecord()];prior.records[state.day]=record;prior.day=state.day;prior.page='lesson';state=prior;stateKey='up-weekend-reading-original-v2';localStorage.setItem(stateKey,JSON.stringify(prior));}catch{}}break;
    case 'solo':
      if(state.day>state.clock) return;
      record.solo=action==='solo';
      state.page='lobby';
      break;
    case 'start':
    case 'resume': record.lamp=true; state.page='lesson'; break;
    case 'pause': state.page='paused'; break;
    case 'back': state.page=record.booked!==null?'booking':'invite'; break;
    case 'check':
      record.result=record.choice===course.questions[record.question].answer?'right':'wrong';
      render();
      screen.querySelector(record.result==='right'?'[data-act="advance"]':'[data-act="answer"]:not([aria-pressed="true"])')?.focus({preventScroll:true});
      return;
    case 'advance':
      if(record.result!=='right') return;
      if(record.question===2) state.page='evidence';
      else {
        record.question++;
        record.choice=null;
        record.result='';
      }
      break;
    case 'finish': record.finished=true; state.page='reveal'; break;
    case 'post': record.posted=true; state.page='wall'; break;
    case 'view': state.page='wall'; break;
  }

  const replyAfterBooking=action==='wxBookSlot'||action==='wxConfirm';
  render(!replyAfterBooking);
  if(replyAfterBooking){
    const input=document.querySelector('#wxParentMessage');
    input?.focus({preventScroll:true});
    requestAnimationFrame(()=>input?.closest('.composer')?.scrollIntoView({block:'end',behavior:'smooth'}));
  }
});

document.addEventListener('change',event=>{
  if(event.target.id!=='demoClockToggle')return;
  const record=state.records[state.day];
  if(event.target.checked){record.waitingStart=record.startsAt;record.startsAt=Date.now();}
  else record.startsAt=Math.max(record.waitingStart||0,Date.now()+60000);
  render();
});

document.addEventListener('click',event=>{
  const record=state.records[state.day];
  if(state.page==='booking'&&Number.isInteger(record.focusedPeer)&&!event.target.closest('.seatSocial')&&!event.target.closest('button[data-act]')){
    delete record.focusedPeer;render();
  }
});

render();
