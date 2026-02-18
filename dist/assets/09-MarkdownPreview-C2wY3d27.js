import{d as i,c as p,a as c,o as g,b as t,e as d,v as u,r as m,k as $}from"./index-vwVkrOVq.js";import{_ as h}from"./ProjectLayout.vue_vue_type_script_setup_true_lang-CPkUVTzG.js";const k={class:"md-editor"},v={class:"col"},f={class:"col"},w=["innerHTML"],M=i({__name:"09-MarkdownPreview",setup(_){const a=m(`# Welcome to Markdown Preview

This is a **live preview** of your Markdown. Try editing the left panel!

## Features

- **Bold text** and *italic text*
- Inline \`code\` snippets
- Blockquotes
- [Hyperlinks](https://vuejs.org)

### Code Block

\`\`\`
const greeting = 'Hello, Vue 3!'
console.log(greeting)
\`\`\`

> Markdown is a lightweight markup language with plain text formatting syntax.

---

Start typing to see changes in real time.
`);function s(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const n=$(()=>{let e=a.value;const l=[];return e=e.replace(/```[\s\S]*?```/g,r=>(l.push(`<pre><code>${s(r.slice(3,-3).replace(/^\n/,""))}</code></pre>`),`\0BLOCK${l.length-1}\0`)),e=e.replace(/`([^`]+)`/g,(r,o)=>`<code>${s(o)}</code>`),e=e.replace(/^###### (.+)$/gm,"<h6>$1</h6>"),e=e.replace(/^##### (.+)$/gm,"<h5>$1</h5>"),e=e.replace(/^#### (.+)$/gm,"<h4>$1</h4>"),e=e.replace(/^### (.+)$/gm,"<h3>$1</h3>"),e=e.replace(/^## (.+)$/gm,"<h2>$1</h2>"),e=e.replace(/^# (.+)$/gm,"<h1>$1</h1>"),e=e.replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>"),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\*(.+?)\*/g,"<em>$1</em>"),e=e.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>'),e=e.replace(/^> (.+)$/gm,"<blockquote>$1</blockquote>"),e=e.replace(/^[-*] (.+)$/gm,"<li>$1</li>"),e=e.replace(/(<li>.*<\/li>)/s,"<ul>$1</ul>"),e=e.replace(/^\d+\. (.+)$/gm,"<li>$1</li>"),e=e.replace(/^---$/gm,"<hr/>"),e=e.replace(/\n\n+/g,"</p><p>"),e="<p>"+e+"</p>",e=e.replace(/<p><(h[1-6]|ul|ol|li|pre|blockquote|hr)/g,"<$1"),e=e.replace(/<\/(h[1-6]|ul|ol|li|pre|blockquote|hr)><\/p>/g,"</$1>"),e=e.replace(/\x00BLOCK(\d+)\x00/g,(r,o)=>l[parseInt(o)]),e});return(e,l)=>(g(),p(h,{title:"Markdown Preview"},{default:c(()=>[t("div",k,[t("div",v,[l[1]||(l[1]=t("label",{class:"label"},"Markdown Input",-1)),d(t("textarea",{"onUpdate:modelValue":l[0]||(l[0]=r=>a.value=r),class:"input",style:{"min-height":"320px","font-family":"monospace","font-size":"0.9rem"}},null,512),[[u,a.value]])]),t("div",f,[l[2]||(l[2]=t("label",{class:"label"},"Rendered Preview",-1)),t("div",{class:"md-preview",innerHTML:n.value},null,8,w)])]),l[3]||(l[3]=t("p",{style:{color:"var(--text2)","font-size":"0.8rem","margin-top":"12px"}}," Supports: # headings, **bold**, *italic*, `code`, ```blocks```, >blockquote, - lists, [links](url), --- ",-1))]),_:1}))}});export{M as default};
