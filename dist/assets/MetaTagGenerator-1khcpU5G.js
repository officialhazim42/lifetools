import{c as y,j as e,h as j}from"./index-C-cfPXoc.js";import{a,h as v}from"./lucide-CnYeBL73.js";import"./vendor-aacu-Mpa.js";const C=()=>{const{showToast:m}=y(),[s,d]=a.useState(""),[r,p]=a.useState(""),[o,x]=a.useState(""),[c,u]=a.useState(""),[l,h]=a.useState(""),[n,b]=a.useState(""),i=`<!-- Primary Meta Tags -->
<title>${s||"My Website"}</title>
<meta name="title" content="${s}">
<meta name="description" content="${r}">
<meta name="keywords" content="${o}">
<meta name="author" content="${c}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${l}">
<meta property="og:title" content="${s}">
<meta property="og:description" content="${r}">
<meta property="og:image" content="${n}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${l}">
<meta property="twitter:title" content="${s}">
<meta property="twitter:description" content="${r}">
<meta property="twitter:image" content="${n}">`,g=()=>{j(i),m("Meta tags copied!")};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4",children:[e.jsx("h3",{className:"font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider",children:"Configure Website Metadata"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Site Title"}),e.jsx("input",{type:"text",value:s,onChange:t=>d(t.target.value),placeholder:"Enter site title",className:"input-base text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Canonical URL"}),e.jsx("input",{type:"url",value:l,onChange:t=>h(t.target.value),placeholder:"Enter canonical URL (e.g. https://example.com)",className:"input-base text-sm"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Description (max 160 chars recommended)"}),e.jsx("textarea",{rows:2,value:r,onChange:t=>p(t.target.value),placeholder:"Enter site description (150-160 chars recommended)...",className:"input-base text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Keywords (comma-separated)"}),e.jsx("input",{type:"text",value:o,onChange:t=>x(t.target.value),placeholder:"Enter keywords (e.g. web, development, tools)",className:"input-base text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Author / Brand"}),e.jsx("input",{type:"text",value:c,onChange:t=>u(t.target.value),placeholder:"Enter author or company name",className:"input-base text-sm"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Social Share Banner Image URL"}),e.jsx("input",{type:"url",value:n,onChange:t=>b(t.target.value),placeholder:"Enter social image URL (e.g. https://example.com/banner.jpg)",className:"input-base text-sm"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase",children:"Generated HTML Meta Tags"}),e.jsxs("button",{onClick:g,className:"btn-secondary text-xs py-1",children:[e.jsx(v,{className:"w-3.5 h-3.5"})," Copy Code"]})]}),e.jsx("textarea",{rows:11,readOnly:!0,value:i,className:"input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"})]})]})};export{C as MetaTagGenerator};
