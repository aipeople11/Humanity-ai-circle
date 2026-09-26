(() => {
  const send = (event, meta={}) => {
    const payload={event, path:location.pathname||'/', ts:new Date().toISOString(), ...meta};
    try {
      const key='hac_trace_v13'; const arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.push(payload); localStorage.setItem(key,JSON.stringify(arr.slice(-200)));
    } catch(_) {}
    if(location.protocol.startsWith('http')) fetch('/api/trace',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
  };
  send('page_view');
  document.addEventListener('click',e=>{const a=e.target.closest('[data-trace]'); if(a) send(a.dataset.trace,{href:a.getAttribute('href')||''});});
})();