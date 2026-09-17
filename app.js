"use strict";
const $ = id => document.getElementById(id);
const styles = {
 clay: "Soft clay sculpture with rounded forms, matte tactile surfaces, subtle handmade texture and gentle ambient occlusion.",
 toon: "Polished 3D animated-film aesthetic with expressive shapes, clean materials and rich but controlled colors.",
 product: "Premium 3D product visualization with precise geometry, realistic material response and a clean studio backdrop.",
 isometric: "Detailed isometric miniature diorama, carefully arranged depth layers and a coherent miniature environment.",
 metal: "Sculptural brushed-metal treatment with convincing reflections and carefully shaped highlights."
};
function makePrompt(style, light, ratio, identity, notes) {
 return [
  "Use the attached reference photo to create a new 3D-style 2D artwork.",
  "STYLE: " + styles[style],
  "LIGHTING: " + light + ".",
  "COMPOSITION: " + ratio + ". Keep the main subject fully readable and adapt the background to the requested aspect ratio.",
  identity ? "PRESERVATION: If a person is present, preserve their recognizable facial identity, apparent age, skin tone, expression and facial proportions. Do not beautify or reshape the face. Keep hands anatomically accurate. For objects, preserve recognizable shape, colors and identifying details." : "PRESERVATION: Retain the reference subject's key recognizable details while translating its appearance into the selected art style.",
  "QUALITY: Coherent lighting, convincing depth, clean edges and consistent materials. Avoid extra fingers, distorted features, duplicate subjects and unwanted text or watermarks.",
  notes.trim() ? "ADDITIONAL DIRECTION: " + notes.trim() : "",
  "Deliver a finished image, not a 3D model."
 ].filter(Boolean).join("\n\n");
}
function updatePrompt() {
 $("prompt").value = makePrompt($("style").value,$("light").value,$("ratio").value,$("identity").checked,$("notes").value);
 $("styleName").textContent = $("style").selectedOptions[0].textContent;
 $("ratioName").textContent = $("ratio").value;
 $("copyStatus").textContent = "";
}
["style","light","ratio","identity","notes"].forEach(id => $(id).addEventListener("input",updatePrompt));
let currentUrl = null;
let revision = 0;
function clearPhoto() {
 revision++;
 $("reference").removeAttribute("src");
 $("reference").hidden = true;
 $("empty").hidden = false;
 if(currentUrl) URL.revokeObjectURL(currentUrl);
 currentUrl = null;
 $("photo").value = "";
 $("clear").disabled = true;
 $("fileStatus").textContent = "No photo selected.";
}
$("clear").addEventListener("click",clearPhoto);
$("photo").addEventListener("change",async () => {
 const file = $("photo").files[0];
 if(!file) return;
 const token = ++revision;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 10*1024*1024) {
  $("fileStatus").textContent = "Choose a JPG, PNG or WebP up to 10 MB. Any previous preview is unchanged.";
  $("photo").value = "";
  return;
 }
 $("fileStatus").textContent = "Loading photo…";
 const url = URL.createObjectURL(file);
 const probe = new Image();
 probe.src = url;
 try {
  await probe.decode();
  if(token !== revision){URL.revokeObjectURL(url);return;}
  if(probe.naturalWidth*probe.naturalHeight > 40000000) throw new Error("Too large");
  if(currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = url;
  $("reference").src = url;
  $("reference").hidden = false;
  $("empty").hidden = true;
  $("clear").disabled = false;
  $("fileStatus").textContent = file.name + " · " + probe.naturalWidth + " × " + probe.naturalHeight;
 } catch(error) {
  URL.revokeObjectURL(url);
  if(token !== revision) return;
  $("photo").value = "";
  $("fileStatus").textContent = "Could not open this image. Try a smaller JPG, PNG or WebP. Any previous preview is unchanged.";
 }
});
$("copy").addEventListener("click",async () => {
 try {await navigator.clipboard.writeText($("prompt").value);$("copyStatus").textContent = "Prompt copied. Attach your photo in your image tool.";}
 catch(error){$("prompt").focus();$("prompt").select();$("copyStatus").textContent = "Copy unavailable here. Select and copy the prompt manually.";}
});
$("download").addEventListener("click",() => {
 const blob = new Blob([$("prompt").value],{type:"text/plain;charset=utf-8"});
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.href = url; link.download = "photo-to-3d-prompt.txt";
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
});
updatePrompt();
