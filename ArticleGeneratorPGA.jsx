import { useState, useCallback } from "react";

const TONES=[{v:"informal",l:"Informal"},{v:"formal",l:"Formal"},{v:"primeira_pessoa",l:"1ª Pessoa"},{v:"persuasivo",l:"Persuasivo"}];
const LANGS=[{v:"pt-BR",l:"🇧🇷 PT-BR"},{v:"en-US",l:"🇺🇸 EN-US"},{v:"en-GB",l:"🇬🇧 EN-GB"},{v:"es",l:"🇪🇸 ES"},{v:"de",l:"🇩🇪 DE"},{v:"fr",l:"🇫🇷 FR"},{v:"it",l:"🇮🇹 IT"}];
const TYPES=[{v:"review",l:"⭐ Review"},{v:"artigo",l:"📝 Artigo"},{v:"lista",l:"📋 Lista"},{v:"tutorial",l:"🛠 Tutorial"},{v:"comparativo",l:"⚖️ Comparativo"},{v:"buyer_guide",l:"🧭 Guia"}];
const PLATFORMS=[{v:"wordpress",l:"WordPress"},{v:"blogger",l:"Blogger"}];
const SIZES=[{v:"curto",l:"~600"},{v:"medio",l:"~1200"},{v:"longo",l:"~2000"}];
const SOURCES=[{id:"unsplash",l:"Unsplash",base:"https://unsplash.com/s/photos/"},{id:"pexels",l:"Pexels",base:"https://www.pexels.com/search/"},{id:"pixabay",l:"Pixabay",base:"https://pixabay.com/images/search/"},{id:"google",l:"Google",base:"https://www.google.com/search?tbm=isch&q="}];
const NICHES=[
  {v:"",l:"Sem nicho",emoji:"🌐",platform:""},
  {v:"cb_health",l:"Saúde & Peso",emoji:"💊",platform:"ClickBank"},
  {v:"cb_fitness",l:"Fitness & Dieta",emoji:"💪",platform:"ClickBank"},
  {v:"cb_money",l:"Make Money Online",emoji:"💰",platform:"ClickBank"},
  {v:"cb_relationships",l:"Relacionamentos",emoji:"❤️",platform:"ClickBank"},
  {v:"cb_survival",l:"Survival & Prep",emoji:"🏕️",platform:"ClickBank"},
  {v:"digi_health",l:"Saúde",emoji:"💊",platform:"Digistore24"},
  {v:"digi_business",l:"Business",emoji:"💼",platform:"Digistore24"},
  {v:"digi_selfhelp",l:"Self Help",emoji:"🧠",platform:"Digistore24"},
  {v:"amazon_tech",l:"Tech & Gadgets",emoji:"📱",platform:"Amazon"},
  {v:"amazon_home",l:"Casa & Cozinha",emoji:"🏠",platform:"Amazon"},
  {v:"amazon_beauty",l:"Beleza",emoji:"💄",platform:"Amazon"},
  {v:"amazon_pets",l:"Pets",emoji:"🐾",platform:"Amazon"},
  {v:"amazon_br",l:"Amazon Brasil",emoji:"🇧🇷",platform:"Amazon BR"},
  {v:"ml_br",l:"Mercado Livre",emoji:"🛒",platform:"ML BR"},
  {v:"hotmart",l:"Hotmart",emoji:"🔥",platform:"Hotmart"},
  {v:"kiwify",l:"Kiwify",emoji:"🥝",platform:"Kiwify"},
  {v:"shareasale",l:"ShareASale",emoji:"🔗",platform:"ShareASale"},
];
const NICHE_CTX={
  cb_health:"Pain points, transformation, natural ingredients, scientific backing, 60-day money-back. US audience. Empathetic.",
  cb_fitness:"Rapid results, easy system, motivational. Before/after transformation angle.",
  cb_money:"Financial freedom, passive income, beginner-friendly. Income disclaimer. Aspirational but realistic.",
  cb_relationships:"Emotional connection, fixing problems, communication. Empathetic personal tone.",
  cb_survival:"Preparedness, self-reliance, practical skills. Prepper/outdoors community.",
  digi_health:"European/international. Natural health solutions, wellness lifestyle.",
  digi_business:"Professional ROI, business growth, digital skills.",
  digi_selfhelp:"Mindset, productivity, success habits.",
  amazon_tech:"Spec comparison, use-cases, who should buy, pros/cons.",
  amazon_home:"Practicality, value for money, home improvement.",
  amazon_beauty:"Skin types, ingredients, results timeline.",
  amazon_pets:"Safety, quality, pet happiness.",
  amazon_br:"Amazon Brasil, preço em reais, frete Prime, avaliações.",
  ml_br:"Mercado Livre Brasil, Mercado Envios, Mercado Pago.",
  hotmart:"Produto digital, acesso vitalício, garantia de reembolso.",
  kiwify:"Produto digital, área de membros, suporte WhatsApp, bônus.",
  shareasale:"US/international affiliate, product quality, USP.",
};
const IDEAS_LABELS={review:"⭐ Reviews",lista:"📋 Listas",tutorial:"🛠 Tutoriais",comparativo:"⚖️ Comparativos",seo_long_tail:"🔍 Long Tail"};
const IDEAS_COLORS={review:"#f59e0b",lista:"#10b981",tutorial:"#3b82f6",comparativo:"#8b5cf6",seo_long_tail:"#e94560"};

// ── Prompts ──────────────────────────────────────────────────────────────────
function buildArticlePrompt({keyword,type,tone,lang,size,platform,affiliate,extra,niche}){
  const lM={"pt-BR":"Português do Brasil","en-US":"American English","en-GB":"British English","es":"Español","de":"Deutsch","fr":"Français","it":"Italiano"};
  const sM={curto:"~600 words",medio:"~1200 words",longo:"~2000 words"};
  const tM={informal:"informal engaging",formal:"formal professional",primeira_pessoa:"first-person personal",persuasivo:"persuasive conversion-focused"};
  const yM={review:"product review with star rating and pros/cons table",artigo:"informative blog article",lista:"Top 5 or Top 10 listicle",tutorial:"step-by-step how-to",comparativo:"comparative with table",buyer_guide:"buyer's guide with criteria"};
  const pN=platform==="blogger"?"Blogger HTML (no html/body).":"WordPress HTML (no html/body).";
  const nC=niche&&NICHE_CTX[niche]?`NICHE: ${NICHE_CTX[niche]}`:"";
  const aN=affiliate?`CTA: <a href="AFFILIATE_LINK_HERE" class="cta-btn" target="_blank" rel="nofollow sponsored">Check Best Price</a>`:"";
  return `Expert SEO writer. Write a ${yM[type]} about: "${keyword}"
Language: ${lM[lang]} | Tone: ${tM[tone]} | Length: ${sM[size]} | ${pN}
${[nC,aN,extra?"Extra: "+extra:""].filter(Boolean).join("\n")}
Start with: <!-- META: description --> then full HTML (<h1>,<h2>s,paragraphs,conclusion).
Reviews: include <table>. E-E-A-T optimized. ONLY HTML, no markdown.`;
}

