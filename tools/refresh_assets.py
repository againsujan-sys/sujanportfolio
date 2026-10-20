#!/usr/bin/env python3
"""refresh_assets.py — pre-deployment asset & markup validator.

1. Re-validates every image/media path referenced in index.html, js/data.js
   and src_App_diff.tsx against the repository working tree (hyphenated-name
   migration guard).
2. Confirms no referenced media asset is missing on disk.
3. Runs a structural HTML validation pass on index.html (balanced tags,
   unique ids, heading order, anchor targets, alt attributes, secure
   target=_blank links) before live deployment.

Exit code 0 = safe to deploy; non-zero = failures listed above.
"""
import re, sys, os, json
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)

VOID = {"area","base","br","col","embed","hr","img","input","link","meta",
        "param","source","track","wbr"}
errors, warnings, notes = [], [], []

html = Path("index.html").read_text(encoding="utf-8")

# ---------- 1 & 2: media path re-validation ----------
LOCAL_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf",
             ".geojson", ".mp4", ".mp3", ".wav")

def check_ref(path_str, origin):
    p = path_str.split("?")[0].split("#")[0]
    if p.startswith(("http://", "https://", "data:", "mailto:", "tel:", "//")):
        return
    if not (p.startswith("image/") or p.endswith(LOCAL_EXT)):
        return
    if p == "cv-sujan-paudyal.pdf":
        # canonical CV filename — mandated by the published CV, exempt from
        # the hyphenated-name migration rule (applies to image/ photos).
        pass
    elif re.search(r"[\s_]", Path(p).name):
        errors.append(f"[non-hyphenated filename] {p} referenced in {origin}")
        return
    if not Path(p).is_file():
        errors.append(f"[missing asset] {p} referenced in {origin}")

refs = set()
for m in re.finditer(r'(?:src|href|data-photo)\s*=\s*"([^"]+)"', html):
    refs.add((m.group(1), "index.html"))
for fname in ("js/data.js", "js/main.js", "src_App_diff.tsx"):
    f = Path(fname)
    if not f.is_file():
        continue
    t = f.read_text(encoding="utf-8")
    for m in re.finditer(r"'([^']*\.(?:jpg|jpeg|png|gif|webp|pdf|geojson|svg))'", t):
        refs.add((m.group(1), fname))
for p, origin in sorted(refs):
    check_ref(p.replace("\\u2019", "\u2019"), origin)

# every file inside image/ that is referenced somewhere (orphan report only)
referenced = {p.split("?")[0] for p, _ in refs}
for disk in sorted(Path("image").glob("*")):
    rel = disk.as_posix()
    if disk.is_file() and rel not in referenced:
        warnings.append(f"[orphan asset] {rel} exists but is not referenced")

# ---------- 3: structural HTML validation ----------
class Validator(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.ids, self.bad_blank, self.imgs_no_alt = [], set(), [], []
        self.headings, self.imgs = [], []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "img":
            self.imgs.append(a)
            if a.get("id") == "lightbox-img":
                pass  # runtime placeholder: src/alt are set by js/main.js on open
            elif not a.get("alt"):
                self.imgs_no_alt.append(a.get("src", "?"))
            if not a.get("loading") and a.get("id") != "lightbox-img":
                warnings.append(f"[lazy] <img> without loading attribute: {a.get('src','?')}")
        if tag == "h1" or tag.startswith("h") and len(tag) == 2 and tag[1].isdigit():
            self.headings.append(int(tag[1]))
        if "id" in a:
            if a["id"] in self.ids:
                errors.append(f"[duplicate id] #{a['id']}")
            self.ids.add(a["id"])
        if a.get("target") == "_blank":
            rel = (a.get("rel") or "").lower().split()
            if "noopener" not in rel or "noreferrer" not in rel:
                self.bad_blank.append(a.get("href", "?"))
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            errors.append(f"[stray close] </{tag}> at {self.getpos()}")
            return
        open_tag, pos = self.stack.pop()
        if open_tag != tag:
            errors.append(f"[mismatch] <{open_tag}> opened at {pos} closed by </{tag}> at {self.getpos()}")

v = Validator()
v.feed(html)
v.close()
if v.stack:
    for t, pos in v.stack:
        errors.append(f"[unclosed] <{t}> opened at {pos}")
for href in v.bad_blank:
    errors.append(f"[insecure _blank] target=_blank without noopener noreferrer: {href}")
for src in v.imgs_no_alt:
    errors.append(f"[no alt] <img {src}>")

h1 = [h for h in v.headings if h == 1]
if len(h1) != 1:
    errors.append(f"[headings] expected exactly one <h1>, found {len(h1)}")
prev = 1
for lvl in v.headings:
    if lvl > prev + 1:
        errors.append(f"[headings] level jump h{prev}->h{lvl}")
    prev = lvl

# internal anchors resolve
for frag in re.findall(r'href="#([^"]+)"', html):
    if frag and frag not in v.ids:
        errors.append(f"[broken anchor] #{frag} has no matching id")

# aria-labelledby / aria-controls targets exist
for attr in ("aria-labelledby", "aria-controls"):
    for val in re.findall(attr + r'="([^"]+)"', html):
        for tok in val.split():
            if tok not in v.ids:
                errors.append(f"[aria] {attr}='{val}' references missing #{tok}")

# new required hooks present
for needle in ("header-contact__link", "header-contact__icon", "header-contact__label",
               "hero-contact-line", "footer-contact__icon", "footer-publication",
               "footer-pdf-link", "core-pdf-link"):
    if needle not in html:
        errors.append(f"[markup] expected class .{needle} missing from index.html")
css = Path("css/strata.css").read_text(encoding="utf-8")
for needle in (".header-contact__link", ".header-contact__icon", ".header-contact__label",
               ".hero-contact-line", ".footer-contact__icon", ".footer-publication",
               ".footer-pdf-link", ".core-pdf-link", "z-index"):
    if needle not in css:
        errors.append(f"[css] rule {needle} missing from css/strata.css")
js = Path("js/main.js").read_text(encoding="utf-8")
if ".core-pdf-link" not in js or "stopPropagation" not in js:
    errors.append("[js] accordion PDF-click guard missing in js/main.js")

# JS data sanity: milestones + RPGCL wording synced into js/data.js
data_txt = Path("js/data.js").read_text(encoding="utf-8")
for phrase in ("milestones", "Test-pit logging", "Footing inspection sign-offs", "Elevation checks"):
    if phrase not in data_txt:
        errors.append(f"[data] '{phrase}' not synchronised into js/data.js")

# ---------- report ----------
print("== refresh_assets.py — pre-deployment validation ==")
print(f"references checked : {len(refs)}")
print(f"images on disk     : {len(list(Path('image').glob('*')))}")
print(f"parse events       : headings={len(v.headings)} ids={len(v.ids)}")
for w in warnings:
    print("WARN :", w)
if errors:
    for e in errors:
        print("FAIL :", e)
    print(f"\nRESULT: {len(errors)} failure(s) — DO NOT deploy.")
    sys.exit(1)
print("\nRESULT: all image paths valid, no missing media assets, HTML structure OK — ready for deployment.")
