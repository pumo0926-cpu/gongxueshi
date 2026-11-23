'use strict';
window.StudyRoomVisual = (() => {
  const learned={小麦:8,小舟:5,阿禾:6,小林:3,小雨:2,小红:4};
  const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  function identity(person,completed=0){
    const mine=person==='我'||person==='睿睿';
    const count=mine?completed:(learned[person]??5);
    const style=mine||person==='阿禾'?'original':person==='小麦'||person==='小林'?'sport':'cap';
    return '<span class="studyIdentity"><small>已学'+count+'节</small><i class="studyAvatar '+style+'" aria-label="'+escape(mine?'睿睿':person)+'的头像"></i></span>';
  }
  function header(day=0){
    return '<header class="roomBrand"><div class="roomBrandRow"><div class="roomBrandIdentity"><a class="roomBack" href="./?view=wechat" aria-label="返回共学安排">‹</a><h2>周周阿朴 · 共学室</h2></div><nav class="roomBrandNav" aria-label="共学室导航"><a href="#roomActivity">同学圈</a><a href="./?view=wechat">下次共学</a></nav></div><p class="roomBrandSlogan"><span>每周'+(day===0?'六 · 英语':'日 · 阅读')+'共学</span><span>一起学 · 有伙伴 · 更坚持</span></p></header>';
  }
  function position(i){return 'left:'+([25.9,50.6,75.2][i%3])+'%;top:'+([40,58.2,76.3][Math.floor(i/3)])+'%';}
  function stage({day=0,board,pin,seats,feed,mode=''}){
    return header(day)+'<section class="arrivalScene nineSeats '+mode+'"><div class="arrivalBoard">'+board+'</div><div class="roomPin">'+pin+'</div>'+seats+'<div class="roomStream" id="roomActivity"><div class="streamHeading"><b>共学动态</b></div><div role="log" aria-live="polite" aria-label="共学动态">'+feed+'</div></div></section>';
  }
  return {identity,header,position,stage,escape};
})();
