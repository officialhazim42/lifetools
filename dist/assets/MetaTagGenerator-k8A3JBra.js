import{c as y,j as e,h as v}from"./index-BHqmycII.js";import{a,h as j}from"./lucide-CnYeBL73.js";import"./vendor-aacu-Mpa.js";const C=()=>{const{showToast:m}=y(),[s,p]=a.useState("LifeTools — Complete Digital Utility Platform"),[r,d]=a.useState("Free, privacy-first everyday digital utilities. Calculators, converters, developer tools, and image manipulation."),[n,x]=a.useState("utilities, calculators, converters, developer tools, free tools"),[i,u]=a.useState("officialhazim42"),[l,b]=a.useState("https://lifetools.app"),[o,g]=a.useState("https://lifetools.app/og-image.png"),c=`<!-- Primary Meta Tags -->
<title>${s}</title>
<meta name="title" content="${s}">
<meta name="description" content="${r}">
<meta name="keywords" content="${n}">
<meta name="author" content="${i}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${l}">
<meta property="og:title" content="${s}">
<meta property="og:description" content="${r}">
<meta property="og:image" content="${o}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${l}">
<meta property="twitter:title" content="${s}">
<meta property="twitter:description" content="${r}">
<meta property="twitter:image" content="${o}">`,h=()=>{v(c),m("Meta tags copied!")};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4",children:[e.jsx("h3",{className:"font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider",children:"Configure Website Metadata"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Site Title"}),e.jsx("input",{type:"text",value:s,onChange:t=>p(t.target.value),className:"input-base text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Canonical URL"}),e.jsx("input",{type:"url",value:l,onChange:t=>b(t.target.value),className:"input-base text-sm"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Description (max 160 chars recommended)"}),e.jsx("textarea",{rows:2,value:r,onChange:t=>d(t.target.value),className:"input-base text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Keywords (comma-separated)"}),e.jsx("input",{type:"text",value:n,onChange:t=>x(t.target.value),className:"input-base text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Author / Brand"}),e.jsx("input",{type:"text",value:i,onChange:t=>u(t.target.value),className:"input-base text-sm"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1",children:"Social Share Banner Image URL"}),e.jsx("input",{type:"url",value:o,onChange:t=>g(t.target.value),className:"input-base text-sm"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase",children:"Generated HTML Meta Tags"}),e.jsxs("button",{onClick:h,className:"btn-secondary text-xs py-1",children:[e.jsx(j,{className:"w-3.5 h-3.5"})," Copy Code"]})]}),e.jsx("textarea",{rows:11,readOnly:!0,value:c,className:"input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"})]})]})};export{C as MetaTagGenerator};
