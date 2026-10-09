#!/bin/sh
# Pre-renders the static paper-grain texture once (cheaper than feTurbulence on every frame).
cat > /tmp/kks-grain.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/>
<feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .09 0"/></filter><rect width="1080" height="1920" filter="url(#p)"/></svg>
SVG
resvg /tmp/kks-grain.svg "$(dirname "$0")/../public/paper-grain.png"
