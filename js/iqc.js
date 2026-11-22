window.IQC = {
  init(){
    const $=s=>document.querySelector(s);
    const preview=$("#iqcPreview");
    const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    function render(){
      const contact=esc($("#iqcContact").value||"Contact");
      const operator=esc($("#iqcOperator").value||"SIM");
      const time=esc($("#iqcTime").value||"16:21");
      const battery=Math.max(1,Math.min(100,Number($("#iqcBattery").value)||1));
      const light=$("#iqcTheme").value==="light";
      const lines=$("#iqcMessages").value.split("\n").filter(Boolean);
      const bubbles=lines.map(line=>{
        const mine=/^(me|aku|saya)\s*:/i.test(line);
        const text=line.replace(/^(me|aku|saya|them|dia|teman)\s*:/i,"").trim();
        return `<div class="wa-bubble ${mine?"mine":""}">${esc(text)}<span class="wa-time">${time}</span></div>`;
      }).join("");
      preview.className="phone-frame"+(light?" light":"");
      preview.innerHTML=`<div class="phone-status"><span>${time}　${operator} ▮▮▮</span><span>◔　Wi-Fi　${battery}% ▰</span></div>
      <div class="wa-head"><span class="wa-back">‹</span><div class="wa-avatar">${contact.slice(0,1).toUpperCase()}</div><div><div class="wa-contact">${contact}</div><div class="wa-sub">online</div></div><span style="margin-left:auto;color:#8d9eff">⌕　⋮</span></div>
      <div class="wa-chat"><div class="chat-day">TODAY</div>${bubbles||'<div class="chat-day">Tambahkan pesan untuk melihat preview</div>'}</div>
      <div class="wa-input"><span>＋</span><span style="flex:1;background:transparent">Message</span><span>➤</span></div>`;
    }
    ["#iqcContact","#iqcOperator","#iqcTime","#iqcBattery","#iqcTheme","#iqcMessages"].forEach(s=>$(s).addEventListener("input",render));
    $("#renderIqc").addEventListener("click",render);
    $("#downloadIqc").addEventListener("click",()=>{
      const c=document.createElement("canvas");c.width=720;c.height=1280;const x=c.getContext("2d");
      const light=$("#iqcTheme").value==="light";x.fillStyle=light?"#f2f2f5":"#111318";x.fillRect(0,0,c.width,c.height);
      x.fillStyle=light?"#20212a":"#fff";x.font="bold 24px Arial";x.fillText($("#iqcTime").value+"   "+$("#iqcOperator").value+"                         "+$("#iqcBattery").value+"%",35,45);
      x.fillStyle=light?"#fff":"#202127";x.fillRect(0,65,720,95);x.fillStyle=light?"#20212a":"#fff";x.font="bold 26px Arial";x.fillText("‹     "+$("#iqcContact").value,35,125);
      let y=220;const lines=$("#iqcMessages").value.split("\n").filter(Boolean);
      lines.forEach(line=>{const mine=/^(me|aku|saya)\s*:/i.test(line);const msg=line.replace(/^(me|aku|saya|them|dia|teman)\s*:/i,"").trim();x.font="22px Arial";const words=msg.split(/\s+/);const max=560;let rows=[],row="";
        words.forEach(w=>{const t=row?row+" "+w:w;if(x.measureText(t).width>max){rows.push(row);row=w}else row=t});if(row)rows.push(row);
        const w=Math.min(610,Math.max(150,...rows.map(r=>x.measureText(r).width+36)));const h=rows.length*32+34;const bx=mine?720-w-28:28;
        x.fillStyle=mine?(light?"#d9fdd3":"#075e54"):(light?"#fff":"#292b31");roundRect(x,bx,y,w,h,18);x.fill();
        x.fillStyle=light?"#222":"#f5f5f5";rows.forEach((r,i)=>x.fillText(r,bx+17,y+31+i*32));x.font="15px Arial";x.fillStyle=light?"#777":"#bfc0c5";x.fillText($("#iqcTime").value,bx+w-65,y+h-10);y+=h+22;
      });
      x.fillStyle=light?"#fff":"#202127";x.fillRect(0,1200,720,80);x.fillStyle="#999";x.font="20px Arial";x.fillText("＋     Message",35,1248);
      download(c,"for-class-ix-iqc.png");
    });
    render();
  }
};
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function download(canvas,name){const a=document.createElement("a");a.download=name;a.href=canvas.toDataURL("image/png");a.click()}