(function(){
  function html(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function run(){
    var items=window.SEARCH_QUERIES||[];
    var box=document.getElementById('searchButtons');
    if(!box||!items.length||typeof linkedInSearchUrl!=='function'||typeof googleSearchUrl!=='function')return;
    box.innerHTML='';
    items.forEach(function(item){
      var q=item.query||item.q||'';
      var title=item.category||item.c||'Search';
      var p=item.priority||item.p||'';
      var card=document.createElement('div');
      card.className='search-card';
      card.innerHTML='<div><strong>'+html(title)+'</strong><small>Priority '+html(p)+' • Merged OR query • Past Week / Latest</small><div style="font-size:12px;line-height:1.45;color:#475467;margin-top:8px;background:#F8FAFC;border-radius:12px;padding:10px">'+html(q)+'</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><a class="btn gold small" target="_blank" href="'+linkedInSearchUrl(q)+'">LinkedIn</a><a class="btn outline small" target="_blank" href="'+googleSearchUrl(q)+'">Google</a></div>';
      box.appendChild(card);
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(run,300);});}else{setTimeout(run,300);}
})();