function buildImagePrompt(html,lang){
  const text=html.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,1600);
  const l=lang==="pt-BR"?"Portuguese":"English";
  return `One image per H1/H2 (max 8). Article: ${text}
Return ONLY JSON: [{"section":"heading","position":"hero|section","description":"in ${l}","query_en":"3-5 word query","alt_text":"seo alt in ${l}"}]`;
}

function buildTitlesPrompt(keyword,lang,type){
  const lM={"pt-BR":"Português do Brasil","en-US":"American English","en-GB":"British English","es":"Español","de":"Deutsch","fr":"Français","it":"Italiano"};
  return `8 SEO blog titles for: "${keyword}" | Language: ${lM[lang]||"English"} | Type: ${type}
Mix: question, list, how-to, power word, curiosity. Return ONLY JSON array of strings.`;
}

function buildIdeasPrompt(keyword,niche,lang){
  const n=NICHES.find(x=>x.v===niche);
  const lM={"pt-BR":"Português do Brasil","en-US":"American English","en-GB":"British English","es":"Español","de":"Deutsch","fr":"Français","it":"Italiano"};
  return `Content strategist for affiliate marketing.
Product: "${keyword}" | Niche: ${n?n.emoji+" "+n.l+" ("+n.platform+")":niche} | Language: ${lM[lang]||"English"}
Generate 20 optimized article title ideas for future posts covering different angles.
Return ONLY this exact JSON (no markdown):
{"review":["t1","t2","t3","t4"],"lista":["t1","t2","t3","t4"],"tutorial":["t1","t2","t3","t4"],"comparativo":["t1","t2"],"seo_long_tail":["t1","t2","t3","t4","t5","t6"]}`;
}

function calcSEO(html,kw,meta){
  const text=html.replace(/<[^>]+>/g," ").toLowerCase();
  const kwl=kw.toLowerCase();
  const wc=text.split(/\s+/).filter(Boolean).length;
  const kwRe=new RegExp(kwl.split(" ").join(".{0,5}"),"gi");
  const kwc=(text.match(kwRe)||[]).length;
  const h2c=(html.match(/<h2/gi)||[]).length;
  const h3c=(html.match(/<h3/gi)||[]).length;
  const hasTable=/<table/i.test(html);
  const hasCTA=/cta-btn|AFFILIATE_LINK/i.test(html);
  const h1text=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||["",""])[1].replace(/<[^>]+>/g,"").toLowerCase();
  const kwInH1=kwRe.test(h1text);
  const kwInMeta=new RegExp(kwl.split(" ")[0],"i").test(meta);
  const paraC=(html.match(/<p/gi)||[]).length;
  const items=[
    {label:"Palavras",score:wc>=1200?20:wc>=700?14:wc>=400?8:3,max:20,detail:`${wc} palavras`,icon:"📝"},
    {label:"Estrutura H2/H3",score:h2c>=4?20:h2c>=3?15:h2c>=2?10:h2c>=1?5:0,max:20,detail:`${h2c} H2 · ${h3c} H3`,icon:"🏗"},
    {label:"Keyword no H1",score:kwInH1?15:0,max:15,detail:kwInH1?"Encontrada ✓":"Ausente ✗",icon:"🎯"},
    {label:"Densidade",score:kwc>=4&&kwc<=20?15:kwc>=2?8:kwc>=1?4:0,max:15,detail:`${kwc} ocorrências`,icon:"🔑"},
    {label:"Meta description",score:kwInMeta&&meta.length>=100?15:meta.length>=50?8:meta.length>0?4:0,max:15,detail:`${meta.length} chars`,icon:"🏷"},
    {label:"Riqueza",score:(hasTable?5:0)+(hasCTA?5:0)+(paraC>=6?5:paraC>=3?3:0),max:15,detail:[hasTable?"tabela":"",hasCTA?"CTA":"",`${paraC}p`].filter(Boolean).join("·"),icon:"💎"},
  ];
  return{items,total:items.reduce((a,i)=>a+i.score,0),maxTotal:items.reduce((a,i)=>a+i.max,0),wc,h2c,kwc};
}

async function callAPI(prompt,max){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:max,messages:[{role:"user",content:prompt}]})});
  const d=await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}
