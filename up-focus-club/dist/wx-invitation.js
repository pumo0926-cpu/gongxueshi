'use strict';

// A browser-local invitation simulation, sharing the original booking state.
window.renderWechatInvitation = function({course, times, peers, record, confirmed}) {
  const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const teacherAvatar = '<div class="avatar teacher" role="img" aria-label="阿朴老师品牌头像">🌟</div>';
  const parentAvatar = '<div class="avatar parent-avatar" role="img" aria-label="睿睿妈妈模拟头像">👩🏻</div>';
  const teacher = text => '<div class="message">'+teacherAvatar+'<div class="bubble">'+text+'</div></div>';
  const parent = text => '<div class="message parent">'+parentAvatar+'<div class="bubble">'+escape(text)+'</div></div>';
  const button = (action,label,attributes='') => '<button type="button" data-act="'+action+'" '+attributes+'>'+label+'</button>';
  const count = i => peers[i] + Number(record.booked===i);
  const total = peers.reduce((sum,n)=>sum+n,0)+Number(record.booked!==null);
  const hotIndex = peers.indexOf(Math.max(...peers));
  const time = i => course.day+' '+times[i];
  const messages = [
    '睿睿妈妈，您好！<p>这'+(course.day==='周六'?'周六':'周日')+'的'+(course.day==='周六'?'英语':'')+'课程是<strong>「'+escape(course.title)+'」</strong>。</p>',
    '为了更好地帮助孩子启动学习，我们推出了共学室，让孩子约个时间和伙伴一起共学。<p>孩子还是完成自己的学、练、改，同时也能感受到有人一起在努力。</p>',
    '几个时段我发给您，可以让孩子自己选，也可以和孩子一起选一个：'
  ];
  const card = '<div class="message">'+teacherAvatar+'<article class="mini" aria-label="本周共学课程与场次">'
    +'<div class="mini-head"><span class="mini-logo" aria-hidden="true">⭐</span>周周阿朴</div>'
    +'<div class="mini-title">本周'+(course.day==='周六'?'英语':'')+'课程 · 共学预约</div>'
    +'<div class="mini-cover"><div><small>周末共学室</small><b>'+escape(course.title)+'</b><small>学练改约35分钟 · 开场后1小时内可启动</small></div><span class="book-emoji" aria-hidden="true">📖</span></div>'
    +'<div class="mini-total">本场课程已有 <strong>'+total.toLocaleString('en-US')+'</strong> 人预约共学</div>'
    +'<div class="mini-slots">'+times.map((t,i)=>'<div class="mini-slot"><div class="session-name">'+escape(time(i))+(i===hotIndex?'<span class="hot">热门时段</span>':'')+'</div>'
      +'<div class="session-action"><span class="mini-slot-count"><b>'+count(i)+'</b> 人已预约</span>'
      +button('wxBookSlot',record.booked===i?'已预约':confirmed?'改约':'预约','class="bookNow" data-index="'+i+'" aria-label="'+(record.booked===i?'已预约':'预约')+escape(time(i))+'" '+(record.booked===i?'disabled':''))+'</div></div>').join('')+'</div>'
    +'<div class="mini-demo">演示数据 · 预约人数及热门标识为示例</div><div class="mini-foot">◉ 共学预约 · 模拟小程序卡片</div></article></div>';
  let response='';
  if(confirmed) {
    response=parent('老师，我们选'+time(record.booked)+'这场。')
      +teacher('好的，已为睿睿预约<strong>'+escape(time(record.booked))+'</strong>。<p>到时从周周阿朴 App 进入就可以，临时有安排，也可以在上面的卡片改约。</p><div class="app-entry">'+button('wxApp','打开周周阿朴 App','class="openApp"')+(record.reservationId?'<p><a href="wechat-reminders.html?id='+encodeURIComponent(record.reservationId)+'">查看微信提醒演示</a></p>':'')+'</div>');
  }
  if(record.wxReply==='discuss')response+=parent('老师，我先和孩子商量一下。')+teacher('当然可以，让孩子一起选个舒服的时间。商量好后，直接点卡片里的“预约”就行。');
  if(record.wxReply==='explain')response+=parent('老师，共学具体怎么上呢？')+teacher('在 App 中进入共学室后，孩子独立完成视频学习、练习和错题订正，也能感受到伙伴正在学习。不要求互相聊天，也不用互相等待。');
  if(record.wxReply==='message')response+=parent(record.wxMessage)+teacher('收到您的消息。这里是邀约体验 Demo，您可以直接点击场次右侧的“预约”，试试后续学习流程。');
  return '<div class="wxInvitation"><div class="wx" aria-label="家长视角微信邀约">'
    +'<nav class="sidebar" aria-label="模拟微信会话列表"><div class="searchbar"><div class="search">⌕ 搜索</div><span aria-hidden="true">⊕</span></div>'
    +'<div class="contact"><div class="avatar" aria-hidden="true">📁</div><div class="details"><b>文件传输助手</b><small>本周学习安排.pdf</small></div><time>周四</time></div>'
    +'<div class="contact"><div class="avatar" aria-hidden="true">🏡</div><div class="details"><b>一家人</b><small>周末一起吃饭</small></div><time>昨天</time></div>'
    +'<div class="contact active">'+teacherAvatar+'<div class="details"><b>阿朴老师</b><small>'+(confirmed?'已为睿睿预约共学':'这周的共学安排来啦')+'</small></div><time>17:30</time></div>'
    +'<div class="contact"><div class="avatar" aria-hidden="true">🎒</div><div class="details"><b>七年级家长群</b><small>收到，谢谢老师</small></div><time>16:42</time></div></nav>'
    +'<div class="conversation"><header class="chat-header"><h3>阿朴老师<span class="brand">@JOJOUP</span></h3><div class="tools"><span aria-hidden="true">···</span>'+button('reset','重新体验','class="restart"')+'</div></header>'
    +'<div class="messages"><div class="timestamp">星期五 17:30</div>'+messages.map(teacher).join('')+card+'<div class="response" role="status" aria-live="polite">'+response+'</div></div>'
    +'<div class="composer"><div class="compose-tools" aria-hidden="true">☺　▱　✂</div><div class="quick">'+button('wxDiscuss','老师，我先和孩子商量一下')+button('wxExplain','共学怎么上？')+'</div><textarea id="wxParentMessage" aria-label="家长的模拟微信消息" placeholder="以家长身份输入消息…" maxlength="500"></textarea><div class="sendrow"><span class="hint">模拟体验，消息不会真实发送</span>'+button('wxSend','发送','class="send"')+'</div></div></div></div></div>';
};
