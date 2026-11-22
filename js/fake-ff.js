window.FakeFF = {
  init(){
    const canvas=document.querySelector("#ffCanvas"),ctx=canvas.getContext("2d"),img=new Image();
    img.src="/assets/ff-template.jpg";
    function render(){
      if(!img.complete||!img.naturalWidth)return;
      ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const name=document.querySelector("#ffName").value.trim().slice(0,22)||"PLAYER";
      const tag=document.querySelector("#ffTag").value.trim().slice(0,24);
      const color=document.querySelector("#ffColor").value;
      // Name is placed on the lower profile/name strip of the supplied lobby template.
      ctx.save();ctx.textAlign="center";ctx.shadowColor="#000";ctx.shadowBlur=8;
      ctx.font="800 29px Arial";ctx.fillStyle=color;ctx.fillText(name,canvas.width*.51,canvas.height*.807,canvas.width*.62);
      ctx.font="bold 13px Arial";ctx.fillStyle="#ffffff";ctx.fillText(tag,canvas.width*.51,canvas.height*.825,canvas.width*.55);ctx.restore();
    }
    img.onload=render;["#ffName","#ffTag","#ffColor"].forEach(s=>document.querySelector(s).addEventListener("input",render));
    document.querySelector("#renderFf").addEventListener("click",render);
    document.querySelector("#downloadFf").addEventListener("click",()=>{render();const a=document.createElement("a");a.download="for-class-ix-fake-ff.png";a.href=canvas.toDataURL("image/png");a.click()});
    render();
  }
};