function parseJSON(raw){try{return JSON.parse(raw.replace(/```json|```/g,"").trim());}catch{return null;}}
function exportFile(html,keyword,fmt){
  const fname=keyword.replace(/\s+/g,"-").toLowerCase().slice(0,40);
  const content=fmt==="html"
    ?`<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>${keyword}</title></head>\n<body>\n${html}\n</body>\n</html>`
    :html.replace(/<br\s*\/?>/gi,"\n").replace(/<\/p>/gi,"\n\n").replace(/<\/h[1-6]>/gi,"\n\n").replace(/<[^>]+>/g,"").replace(/\n{3,}/g,"\n\n").trim();
  const blob=new Blob([content],{type:fmt==="html"?"text/html":"text/plain"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=`${fname}.${fmt}`;a.click();URL.revokeObjectURL(url);
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [kw,setKw]=useState("");
  const [type,setType]=useState("review");
  const [tone,setTone]=useState("informal");
  const [lang,setLang]=useState("pt-BR");
  const [size,setSize]=useState("medio");
  const [platform,setPlatform]=useState("wordpress");
  const [affiliate,setAffiliate]=useState(true);
  const [extra,setExtra]=useState("");
  const [niche,setNiche]=useState("");

  const [loading,setLoading]=useState(false);
  const [loadingIdeas,setLoadingIdeas]=useState(false);
  const [step,setStep]=useState("");
  const [progress,setProgress]=useState(0);

  const [result,setResult]=useState(null);
  const [meta,setMeta]=useState("");
  const [images,setImages]=useState([]);
  const [titles,setTitles]=useState([]);
  const [seo,setSeo]=useState(null);
  const [history,setHistory]=useState([]);
  const [ideas,setIdeas]=useState(null);
  const [ideasTab,setIdeasTab]=useState("review");

  const [tab,setTab]=useState("inicio");
  const [copied,setCopied]=useState(false);
  const [copiedAlt,setCopiedAlt]=useState(null);
  const [copiedTitle,setCopiedTitle]=useState(null);
  const [copiedIdea,setCopiedIdea]=useState(null);
  const [activeSource,setActiveSource]=useState("unsplash");
  const [error,setError]=useState(null);

  const canIdeas=kw.trim().length>2&&!!niche;
  const nicheObj=NICHES.find(n=>n.v===niche);
  const seoColor=seo?seo.total>=80?"#34d399":seo.total>=55?"#fbbf24":"#f87171":"#555";

  const generate=useCallback(async()=>{
    if(!kw.trim())return;
    setLoading(true);setResult(null);setMeta("");setImages([]);setTitles([]);setSeo(null);setError(null);setCopied(false);setProgress(0);setTab("html");
    try{
      setStep("✍️ Redigindo artigo...");setProgress(15);
      const html=await callAPI(buildArticlePrompt({keyword:kw,type,tone,lang,size,platform,affiliate,extra,niche}),4000);
      const mM=html.match(/<!--\s*META:\s*(.*?)\s*-->/i);
      const metaStr=mM?mM[1]:"";
      setMeta(metaStr);
      const clean=html.replace(/<!--\s*META:.*?-->\s*/i,"").trim();
      setResult(clean);setProgress(42);
      setSeo(calcSEO(clean,kw,metaStr));setProgress(52);
      setStep("🏷 Títulos alternativos...");
      const tRaw=await callAPI(buildTitlesPrompt(kw,lang,type),600);
      const pT=parseJSON(tRaw);if(Array.isArray(pT))setTitles(pT);setProgress(70);
      setStep("🖼 Sugestões de imagens...");
      const iRaw=await callAPI(buildImagePrompt(clean,lang),1000);
      const pI=parseJSON(iRaw);if(Array.isArray(pI))setImages(pI);setProgress(100);
      setHistory(h=>[{id:Date.now(),keyword:kw,html:clean,meta:metaStr,type,lang,ts:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})},...h].slice(0,10));
    }catch{setError("Erro ao gerar. Tente novamente.");}
    finally{setLoading(false);setStep("");setProgress(0);}
  },[kw,type,tone,lang,size,platform,affiliate,extra,niche]);

  const generateIdeas=useCallback(async()=>{
    if(!canIdeas)return;
    setLoadingIdeas(true);setIdeas(null);
    try{
      const raw=await callAPI(buildIdeasPrompt(kw,niche,lang),1500);
      const parsed=parseJSON(raw);
      if(parsed&&typeof parsed==="object"){
        setIdeas(parsed);
        const firstKey=Object.keys(parsed).find(k=>parsed[k]?.length);
        if(firstKey)setIdeasTab(firstKey);
      }
    }catch{}
    finally{setLoadingIdeas(false);}
  },[kw,niche,lang,canIdeas]);

  function copyHTML(){if(!result)return;navigator.clipboard.writeText(result).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});}
  function copyT(t,i){navigator.clipboard.writeText(t);setCopiedTitle(i);setTimeout(()=>setCopiedTitle(null),1800);}
  function copyAlt(t,i){navigator.clipboard.writeText(t);setCopiedAlt(i);setTimeout(()=>setCopiedAlt(null),1800);}
  function copyIdea(t,k,i){navigator.clipboard.writeText(t);setCopiedIdea(`${k}-${i}`);setTimeout(()=>setCopiedIdea(null),1800);}
  function useIdea(t){setKw(t);setTab("inicio");}
  function getSearchUrl(q){return(SOURCES.find(s=>s.id===activeSource)?.base||"")+encodeURIComponent(q);}
  function loadHistory(item){setResult(item.html);setMeta(item.meta);setKw(item.keyword);setSeo(calcSEO(item.html,item.keyword,item.meta));setTab("html");}
  function imgSrc(q,i){return`https://loremflickr.com/400/220/${encodeURIComponent(q)}?lock=${i*17+3}`;}

  // All tabs — always available
  const ALL_TABS=[
    {k:"inicio",l:"🏠 Início"},
    {k:"html",l:"</> HTML"},
    {k:"preview",l:"👁 Preview"},
    {k:"imagens",l:images.length?"🖼 Imagens ("+images.length+")":"🖼 Imagens"},
    {k:"titulos",l:titles.length?"🏷 Títulos ("+titles.length+")":"🏷 Títulos"},
    {k:"ideias",l:"💡 Ideias de Artigos"},
    {k:"seo",l:seo?"📊 SEO "+seo.total+"/"+seo.maxTotal:"📊 SEO"},
    {k:"historico",l:history.length?"🔄 Histórico ("+history.length+")":"🔄 Histórico"},
  ];

  const iS={background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,color:"#eeeef8",padding:"9px 12px",fontSize:12,width:"100%",fontFamily:"inherit",transition:"border-color .2s,box-shadow .2s"};

  return(
    <div style={{minHeight:"100vh",background:"#07070f",color:"#eeeef8",fontFamily:"-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Ambient background */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"-15%",left:"-5%",width:"50%",height:"50%",background:"radial-gradient(ellipse,rgba(233,69,96,.06),transparent 70%)",filter:"blur(50px)"}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"-10%",width:"50%",height:"50%",background:"radial-gradient(ellipse,rgba(139,92,246,.05),transparent 70%)",filter:"blur(50px)"}}/>
      </div>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .su{animation:slideUp .4s cubic-bezier(.16,1,.3,1) forwards;opacity:0}
        input:focus,select:focus,textarea:focus{outline:none;border-color:rgba(233,69,96,.5)!important;box-shadow:0 0 0 3px rgba(233,69,96,.07)!important}
        select option{background:#111120}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:99px}
        .hlift{transition:transform .2s,box-shadow .2s}.hlift:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(0,0,0,.4)!important}
        .hscale{transition:transform .15s,opacity .15s}.hscale:hover{transform:scale(1.02)}
        .hdim{transition:opacity .15s}.hdim:hover{opacity:.75}
        .ideacard{transition:background .15s,transform .15s}.ideacard:hover{background:rgba(255,255,255,.05)!important;transform:translateX(3px)}
        .trow{transition:background .15s,transform .15s}.trow:hover{background:rgba(255,255,255,.04)!important;transform:translateX(2px)}
        .htab{transition:all .18s}
      `}</style>

      {/* Header */}
      <header style={{position:"relative",zIndex:10,borderBottom:"1px solid rgba(255,255,255,.05)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",background:"rgba(7,7,15,.85)",flexShrink:0}}>
        <div style={{padding:"0 24px",height:58,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:34,height:34,borderRadius:11,background:"linear-gradient(135deg,#e94560,#9333ea)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 4px 16px rgba(233,69,96,.4)"}}>✍</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,letterSpacing:"-.5px",background:"linear-gradient(135deg,#fff,rgba(255,255,255,.55))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PGA</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.25)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Gerador de Artigos IA</div>
          </div>

          {/* Platform toggle */}
          <div style={{marginLeft:8,display:"flex",background:"rgba(255,255,255,.04)",borderRadius:99,padding:3,border:"1px solid rgba(255,255,255,.06)",gap:2}}>
            {PLATFORMS.map(p=>(
              <button key={p.v} onClick={()=>setPlatform(p.v)} className="htab" style={{padding:"4px 13px",borderRadius:99,border:"none",background:platform===p.v?"rgba(255,255,255,.1)":"transparent",color:platform===p.v?"#fff":"rgba(255,255,255,.3)",fontSize:11,cursor:"pointer",fontWeight:600}}>
                {p.l}
              </button>
            ))}
          </div>

          <div style={{marginLeft:"auto",display:"flex",gap:7,alignItems:"center"}}>
            {result&&<>
              <GBtn onClick={()=>exportFile(result,kw,"html")}>⬇ HTML</GBtn>
              <GBtn onClick={()=>exportFile(result,kw,"txt")}>⬇ TXT</GBtn>
              <GBtn onClick={copyHTML} ok={copied}>{copied?"✓ Copiado!":"📋 Copiar HTML"}</GBtn>
            </>}
            {seo&&<div style={{padding:"4px 12px",borderRadius:99,background:seoColor+"18",border:`1px solid ${seoColor}33`,fontSize:11,fontWeight:700,color:seoColor,fontFamily:"monospace"}}>SEO {seo.total}/{seo.maxTotal}</div>}
          </div>
        </div>
      </header>

      {loading&&progress>0&&(
        <div style={{position:"relative",zIndex:10,height:2,background:"rgba(255,255,255,.04)"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#e94560,#9333ea,#3b82f6)",width:progress+"%",transition:"width .5s ease",boxShadow:"0 0 10px rgba(233,69,96,.6)"}}/>
        </div>
      )}

      <div style={{position:"relative",zIndex:1,display:"flex",flex:1,minHeight:0,overflow:"hidden"}}>

        {/* Sidebar */}
        <aside style={{width:264,flexShrink:0,borderRight:"1px solid rgba(255,255,255,.05)",overflowY:"auto",padding:"18px 14px",display:"flex",flexDirection:"column",gap:14}}>

          <Fld label="Palavra-chave">
            <input value={kw} onChange={e=>setKw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()} placeholder="Ex: Air Fryer, Keto Boost..." style={{...iS,fontSize:13,fontWeight:500,padding:"10px 13px"}}/>
          </Fld>

          <Fld label="Nicho / Plataforma">
            <select value={niche} onChange={e=>setNiche(e.target.value)} style={iS}>
              {NICHES.map(n=><option key={n.v} value={n.v}>{n.emoji} {n.l}{n.platform?" · "+n.platform:""}</option>)}
            </select>
          </Fld>

          {/* Ideas shortcut — visible only when niche+kw set */}
          {canIdeas&&(
            <button className="hscale su" onClick={()=>{setTab("ideias");if(!ideas&&!loadingIdeas)generateIdeas();}} style={{
              padding:"9px 12px",borderRadius:13,cursor:"pointer",fontWeight:700,fontSize:12,
              background:"linear-gradient(135deg,rgba(233,69,96,.1),rgba(139,92,246,.1))",
              border:"1px solid rgba(233,69,96,.22)",color:"#e94560",
              display:"flex",alignItems:"center",justifyContent:"center",gap:7,
            }}>
              <span>💡</span><span>Ideias para Próximos Artigos</span>
            </button>
          )}

          <Fld label="Tipo de Conteúdo">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {TYPES.map(t=>(
                <button key={t.v} onClick={()=>setType(t.v)} className="htab" style={{padding:"7px 4px",borderRadius:11,border:"1px solid",borderColor:type===t.v?"rgba(233,69,96,.38)":"rgba(255,255,255,.06)",background:type===t.v?"rgba(233,69,96,.09)":"rgba(255,255,255,.02)",color:type===t.v?"#e94560":"rgba(255,255,255,.35)",fontSize:11,cursor:"pointer",fontWeight:600,textAlign:"center",lineHeight:1.3}}>
                  {t.l}
                </button>
              ))}
            </div>
          </Fld>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Fld label="Tom">
              <select value={tone} onChange={e=>setTone(e.target.value)} style={{...iS,fontSize:11}}>{TONES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select>
            </Fld>
            <Fld label="Idioma">
              <select value={lang} onChange={e=>setLang(e.target.value)} style={{...iS,fontSize:11}}>{LANGS.map(l=><option key={l.v} value={l.v}>{l.l}</option>)}</select>
            </Fld>
          </div>

          <Fld label="Tamanho">
            <div style={{display:"flex",gap:5}}>
              {SIZES.map(s=>(
                <button key={s.v} onClick={()=>setSize(s.v)} className="htab" style={{flex:1,padding:"7px 4px",borderRadius:10,border:"1px solid",borderColor:size===s.v?"rgba(233,69,96,.38)":"rgba(255,255,255,.06)",background:size===s.v?"rgba(233,69,96,.09)":"rgba(255,255,255,.02)",color:size===s.v?"#e94560":"rgba(255,255,255,.3)",fontSize:10,cursor:"pointer",fontWeight:600,textAlign:"center"}}>
                  {s.l}
                </button>
              ))}
            </div>
          </Fld>

          <Fld label="Instruções Extras">
            <textarea value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Ex: mencionar garantia, preço em reais..." rows={2} style={{...iS,resize:"vertical",lineHeight:1.6}}/>
          </Fld>

          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"9px 11px",borderRadius:12,border:"1px solid rgba(255,255,255,.05)",background:"rgba(255,255,255,.02)"}}>
            <div onClick={()=>setAffiliate(v=>!v)} style={{width:36,height:20,borderRadius:99,background:affiliate?"linear-gradient(135deg,#e94560,#9333ea)":"rgba(255,255,255,.09)",position:"relative",transition:"all .25s",flexShrink:0,cursor:"pointer",boxShadow:affiliate?"0 0 14px rgba(233,69,96,.3)":"none"}}>
              <div style={{position:"absolute",top:2,left:affiliate?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 2px 6px rgba(0,0,0,.3)"}}/>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Botão de afiliado</span>
          </label>

          <button onClick={generate} disabled={loading||!kw.trim()} className={!loading&&kw.trim()?"hscale":""} style={{
            padding:"13px",borderRadius:15,
            background:loading||!kw.trim()?"rgba(255,255,255,.04)":"linear-gradient(135deg,#e94560,#9333ea)",
            color:loading||!kw.trim()?"rgba(255,255,255,.18)":"#fff",
            border:"1px solid "+(loading||!kw.trim()?"rgba(255,255,255,.05)":"transparent"),
            fontSize:14,fontWeight:800,cursor:loading||!kw.trim()?"not-allowed":"pointer",
            boxShadow:loading||!kw.trim()?"none":"0 4px 24px rgba(233,69,96,.3)",letterSpacing:"-.2px",
          }}>
            {loading?"⚙️  "+step.slice(3,22)+"...":"🚀  Gerar Artigo"}
          </button>
        </aside>

        {/* Main */}
        <main style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>

          {/* Tab bar — always visible */}
          <div style={{borderBottom:"1px solid rgba(255,255,255,.05)",padding:"8px 16px",display:"flex",alignItems:"center",gap:4,flexShrink:0,background:"rgba(7,7,15,.7)",backdropFilter:"blur(16px)",overflowX:"auto"}}>
            <div style={{display:"flex",gap:3,background:"rgba(0,0,0,.4)",borderRadius:16,padding:4,border:"1px solid rgba(255,255,255,.05)"}}>
              {ALL_TABS.map(t=>(
                <button key={t.k} onClick={()=>setTab(t.k)} className="htab" style={{
                  padding:"5px 13px",borderRadius:12,border:"1px solid",
                  borderColor:tab===t.k?"rgba(233,69,96,.3)":"transparent",
                  background:tab===t.k?"rgba(233,69,96,.1)":"transparent",
                  color:tab===t.k?"#e94560":"rgba(255,255,255,.3)",
                  fontSize:11,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",
                }}>{t.l}</button>
              ))}
            </div>
          </div>

          {/* Meta bar */}
          {meta&&(
            <div style={{borderBottom:"1px solid rgba(77,157,224,.1)",padding:"6px 18px",display:"flex",alignItems:"center",gap:9,flexShrink:0,background:"rgba(77,157,224,.03)"}}>
              <span style={{fontSize:9,color:"#4d9de0",fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,flexShrink:0}}>META</span>
              <span style={{fontSize:11,color:"rgba(107,159,196,.8)",flex:1,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meta}</span>
              <button onClick={()=>navigator.clipboard.writeText(meta)} style={{padding:"2px 9px",borderRadius:99,background:"rgba(77,157,224,.1)",color:"#4d9de0",border:"1px solid rgba(77,157,224,.18)",fontSize:10,cursor:"pointer",fontWeight:600,flexShrink:0}}>Copiar</button>
            </div>
          )}

          {error&&<div style={{margin:"16px",padding:"12px 16px",borderRadius:14,background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.18)",color:"#f87171",fontSize:12}}>⚠️ {error}</div>}

          {/* Content */}
          <div style={{flex:1,overflow:"auto"}}>

            {/* Início */}
            {tab==="inicio"&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"40px 24px",textAlign:"center",gap:22}}>
                <div style={{width:76,height:76,borderRadius:26,background:"linear-gradient(135deg,rgba(233,69,96,.12),rgba(147,51,234,.12))",border:"1px solid rgba(233,69,96,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:"0 0 40px rgba(233,69,96,.07)"}}>✍️</div>
                <div>
                  <div style={{fontSize:22,fontWeight:800,letterSpacing:"-.6px",marginBottom:7}}>Crie artigos com IA</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,.28)",lineHeight:1.8,maxWidth:300}}>Configure o nicho e a palavra-chave, clique em <span style={{color:"#e94560",fontWeight:600}}>Gerar Artigo</span>.</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,maxWidth:420}}>
                  {[["✅","HTML WordPress/Blogger"],["🌍","7 idiomas"],["🎯","18+ nichos afiliados"],["💡","Ideias de artigos por nicho"],["📊","Score SEO automático"],["🖼","Preview de imagens"],["🔄","Histórico da sessão"],["📤","Export HTML e TXT"]].map(([icon,label],i)=>(
                    <div key={i} className="hlift su" style={{animationDelay:i*35+"ms",padding:"10px 14px",borderRadius:14,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:9,fontSize:12,color:"rgba(255,255,255,.35)",boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>
                      <span style={{fontSize:15}}>{icon}</span>{label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading&&tab!=="inicio"&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:14}}>
                <div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(255,255,255,.04)",borderTop:"3px solid #e94560",animation:"spin .7s linear infinite",boxShadow:"0 0 18px rgba(233,69,96,.25)"}}/>
                <div style={{fontSize:13,color:"rgba(255,255,255,.28)",animation:"pulse 1.8s ease infinite"}}>{step}</div>
              </div>
            )}

            {/* HTML */}
            {result&&tab==="html"&&(
              <textarea readOnly value={result} style={{width:"100%",height:"100%",minHeight:400,background:"#030309",color:"#4db34d",border:"none",padding:"20px 22px",fontFamily:"'SF Mono','Fira Code',Consolas,monospace",fontSize:12,lineHeight:1.85,resize:"none",outline:"none"}}/>
            )}

            {/* Preview */}
            {result&&tab==="preview"&&(
              <div style={{padding:"40px 52px",maxWidth:800,margin:"0 auto"}}>
                <style>{`
                  .pb h1{font-size:1.9em;color:#fff;margin-bottom:.45em;line-height:1.22;letter-spacing:-.5px;font-weight:800}
                  .pb h2{font-size:1.28em;color:#d5d5ef;margin:1.9em 0 .6em;padding-left:15px;border-left:3px solid #e94560;font-weight:700}
                  .pb h3{font-size:1.07em;color:#8888c0;margin:1.3em 0 .45em;font-weight:600}
                  .pb p{color:#a5a5c0;line-height:1.95;margin:.78em 0;font-size:15px}
                  .pb ul,.pb ol{color:#a5a5c0;padding-left:1.45em;line-height:1.9}
                  .pb li{margin:.38em 0;font-size:14px}
                  .pb table{width:100%;border-collapse:collapse;margin:1.7em 0;border-radius:14px;overflow:hidden;font-size:13px}
                  .pb th{background:rgba(139,92,246,.1);color:#a78bfa;padding:10px 14px;text-align:left;font-weight:700}
                  .pb td{border-top:1px solid rgba(255,255,255,.05);padding:9px 14px;color:#a5a5c0}
                  .pb a.cta-btn{display:inline-block;background:linear-gradient(135deg,#e94560,#9333ea);color:#fff;padding:12px 28px;border-radius:14px;text-decoration:none;font-weight:700;margin:1.3em 0;box-shadow:0 5px 18px rgba(233,69,96,.32);font-size:14px}
                  .pb strong{color:#fffad0}
                `}</style>
                <div className="pb" dangerouslySetInnerHTML={{__html:result}}/>
              </div>
            )}

            {/* Imagens */}
            {tab==="imagens"&&(
              <div style={{padding:"20px 22px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,.2)",fontWeight:700,textTransform:"uppercase",letterSpacing:1.2}}>Banco de imagens</span>
                  <div style={{display:"flex",gap:4,background:"rgba(0,0,0,.4)",borderRadius:99,padding:3,border:"1px solid rgba(255,255,255,.05)"}}>
                    {SOURCES.map(s=>(
                      <button key={s.id} onClick={()=>setActiveSource(s.id)} className="htab" style={{padding:"4px 12px",borderRadius:99,border:"1px solid",borderColor:activeSource===s.id?"rgba(233,69,96,.35)":"transparent",background:activeSource===s.id?"rgba(233,69,96,.1)":"transparent",color:activeSource===s.id?"#e94560":"rgba(255,255,255,.3)",fontSize:11,cursor:"pointer",fontWeight:600}}>{s.l}</button>
                    ))}
                  </div>
                </div>
                {images.length===0&&<Empty icon="🖼" text="Gere um artigo para ver as sugestões de imagens"/>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))",gap:13}}>
                  {images.map((img,idx)=>(
                    <div key={idx} className="su hlift" style={{animationDelay:idx*50+"ms",borderRadius:18,overflow:"hidden",background:"rgba(255,255,255,.02)",border:"1px solid "+(img.position==="hero"?"rgba(139,92,246,.18)":"rgba(255,255,255,.06)"),boxShadow:"0 4px 18px rgba(0,0,0,.28)"}}>
                      <div style={{position:"relative",height:148,background:"#0a0a14",overflow:"hidden"}}>
                        <img src={imgSrc(img.query_en,idx)} alt={img.alt_text} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.75,transition:"opacity .3s,transform .3s"}}
                          onMouseEnter={e=>{e.target.style.opacity=".92";e.target.style.transform="scale(1.05)";}}
                          onMouseLeave={e=>{e.target.style.opacity=".75";e.target.style.transform="scale(1)";}}
                          onError={e=>{e.target.parentNode.style.background="rgba(139,92,246,.06)";e.target.style.display="none";}}/>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.04),rgba(7,7,15,.88))"}}/>
                        <div style={{position:"absolute",top:9,left:9}}>
                          <span style={{background:img.position==="hero"?"rgba(139,92,246,.85)":"rgba(0,0,0,.65)",backdropFilter:"blur(8px)",color:"#fff",fontSize:9,padding:"2px 8px",borderRadius:99,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>{img.position==="hero"?"⭐ Hero":"📌 Seção"}</span>
                        </div>
                        <div style={{position:"absolute",bottom:9,left:11,right:11}}>
                          <div style={{fontSize:12,color:"#fff",fontWeight:700,lineHeight:1.3,textShadow:"0 2px 8px rgba(0,0,0,.9)"}}>{img.section}</div>
                        </div>
                      </div>
                      <div style={{padding:"11px 13px",display:"flex",flexDirection:"column",gap:7}}>
                        <p style={{fontSize:11,color:"rgba(255,255,255,.28)",lineHeight:1.5,fontStyle:"italic"}}>{img.description}</p>
                        <div style={{display:"flex",flexDirection:"column",gap:5}}>
                          <Chip c="#8b5cf6" l="QUERY">{img.query_en}</Chip>
                          <Chip c="#10b981" l="ALT">{img.alt_text}</Chip>
                        </div>
                        <div style={{display:"flex",gap:6,marginTop:2}}>
                          <a href={getSearchUrl(img.query_en)} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"7px",background:"linear-gradient(135deg,#e94560,#c41d4a)",color:"#fff",borderRadius:11,textDecoration:"none",fontSize:11,fontWeight:700,textAlign:"center",display:"block",boxShadow:"0 3px 10px rgba(233,69,96,.28)"}}>🔍 Buscar</a>
                          <button onClick={()=>copyAlt(img.alt_text,idx)} style={{padding:"7px 11px",background:copiedAlt===idx?"rgba(16,185,129,.12)":"rgba(255,255,255,.04)",color:copiedAlt===idx?"#10b981":"rgba(255,255,255,.35)",border:"1px solid "+(copiedAlt===idx?"rgba(16,185,129,.28)":"rgba(255,255,255,.06)"),borderRadius:11,fontSize:11,cursor:"pointer",fontWeight:700,transition:"all .2s"}}>{copiedAlt===idx?"✓":"📋"} Alt</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Títulos */}
            {tab==="titulos"&&(
              <div style={{padding:"22px 26px",maxWidth:640}}>
                {titles.length===0&&<Empty icon="🏷" text="Gere um artigo para ver os títulos alternativos"/>}
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {titles.map((t,i)=>(
                    <div key={i} className="su trow" style={{animationDelay:i*38+"ms",padding:"12px 15px",borderRadius:15,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:11,cursor:"pointer"}} onClick={()=>copyT(t,i)}>
                      <div style={{width:25,height:25,borderRadius:8,background:i===0?"linear-gradient(135deg,#e94560,#c41d4a)":i===1?"linear-gradient(135deg,#9333ea,#6d28d9)":"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:i<2?"#fff":"rgba(255,255,255,.28)",flexShrink:0}}>{i+1}</div>
                      <span style={{flex:1,fontSize:13,color:"rgba(255,255,255,.78)",lineHeight:1.45,fontWeight:i===0?600:400}}>{t}</span>
                      <span style={{fontSize:11,color:copiedTitle===i?"#10b981":"rgba(255,255,255,.2)",flexShrink:0,transition:"color .2s"}}>{copiedTitle===i?"✓ Copiado":"📋"}</span>
                    </div>
                  ))}
                </div>
                {titles.length>0&&<div style={{marginTop:12,padding:"11px 14px",borderRadius:13,background:"rgba(139,92,246,.05)",border:"1px solid rgba(139,92,246,.1)",fontSize:11,color:"rgba(255,255,255,.28)",lineHeight:1.7}}>💡 Clique para copiar · Teste diferentes títulos e monitore o CTR no Search Console.</div>}
              </div>
            )}

            {/* 💡 Ideias de Artigos */}
            {tab==="ideias"&&(
              <div style={{padding:"22px 24px"}}>
                {/* Header */}
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontSize:17,fontWeight:800,letterSpacing:"-.4px",marginBottom:5}}>💡 Ideias para Próximos Artigos</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,.3)",lineHeight:1.6}}>
                      {nicheObj&&nicheObj.v?<span>{nicheObj.emoji} <strong style={{color:"rgba(255,255,255,.5)"}}>{nicheObj.l}</strong> ({nicheObj.platform}) · </span>:""}
                      {kw?<span style={{fontStyle:"italic"}}>"{kw}"</span>:<span style={{color:"rgba(255,255,255,.2)"}}>configure a palavra-chave na barra lateral</span>}
                    </div>
                  </div>
                  <button onClick={generateIdeas} disabled={loadingIdeas||!canIdeas} className={canIdeas&&!loadingIdeas?"hscale":""} style={{
                    padding:"9px 20px",borderRadius:99,flexShrink:0,
                    background:!canIdeas?"rgba(255,255,255,.03)":loadingIdeas?"rgba(233,69,96,.05)":"rgba(233,69,96,.1)",
                    color:!canIdeas?"rgba(255,255,255,.15)":"#e94560",
                    border:"1px solid "+(canIdeas?"rgba(233,69,96,.2)":"rgba(255,255,255,.06)"),
                    fontSize:12,cursor:(!canIdeas||loadingIdeas)?"not-allowed":"pointer",fontWeight:700,
                  }}>
                    {loadingIdeas?"⏳ Gerando...":"🔄 Gerar Ideias"}
                  </button>
                </div>

                {/* States */}
                {!canIdeas&&<div style={{padding:"32px",borderRadius:18,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",textAlign:"center",color:"rgba(255,255,255,.25)"}}>
                  <div style={{fontSize:32,marginBottom:10}}>🎯</div>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:5,color:"rgba(255,255,255,.4)"}}>Selecione nicho e palavra-chave</div>
                  <div style={{fontSize:12}}>Configure os campos na barra lateral para gerar ideias de títulos otimizados.</div>
                </div>}

                {canIdeas&&loadingIdeas&&(
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"56px 20px",gap:14}}>
                    <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid rgba(255,255,255,.04)",borderTop:"3px solid #e94560",animation:"spin .7s linear infinite"}}/>
                    <div style={{fontSize:12,color:"rgba(255,255,255,.3)"}}>Criando ideias para o nicho <strong style={{color:"rgba(255,255,255,.5)"}}>{nicheObj?.l}</strong>...</div>
                  </div>
                )}

                {canIdeas&&!loadingIdeas&&!ideas&&(
                  <div style={{padding:"28px",borderRadius:18,background:"rgba(233,69,96,.04)",border:"1px solid rgba(233,69,96,.1)",textAlign:"center",color:"rgba(255,255,255,.3)"}}>
                    <div style={{fontSize:30,marginBottom:10}}>🚀</div>
                    <div style={{fontSize:13}}>Clique em <strong style={{color:"#e94560"}}>Gerar Ideias</strong> para criar títulos otimizados para seu nicho.</div>
                  </div>
                )}

                {ideas&&!loadingIdeas&&(
                  <div>
                    {/* Category pills */}
                    <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
                      {Object.keys(ideas).filter(k=>ideas[k]?.length).map(k=>(
                        <button key={k} onClick={()=>setIdeasTab(k)} className="htab" style={{
                          padding:"6px 16px",borderRadius:99,border:"1px solid",flexShrink:0,
                          borderColor:ideasTab===k?IDEAS_COLORS[k]+"55":"rgba(255,255,255,.06)",
                          background:ideasTab===k?IDEAS_COLORS[k]+"16":"rgba(255,255,255,.02)",
                          color:ideasTab===k?IDEAS_COLORS[k]:"rgba(255,255,255,.28)",
                          fontSize:12,cursor:"pointer",fontWeight:700,
                        }}>
                          {IDEAS_LABELS[k]||k}
                          <span style={{marginLeft:6,opacity:.55,fontSize:10}}>({ideas[k].length})</span>
                        </button>
                      ))}
                    </div>

                    {/* Cards grid */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:9}}>
                      {(ideas[ideasTab]||[]).map((t,i)=>(
                        <div key={i} className="su ideacard" style={{
                          animationDelay:i*32+"ms",
                          padding:"12px 13px",borderRadius:14,
                          background:"rgba(255,255,255,.025)",
                          border:"1px solid rgba(255,255,255,.06)",
                          display:"flex",alignItems:"flex-start",gap:9,
                          boxShadow:"0 2px 8px rgba(0,0,0,.14)",
                        }}>
                          <div style={{width:23,height:23,borderRadius:7,flexShrink:0,marginTop:1,background:IDEAS_COLORS[ideasTab]+"18",border:"1px solid "+IDEAS_COLORS[ideasTab]+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:IDEAS_COLORS[ideasTab]}}>
                            {i+1}
                          </div>
                          <span style={{flex:1,fontSize:12,color:"rgba(255,255,255,.72)",lineHeight:1.55}}>{t}</span>
                          <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                            {/* Use as keyword */}
                            <button onClick={()=>useIdea(t)} title="Usar como keyword" style={{width:27,height:27,borderRadius:8,border:"none",cursor:"pointer",background:IDEAS_COLORS[ideasTab]+"18",color:IDEAS_COLORS[ideasTab],fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s"}}>↗</button>
                            {/* Copy */}
                            <button onClick={()=>copyIdea(t,ideasTab,i)} title="Copiar" style={{width:27,height:27,borderRadius:8,border:"none",cursor:"pointer",background:copiedIdea===ideasTab+"-"+i?"rgba(16,185,129,.15)":"rgba(255,255,255,.05)",color:copiedIdea===ideasTab+"-"+i?"#10b981":"rgba(255,255,255,.3)",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                              {copiedIdea===ideasTab+"-"+i?"✓":"📋"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{marginTop:14,padding:"10px 14px",borderRadius:11,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",fontSize:11,color:"rgba(255,255,255,.22)",display:"flex",gap:18,flexWrap:"wrap"}}>
                      <span>↗ <strong style={{color:"rgba(255,255,255,.38)"}}>Usar</strong> — define como keyword</span>
                      <span>📋 <strong style={{color:"rgba(255,255,255,.38)"}}>Copiar</strong> — copia o título</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO */}
            {tab==="seo"&&(
              <div style={{padding:"22px 26px",maxWidth:520}}>
                {!seo&&<Empty icon="📊" text="Gere um artigo para ver o score de SEO"/>}
                {seo&&(
                  <>
                    <div className="su hlift" style={{borderRadius:20,padding:"22px 26px",marginBottom:18,background:"rgba(255,255,255,.025)",border:"1px solid "+seoColor+"20",display:"flex",alignItems:"center",gap:22,boxShadow:"0 0 40px "+seoColor+"0e"}}>
                      <svg width="88" height="88" viewBox="0 0 88 88" style={{flexShrink:0}}>
                        <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="8"/>
                        <circle cx="44" cy="44" r="36" fill="none" stroke={seoColor} strokeWidth="8"
                          strokeDasharray={(seo.total/seo.maxTotal)*226+" 226"}
                          strokeDashoffset="56" strokeLinecap="round" transform="rotate(-90 44 44)"
                          style={{filter:"drop-shadow(0 0 7px "+seoColor+")",transition:"stroke-dasharray .8s ease"}}/>
                        <text x="44" y="47" textAnchor="middle" fill={seoColor} fontSize="19" fontWeight="800" fontFamily="system-ui">{seo.total}</text>
                        <text x="44" y="59" textAnchor="middle" fill="rgba(255,255,255,.22)" fontSize="9" fontFamily="system-ui">/{seo.maxTotal}</text>
                      </svg>
                      <div>
                        <div style={{fontSize:18,fontWeight:800,color:seoColor,letterSpacing:"-.3px",marginBottom:5}}>
                          {seo.total>=80?"🟢 Excelente":seo.total>=60?"🟡 Bom":seo.total>=40?"🟠 Regular":"🔴 Melhorar"}
                        </div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,.28)",lineHeight:1.8}}>
                          {seo.wc} palavras · {seo.h2c} H2 · {seo.kwc} ocorrências
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {seo.items.map((item,i)=>{
                        const ic=item.score===item.max?"#34d399":item.score>0?"#fbbf24":"#f87171";
                        return(
                          <div key={i} className="su hlift" style={{animationDelay:i*45+"ms",borderRadius:15,padding:"13px 15px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",boxShadow:"0 2px 8px rgba(0,0,0,.13)"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                              <span style={{fontSize:13,color:"rgba(255,255,255,.72)",fontWeight:600,display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:14}}>{item.icon}</span>{item.label}</span>
                              <span style={{fontSize:11,color:ic,fontWeight:700,fontFamily:"monospace",background:ic+"14",padding:"2px 8px",borderRadius:99}}>{item.score}/{item.max}</span>
                            </div>
                            <div style={{height:4,background:"rgba(255,255,255,.05)",borderRadius:99,overflow:"hidden",marginBottom:6}}>
                              <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,"+ic+","+ic+"aa)",width:(item.score/item.max*100)+"%",boxShadow:"0 0 7px "+ic+"80",transition:"width .7s cubic-bezier(.16,1,.3,1)"}}/>
                            </div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,.22)",letterSpacing:".2px"}}>{item.detail}</div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Histórico */}
            {tab==="historico"&&(
              <div style={{padding:"18px 22px"}}>
                {history.length===0&&<Empty icon="🔄" text="Nenhum artigo gerado nesta sessão"/>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {history.map((item,i)=>(
                    <div key={item.id} className="su hlift" style={{animationDelay:i*38+"ms",borderRadius:17,padding:"13px 16px",background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:13,cursor:"pointer",boxShadow:"0 2px 9px rgba(0,0,0,.18)"}} onClick={()=>loadHistory(item)}>
                      <div style={{width:40,height:40,borderRadius:13,background:"linear-gradient(135deg,rgba(233,69,96,.14),rgba(139,92,246,.14))",border:"1px solid rgba(233,69,96,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>
                        {item.type==="review"?"⭐":item.type==="lista"?"📋":item.type==="tutorial"?"🛠":item.type==="comparativo"?"⚖️":"✍️"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.82)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",letterSpacing:"-.2px",marginBottom:3}}>{item.keyword}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,.24)",display:"flex",gap:7,flexWrap:"wrap"}}>
                          <span>{TYPES.find(t=>t.v===item.type)?.l.replace(/^[^ ]+ /,"")}</span>
                          <span>·</span><span>{LANGS.find(l=>l.v===item.lang)?.l.replace(/^[^ ]+ /,"")}</span>
                          <span>·</span><span>{item.ts}</span>
                        </div>
                      </div>
                      <div style={{fontSize:11,color:"#e94560",fontWeight:700,background:"rgba(233,69,96,.08)",padding:"4px 11px",borderRadius:99,border:"1px solid rgba(233,69,96,.18)",flexShrink:0}}>↩ Restaurar</div>
                    </div>
                  ))}
                </div>
                {history.length>0&&<div style={{marginTop:12,textAlign:"center",fontSize:11,color:"rgba(255,255,255,.15)"}}>Histórico apenas nesta sessão · Export para salvar permanentemente</div>}
              </div>
            )}

          </div>{/* end content */}
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Fld({label,children}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,.22)",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.1px"}}>{label}</div>
      {children}
    </div>
  );
}
function GBtn({children,onClick,ok}){
  return(
    <button onClick={onClick} style={{padding:"5px 13px",borderRadius:99,background:ok?"rgba(52,211,153,.09)":"rgba(255,255,255,.04)",color:ok?"#34d399":"rgba(255,255,255,.38)",border:"1px solid "+(ok?"rgba(52,211,153,.2)":"rgba(255,255,255,.07)"),fontSize:11,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",transition:"all .18s"}}>
      {children}
    </button>
  );
}
function Empty({icon,text}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:11,color:"rgba(255,255,255,.2)"}}>
      <div style={{fontSize:38,opacity:.35}}>{icon}</div>
      <div style={{fontSize:13}}>{text}</div>
    </div>
  );
}
function Chip({c,l,children}){
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:6,background:c+"0d",borderRadius:7,padding:"5px 8px",border:"1px solid "+c+"1a"}}>
      <span style={{fontSize:8,color:c,fontWeight:800,textTransform:"uppercase",letterSpacing:.9,flexShrink:0,paddingTop:2}}>{l}</span>
      <span style={{fontSize:11,color:c+"cc",lineHeight:1.4,flex:1}}>{children}</span>
    </div>
  );
}
