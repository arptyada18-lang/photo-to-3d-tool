# FORM — Photo-to-3D Studio
First version: photo reference preview, five render-style presets, lighting, output aspect ratio, identity-preservation instructions, optional direction, copy and text download.

## Scope
This is a prompt preparation tool, not an AI image generator. Uploads stay in browser memory; no image or prompt is sent to a server. Settings update a deterministic prompt. The reference preview remains unchanged. No 3D mesh/model export is provided.

## Use
Open index.html or host on GitHub Pages. Choose a reference photo, select options, then copy the prompt and attach the original photo in your preferred reference-image generation tool. That tool's own fees and limits apply.

## Publish
Settings → Pages → Deploy from a branch → main → /(root) → Save.
Do not describe the site as live until the Pages deployment succeeds.

## Limits
JPG/PNG/WebP only, at most 10 MB and 40 million pixels. No permanent photo storage. Clipboard access can depend on browser permissions; manual selection is the fallback. No API keys are requested or stored.

## Future generation integration
A real image-generation service and a secure backend would be a separate phase. Never embed secret API keys in this public repository.

## Validation
JavaScript syntax and prompt-generation settings tested before commit. Browser visual and file-picker checks remain pending.
