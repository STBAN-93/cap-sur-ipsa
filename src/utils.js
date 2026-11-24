/* Petits utilitaires partagés par la recherche, les fiches, les profils et le Copilote. */
export function $(id){return document.getElementById(id);}
export function norm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g," ");}
export function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
