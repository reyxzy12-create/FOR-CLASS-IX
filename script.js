(() => {
  const $ = (s) => document.querySelector(s);
  const pages = ["chat","iqc","ff","ml","about"];
  const sidebar = $("#sidebar"), scrim = $("#scrim");
  const titles = {chat:"CLASS-AI",iqc:"IQC MAKER",ff:"FAKE FF",ml:"FAKE ML",about:"ABOUT CLASS IX"};
  function showPage(name){
    pages.forEach(p => $("#page-"+p).classList.toggle("active-page",p===name));
    document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
    $("#topTitle").textContent=titles[name]||"CLASS-AI";
    sidebar.classList.remove("open"); scrim.classList.remove("show");
  }
  document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
  $("#menuButton").addEventListener("click",()=>{sidebar.classList.add("open");scrim.classList.add("show")});
  $("#closeSidebar").addEventListener("click",()=>{sidebar.classList.remove("open");scrim.classList.remove("show")});
  scrim.addEventListener("click",()=>{sidebar.classList.remove("open");scrim.classList.remove("show")});

  const STORE="forClassIX_chat_v1";
  let messages=[];
  try{messages=JSON.parse(localStorage.getItem(STORE)||"[]")}catch{messages=[]}
  const messagesEl=$("#messages"), welcome=$("#welcome");
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(messages.slice(-80)))}catch{}}
  function renderMessages(){
    messagesEl.innerHTML="";
    welcome.style.display=messages.length?"none":"block";
    messages.forEach(m=>{
      const row=document.createElement("div");row.className="message "+(m.role==="user"?"user":"assistant");
      if(m.role!=="user"){const av=document.createElement("div");av.className="message-avatar";av.textContent="✧";row.append(av)}
      const bubble=document.createElement("div");bubble.className="message-bubble";bubble.textContent=m.content;row.append(bubble);messagesEl.append(row);
    });
    $("#chatContent").scrollTop=$("#chatContent").scrollHeight;
  }
  renderMessages();
  $("#newChat").addEventListener("click",()=>{messages=[];persist();renderMessages();showPage("chat")});
  document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>{$("#chatInput").value=b.dataset.prompt;$("#chatInput").focus()}));
  const input=$("#chatInput");
  input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,150)+"px"});
  $("#chatForm").addEventListener("submit",async e=>{
    e.preventDefault();const text=input.value.trim();if(!text)return;
    messages.push({role:"user",content:text});persist();renderMessages();input.value="";input.style.height="auto";
    const send=$("#sendButton");send.disabled=true;send.textContent="…";
    const pending={role:"assistant",content:"CLASS-AI sedang berpikir…"};messages.push(pending);renderMessages();
    try{
      const reply=await window.ClassAI.reply(messages.filter(m=>m.content!=="CLASS-AI sedang berpikir…"));
      messages[messages.length-1]={role:"assistant",content:reply||"Maaf, belum ada jawaban."};
    }catch(err){messages[messages.length-1]={role:"assistant",content:"Maaf, CLASS-AI belum bisa terhubung. Periksa koneksi atau konfigurasi API di Vercel.\n\n"+(err.message||"")};}
    persist();renderMessages();send.disabled=false;send.textContent="↑";
  });

  // Initialize visual generators once images are available.
  window.IQC?.init();
  window.FakeFF?.init();
  window.FakeML?.init();
})();