"""Top-down floor plan of the gurukul archery ground: who stands where, which way they face, and the camera setups.
Every shot's views are derived from this plan (series bible §5d)."""
import subprocess
from pathlib import Path
HERE = Path(__file__).resolve().parent
INK = "#3A2418"
def T(x, y, t, s=26, c=INK, a="middle", w="normal"):
    return f'<text x="{x}" y="{y}" font-family="Arial" font-size="{s}" fill="{c}" text-anchor="{a}" font-weight="{w}">{t}</text>'
def person(x, y, face_deg, label, col, ly=50, lx=0):
    import math
    a = math.radians(face_deg); fx, fy = x + 34 * math.cos(a), y - 34 * math.sin(a)
    return (f'<circle cx="{x}" cy="{y}" r="22" fill="{col}" stroke="{INK}" stroke-width="3"/>'
            f'<path d="M{x},{y} L{fx:.0f},{fy:.0f}" stroke="{INK}" stroke-width="5" marker-end="url(#ah)"/>' + T(x + lx, y + ly, label, 22))
def cam(x, y, face_deg, label, col):
    import math
    a = math.radians(face_deg)
    p = [(x + 40 * math.cos(a + d), y - 40 * math.sin(a + d)) for d in (2.6, -2.6)]
    tip = (x + 70 * math.cos(a), y - 70 * math.sin(a))
    return (f'<path d="M{x},{y} L{p[0][0]:.0f},{p[0][1]:.0f} L{tip[0]:.0f},{tip[1]:.0f} L{p[1][0]:.0f},{p[1][1]:.0f}Z" fill="{col}" stroke="{INK}" stroke-width="3" opacity=".9"/>'
            + T(x + 60, y + 8, label, 24, a="start", w="bold"))
o = ['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1180" viewBox="0 0 1600 1180">',
     '<defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10Z" fill="#3A2418"/></marker></defs>',
     '<rect width="1600" height="1180" fill="#F7EEDC"/>',
     T(800, 50, "Floor plan: gurukul archery ground (top-down, north up)", 34, w="bold"),
     # ground zones
     '<rect x="80" y="90" width="1440" height="300" fill="#E8D7B0" opacity=".6"/>', T(800, 130, "NORTH backdrop seen by C1: open field, hills, far trees", 24),
     '<rect x="80" y="880" width="1440" height="200" fill="#D9B98C" opacity=".6"/>', T(800, 1060, "SOUTH backdrop seen by C2: ashram (huts, tulsi, well, mango tree, pots)", 24),
     # arrow axis
     '<path d="M560,520 L1330,520" stroke="#C0392B" stroke-width="4" stroke-dasharray="14 10" marker-end="url(#ah)"/>',
     T(950, 505, "arrow axis: ALWAYS screen-right in C1 (never crossed)", 22, c="#C0392B"),
     '<circle cx="1390" cy="520" r="46" fill="#4E9A5E" stroke="#3A2418" stroke-width="3"/>', T(1390, 600, "target tree (EAST)", 22),
     T(1390, 470, "wooden bird", 20),
     '<path d="M540,440 L540,610" stroke="#8A5530" stroke-width="6"/>', T(540, 640, "firing line", 20),
     person(560, 520, 270, "archer: chest faces C1, aims east", "#1F8A8A", ly=78, lx=90),
     person(440, 455, -20, "Drona: 3/4, faces archer", "#D9822B", ly=-36),
     person(250, 430, 0, "", "#E9A23B"), person(250, 500, 0, "", "#8E2B3A"), person(250, 570, 0, "waiting princes: 3/4 → east", "#3E7D4F"),
     person(470, 760, 90, "", "#E9A23B"), person(650, 770, 90, "watchers (BACK view in C1)", "#3E7D4F"),
     '<path d="M1560,250 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0" fill="#F7C46A"/>', T(1500, 300, "morning sun (EAST)", 20),
     cam(560, 960, 90, "C1 main stage: looks NORTH", "#FFD34D"),
     cam(380, 230, 270, "C2 reverse: looks SOUTH", "#9FC7D9"),
     cam(900, 700, 60, "SKY: tilt up / arrow follow", "#E8E0F0"),
     T(90, 1130, "Rules: archery is only shot from C1 (or SKY/POV, same screen direction). C2 never shows the firing line. Sun is right in C1, left in C2.", 22, a="start"),
     T(90, 1160, "Moves between setups: sky-tilt, wipe-by-figure, iris (POV), ripple/match dissolve ≤0.5 s. No cut inside a spoken phrase.", 22, a="start"),
     '</svg>']
out = HERE / "staging-plan.svg"; out.write_text("".join(o))
subprocess.run(["resvg", str(out), str(out.with_suffix(".png"))], check=True)
print(out.with_suffix(".png"))
