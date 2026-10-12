#!/usr/bin/env python3
"""Render a video production plan (JSON) into a self-contained HTML director's board.

Usage:
    python build_board.py plan.json [-o director-board.html]

The plan format is documented in references/plan-schema.md. Only "title" and
"shots" are required; every other section is skipped when missing. The script
prints warnings for gaps a director would want filled (a risky shot with no
fallback, a shot with no method), but still writes the board.

Storyboard frames are drawn as simple SVG diagrams from each shot's "frame"
spec, so the board needs no image generation and works offline.
"""
import argparse
import html
import json
import re
import sys
import textwrap
from pathlib import Path

ASPECTS = {
    "16:9": (320, 180), "9:16": (180, 320), "1:1": (240, 240),
    "4:5": (240, 300), "4:3": (280, 210), "21:9": (336, 144), "2.39:1": (344, 144),
}
FEAS = {
    "green": ("Ready", "Doable with what you have"),
    "amber": ("Needs care", "Doable, but has a known risk"),
    "red": ("Risky", "May not work; fallback planned"),
}
WARNINGS = []


def warn(msg):
    WARNINGS.append(msg)


def esc(v):
    return html.escape("" if v is None else str(v), quote=True)


def num(v, nd=1):
    """Compact number for SVG attributes."""
    return f"{v:.{nd}f}".rstrip("0").rstrip(".")


def parse_secs(v):
    """'1:05' -> 65.0, 12 -> 12.0, '12s' -> 12.0, None/garbage -> None."""
    if v is None or v == "":
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().lower().rstrip("s").strip()
    try:
        if ":" in s:
            total = 0.0
            for part in s.split(":"):
                total = total * 60 + float(part)
            return total
        return float(s)
    except ValueError:
        return None


def fmt_time(secs):
    m, s = divmod(int(round(secs)), 60)
    return f"{m}:{s:02d}"


def as_list(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


# --------------------------------------------------------------------------
# Money: numbers, "10-20" ranges, or free text ("varies") all accepted.
# --------------------------------------------------------------------------

def parse_money(v):
    """Return (low, high) or None when the value is not numeric."""
    if v is None or v == "":
        return None
    if isinstance(v, (int, float)):
        return (float(v), float(v))
    s = str(v).replace(",", "")
    if s.strip().lower() in ("free", "0", "none", "own", "owned"):
        return (0.0, 0.0)
    nums = re.findall(r"\d+(?:\.\d+)?", s)
    if not nums:
        return None
    lo = float(nums[0])
    hi = float(nums[1]) if len(nums) > 1 and re.search(r"\d\s*(-|–|to)\s*\D?\d", s) else lo
    return (lo, hi)


def money(v, cur):
    if isinstance(v, str) and parse_money(v) is None:
        return esc(v)
    rng = parse_money(v)
    if rng is None:
        return ""
    lo, hi = rng

    def one(n):
        if n == 0:
            return "Free"
        return f"{cur}{n:,.2f}" if n % 1 else f"{cur}{n:,.0f}"

    if lo == hi:
        return one(lo)
    return f"{one(lo)}–{one(hi)}"


# --------------------------------------------------------------------------
# Storyboard frame renderer. Coordinates in the plan are normalized 0..1.
# --------------------------------------------------------------------------

class Frame:
    def __init__(self, aspect):
        self.W, self.H = ASPECTS.get(aspect, ASPECTS["16:9"])
        self.U = min(self.W, self.H)  # unit for text sizes, so 9:16 text isn't oversized
        self.out = []

    def add(self, s):
        self.out.append(s)

    def rect(self, x, y, w, h, cls, rx=0, extra=""):
        self.add(f'<rect x="{num(x)}" y="{num(y)}" width="{num(max(w, 0))}" height="{num(max(h, 0))}" '
                 f'rx="{num(rx)}" class="{cls}"{extra}/>')

    def circle(self, cx, cy, r, cls):
        self.add(f'<circle cx="{num(cx)}" cy="{num(cy)}" r="{num(r)}" class="{cls}"/>')

    def line(self, x1, y1, x2, y2, cls):
        self.add(f'<line x1="{num(x1)}" y1="{num(y1)}" x2="{num(x2)}" y2="{num(y2)}" class="{cls}"/>')

    def path(self, d, cls):
        self.add(f'<path d="{d}" class="{cls}"/>')

    def text(self, x, y, s, cls, size, anchor="start", weight=None):
        w = f' font-weight="{weight}"' if weight else ""
        self.add(f'<text x="{num(x)}" y="{num(y)}" font-size="{num(size)}" text-anchor="{anchor}" '
                 f'class="{cls}"{w}>{esc(s)}</text>')

    def arrow(self, x1, y1, x2, y2, cls="f-move", head=None):
        """Line with a drawn arrowhead (no <marker>, so it themes cleanly)."""
        import math
        head = head or max(self.W, self.H) * 0.03
        self.line(x1, y1, x2, y2, cls)
        ang = math.atan2(y2 - y1, x2 - x1)
        p1 = (x2 - head * math.cos(ang - 0.45), y2 - head * math.sin(ang - 0.45))
        p2 = (x2 - head * math.cos(ang + 0.45), y2 - head * math.sin(ang + 0.45))
        self.add(f'<polygon points="{num(x2)},{num(y2)} {num(p1[0])},{num(p1[1])} {num(p2[0])},{num(p2[1])}" '
                 f'class="{cls}-head"/>')

    def wrapped(self, x, y, w, s, cls, size, anchor="start", weight=None, max_lines=4):
        chars = max(4, int(w / (size * 0.56)))
        lines = textwrap.wrap(str(s), chars)[:max_lines] or [""]
        for i, ln in enumerate(lines):
            self.text(x, y + i * size * 1.18, ln, cls, size, anchor, weight)
        return len(lines) * size * 1.18


def draw_background(f, bg):
    W, H = f.W, f.H
    bg = (bg or "plain").lower()
    if bg == "dark":
        f.rect(0, 0, W, H, "f-dark")
    elif bg == "room":
        f.rect(0, H * 0.7, W, H * 0.3, "f-bg2")
        f.line(0, H * 0.7, W, H * 0.7, "f-line-soft")
    elif bg in ("outdoor", "nature", "landscape"):
        f.rect(0, H * 0.62, W, H * 0.38, "f-bg2")
        f.line(0, H * 0.62, W, H * 0.62, "f-line-soft")
    elif bg in ("city", "skyline"):
        f.rect(0, H * 0.7, W, H * 0.3, "f-bg2")
        heights = [0.22, 0.34, 0.18, 0.42, 0.28, 0.5, 0.24, 0.36, 0.2, 0.3]
        bw = W / len(heights)
        for i, hgt in enumerate(heights):
            f.rect(i * bw + 1, H * (0.7 - hgt), bw - 2, H * hgt, "f-bldg")
        f.line(0, H * 0.7, W, H * 0.7, "f-line-soft")
    elif bg == "desk":
        f.rect(0, H * 0.78, W, H * 0.22, "f-bg2")
        f.line(0, H * 0.78, W, H * 0.78, "f-line")
    elif bg in ("studio", "cyc"):
        f.path(f"M0 {num(H * 0.72)} Q{num(W / 2)} {num(H * 0.66)} {num(W)} {num(H * 0.72)} L{num(W)} {num(H)} L0 {num(H)} Z", "f-bg2")
    elif bg in ("grid", "motion", "mg"):
        f.rect(0, 0, W, H, "f-dark")
        step = W / 12
        x = step
        while x < W:
            f.line(x, 0, x, H, "f-gridline")
            x += step
        y = step
        while y < H:
            f.line(0, y, W, y, "f-gridline")
            y += step


def draw_person(f, el):
    W, H = f.W, f.H
    size = str(el.get("size", "mcu")).lower()
    cx = float(el.get("x", 0.5)) * W
    fig = "f-fig-hi" if el.get("highlight") else "f-fig"
    facing = str(el.get("facing", "front")).lower()
    full = {"ews": (0.2, 0.74), "ls": (0.2, 0.74), "ws": (0.55, 0.9), "fs": (0.86, 0.96), "full": (0.86, 0.96)}
    if size in full:
        total, feet = full[size]
        total *= H
        feet = float(el.get("y", feet)) * H
        r = total / 8.5
        top = feet - total
        hy = top + r
        t = top + 2.25 * r
        f.rect(cx - 1.6 * r, t + 0.2 * r, 0.45 * r, 2.6 * r, fig, 0.22 * r)
        f.rect(cx + 1.15 * r, t + 0.2 * r, 0.45 * r, 2.6 * r, fig, 0.22 * r)
        f.rect(cx - 1.1 * r, t, 2.2 * r, 3.0 * r, fig, 0.6 * r)
        leg_top = t + 2.7 * r
        f.rect(cx - 0.95 * r, leg_top, 0.8 * r, feet - leg_top, fig, 0.3 * r)
        f.rect(cx + 0.15 * r, leg_top, 0.8 * r, feet - leg_top, fig, 0.3 * r)
        f.circle(cx, hy, r, fig)
        label_y = top - 3
    else:
        rk, hk = {"ms": (0.11, 0.4), "mcu": (0.15, 0.44), "cu": (0.23, 0.52), "ecu": (0.45, 0.5)}.get(size, (0.15, 0.44))
        r = rk * H
        hy = float(el.get("y", hk)) * H
        f.rect(cx - 0.38 * r, hy + 0.6 * r, 0.76 * r, 0.9 * r, fig)
        f.rect(cx - 1.9 * r, hy + 1.25 * r, 3.8 * r, H - hy, fig, 0.9 * r)
        f.circle(cx, hy, r, fig)
        label_y = hy - r - 3
    if facing != "away" and r > H * 0.04:
        shift = {"left": -0.32, "right": 0.32}.get(facing, 0) * r
        for dx in (-0.34, 0.34):
            f.circle(cx + shift + dx * r, hy - 0.08 * r, max(0.7, 0.09 * r), "f-eye")
    if el.get("label"):
        fs = f.U * 0.055
        f.text(cx, max(label_y, fs + 1), el["label"], "f-label", fs, "middle")


def draw_shoulder(f, el):
    """Foreground over-the-shoulder silhouette at a bottom corner."""
    W, H = f.W, f.H
    left = str(el.get("side", "left")).lower() == "left"
    cx = W * (0.1 if left else 0.9)
    r = H * 0.26
    f.rect(cx - 1.8 * r, H * 0.78, 3.6 * r, H, "f-fg", 0.9 * r)
    f.circle(cx, H * 0.6, r, "f-fg")


def draw_device(f, el, kind):
    W, H = f.W, f.H
    dflt = {"screen": (0.28, 0.16, 0.44, 0.5), "monitor": (0.28, 0.16, 0.44, 0.5),
            "laptop": (0.3, 0.2, 0.4, 0.42), "phone": (0.42, 0.12, 0.16, 0.74)}[kind]
    x = float(el.get("x", dflt[0])) * W
    y = float(el.get("y", dflt[1])) * H
    w = float(el.get("w", dflt[2])) * W
    h = float(el.get("h", dflt[3])) * H
    rx = min(w, h) * (0.14 if kind == "phone" else 0.04)
    f.rect(x, y, w, h, "f-device", rx)
    pad = min(w, h) * (0.08 if kind == "phone" else 0.06)
    ix, iy, iw, ih = x + pad, y + pad, w - 2 * pad, h - 2 * pad
    f.rect(ix, iy, iw, ih, "f-screen", rx * 0.5)
    content = str(el.get("content", "ui")).lower()
    if content == "code":
        lens = [0.7, 0.45, 0.85, 0.3, 0.6, 0.75, 0.4, 0.55]
        lh = ih / (len(lens) + 1)
        for i, L in enumerate(lens):
            indent = 0.1 if i % 3 else 0
            f.line(ix + iw * (0.06 + indent), iy + lh * (i + 1), ix + iw * (0.06 + indent + L * 0.8), iy + lh * (i + 1), "f-code")
    elif content == "chart":
        vals = [0.35, 0.55, 0.45, 0.75, 0.9]
        bw = iw / (len(vals) * 1.6)
        for i, v in enumerate(vals):
            f.rect(ix + bw * 0.6 + i * bw * 1.6, iy + ih * (0.92 - v * 0.8), bw, ih * v * 0.8, "f-accent-fill")
    elif content == "video":
        cx, cy, s = ix + iw / 2, iy + ih / 2, min(iw, ih) * 0.18
        f.add(f'<polygon points="{num(cx - s * 0.6)},{num(cy - s)} {num(cx - s * 0.6)},{num(cy + s)} {num(cx + s)},{num(cy)}" class="f-accent-fill"/>')
    elif content == "face":
        r = min(iw, ih) * 0.2
        f.circle(ix + iw / 2, iy + ih * 0.42, r, "f-fig")
        f.rect(ix + iw / 2 - r * 1.6, iy + ih * 0.42 + r * 1.1, r * 3.2, ih, "f-fig", r * 0.8)
    else:  # ui
        f.rect(ix, iy, iw, ih * 0.12, "f-bg2")
        cw = (iw - pad * 3) / 2
        for i in range(2):
            f.rect(ix + pad + i * (cw + pad), iy + ih * 0.22, cw, ih * 0.32, "f-card", 2)
        f.rect(ix + pad, iy + ih * 0.62, iw - 2 * pad, ih * 0.26, "f-card", 2)
    if kind in ("screen", "monitor") and el.get("stand", True):
        f.rect(x + w * 0.44, y + h, w * 0.12, h * 0.12, "f-device")
        f.rect(x + w * 0.32, y + h * 1.12, w * 0.36, h * 0.04, "f-device")
    if kind == "laptop":
        f.path(f"M{num(x - w * 0.08)} {num(y + h + h * 0.1)} L{num(x)} {num(y + h)} L{num(x + w)} {num(y + h)} "
               f"L{num(x + w * 1.08)} {num(y + h + h * 0.1)} Z", "f-device")
    if el.get("label"):
        f.text(x + w / 2, y + h + H * 0.09 + (h * 0.16 if kind in ("screen", "monitor") else 0),
               el["label"], "f-label", f.U * 0.055, "middle")


def draw_text(f, el):
    W, H = f.W, f.H
    style = str(el.get("style", "body")).lower()
    s = el.get("text", "")
    cls = "f-text-hi" if el.get("accent") else "f-text"
    if style == "lower-third":
        x, y = float(el.get("x", 0.05)) * W, float(el.get("y", 0.74)) * H
        w = float(el.get("w", 0.5)) * W
        f.rect(x, y, w, H * 0.12, "f-l3", 2)
        f.rect(x, y, W * 0.012, H * 0.12, "f-accent-fill")
        f.text(x + W * 0.03, y + H * 0.085, s, "f-boxtext", f.U * 0.06, weight=600)
        return
    if style == "caption":
        size = f.U * 0.06
        w = float(el.get("w", 0.8)) * W
        x = float(el.get("x", 0.5)) * W
        y = float(el.get("y", 0.84)) * H
        lines = textwrap.wrap(str(s), max(4, int(w / (size * 0.56))))[:2] or [""]
        bw = min(w, max(len(L) for L in lines) * size * 0.56 + size)
        f.rect(x - bw / 2, y - size * 1.05, bw, size * (len(lines) * 1.18 + 0.5), "f-cap", 3)
        f.wrapped(x, y, w, s, cls, size, "middle", 600, 2)
        return
    size = {"title": 0.11, "headline": 0.11, "big": 0.2, "number": 0.2, "body": 0.065, "label": 0.05}.get(style, 0.065) * f.U
    weight = 700 if style in ("title", "headline", "big", "number") else None
    x = float(el.get("x", 0.08)) * W
    y = float(el.get("y", 0.25)) * H + size
    w = float(el.get("w", 0.5)) * W
    anchor = el.get("align", "start")
    anchor = {"left": "start", "center": "middle", "right": "end"}.get(anchor, anchor)
    if el.get("box"):
        lines = textwrap.wrap(str(s), max(4, int(w / (size * 0.56))))[:4] or [""]
        bx = x - (w / 2 if anchor == "middle" else w if anchor == "end" else 0)
        bx = max(size * 0.3 + 1, min(bx, W - w - size * 0.3 - 1))
        x = bx + (w / 2 if anchor == "middle" else w if anchor == "end" else 0)
        f.rect(bx - size * 0.3, y - size * 1.05, w + size * 0.6, len(lines) * size * 1.18 + size * 0.5, "f-card", 3)
        cls = "f-boxtext-hi" if el.get("accent") else "f-boxtext"
    f.wrapped(x, y, w, s, cls, size, anchor, weight)


def draw_object(f, el):
    W, H = f.W, f.H
    shape = str(el.get("shape", "box")).lower()
    x = float(el.get("x", 0.5)) * W
    y = float(el.get("y", 0.75)) * H  # y = base (where the object sits)
    s = float(el.get("s", 0.3)) * H   # height of the object
    hi = "f-accent-fill" if el.get("accent") else "f-obj"
    if shape == "building":
        w = s * 0.55
        f.rect(x - w / 2, y - s, w, s, hi)
        for r in range(int(s / (H * 0.06))):
            for c in range(3):
                f.rect(x - w / 2 + w * (0.12 + c * 0.3), y - s + H * 0.03 + r * H * 0.06, w * 0.16, H * 0.03, "f-window")
    elif shape == "tree":
        f.rect(x - s * 0.05, y - s * 0.4, s * 0.1, s * 0.4, "f-obj")
        f.circle(x, y - s * 0.65, s * 0.32, hi)
    elif shape == "mountain":
        f.add(f'<polygon points="{num(x - s)},{num(y)} {num(x)},{num(y - s)} {num(x + s)},{num(y)}" class="{hi}"/>')
    elif shape == "sun":
        f.circle(x, y - s / 2, s / 2, "f-accent-fill")
    elif shape == "cloud":
        for dx, dy, r in ((-0.3, 0, 0.22), (0, -0.12, 0.3), (0.3, 0, 0.22)):
            f.circle(x + dx * s, y - s * 0.3 + dy * s, r * s, "f-cloud")
    elif shape == "candle":
        w = s * 0.4
        f.rect(x - w / 2, y - s * 0.75, w, s * 0.75, hi, w * 0.12)
        f.line(x, y - s * 0.75, x, y - s * 0.82, "f-line")
        f.path(f"M{num(x)} {num(y - s)} Q{num(x + s * 0.09)} {num(y - s * 0.88)} {num(x)} {num(y - s * 0.82)} "
               f"Q{num(x - s * 0.09)} {num(y - s * 0.88)} {num(x)} {num(y - s)} Z", "f-accent-fill")
    elif shape == "bottle":
        w = s * 0.32
        f.rect(x - w / 2, y - s * 0.7, w, s * 0.7, hi, w * 0.2)
        f.rect(x - w * 0.18, y - s, w * 0.36, s * 0.32, hi, 1)
    elif shape == "mug":
        w = s * 0.7
        f.rect(x - w / 2, y - s, w, s, hi, w * 0.08)
        f.add(f'<circle cx="{num(x + w / 2)}" cy="{num(y - s / 2)}" r="{num(s * 0.22)}" class="f-handle"/>')
    elif shape == "plant":
        f.rect(x - s * 0.18, y - s * 0.35, s * 0.36, s * 0.35, "f-obj", 2)
        for dx in (-0.2, 0, 0.2):
            f.add(f'<ellipse cx="{num(x + dx * s)}" cy="{num(y - s * 0.62)}" rx="{num(s * 0.1)}" ry="{num(s * 0.28)}" class="f-accent-fill"/>')
    elif shape == "car":
        f.rect(x - s, y - s * 0.55, s * 2, s * 0.4, hi, s * 0.1)
        f.rect(x - s * 0.55, y - s * 0.85, s * 1.1, s * 0.35, hi, s * 0.12)
        f.circle(x - s * 0.55, y - s * 0.15, s * 0.16, "f-fg")
        f.circle(x + s * 0.55, y - s * 0.15, s * 0.16, "f-fg")
    elif shape == "desk":
        w = float(el.get("w", 0.7)) * W
        f.rect(x - w / 2, y - s * 0.08, w, s * 0.08, hi)
        f.rect(x - w / 2 + 3, y, s * 0.05, s * 0.5, "f-obj")
        f.rect(x + w / 2 - 3 - s * 0.05, y, s * 0.05, s * 0.5, "f-obj")
    elif shape in ("window", "door"):
        w = s * (0.7 if shape == "window" else 0.45)
        f.rect(x - w / 2, y - s, w, s, "f-screen")
        f.rect(x - w / 2, y - s, w, s, "f-outline")
        if shape == "window":
            f.line(x, y - s, x, y, "f-line")
            f.line(x - w / 2, y - s / 2, x + w / 2, y - s / 2, "f-line")
    elif shape == "paper":
        w = float(el.get("w", 0.0)) * W or s * 1.3
        f.rect(x - w / 2, y - s, w, s, "f-card", 2)
    elif shape == "hand":
        f.add(f'<ellipse cx="{num(x)}" cy="{num(y - s * 0.3)}" rx="{num(s * 0.32)}" ry="{num(s * 0.22)}" class="f-fig-hi"/>')
        f.line(x - s * 0.2, y - s * 0.38, x - s * 0.55, y - s * 0.75, "f-pen")
    else:  # box / product / anything else
        w = float(el.get("w", 0.0)) * W or s * 0.8
        f.rect(x - w / 2, y - s, w, s, hi, 3)
    if el.get("label"):
        fs = f.U * 0.05
        below = y + fs * 1.4
        limit = H * 0.78 if W < H else H - 2
        where = str(el.get("label_at", "below" if below <= limit else "above"))
        ly = below if where == "below" else y - s - fs * 0.5
        f.text(x, ly, el["label"], "f-label", fs, "middle")


def draw_chart(f, el):
    W, H = f.W, f.H
    x, y = float(el.get("x", 0.15)) * W, float(el.get("y", 0.2)) * H
    w, h = float(el.get("w", 0.7)) * W, float(el.get("h", 0.6)) * H
    vals = [float(v) for v in as_list(el.get("values")) or [0.3, 0.5, 0.4, 0.7, 0.9]]
    top = max(vals) or 1
    f.line(x, y + h, x + w, y + h, "f-line")
    if str(el.get("type", "bar")).lower() == "line":
        step = w / max(1, len(vals) - 1)
        pts = " ".join(f"{num(x + i * step)},{num(y + h - v / top * h * 0.9)}" for i, v in enumerate(vals))
        f.add(f'<polyline points="{pts}" class="f-move"/>')
    else:
        bw = w / (len(vals) * 1.5)
        for i, v in enumerate(vals):
            f.rect(x + bw * 0.25 + i * bw * 1.5, y + h - v / top * h * 0.9, bw, v / top * h * 0.9, "f-accent-fill" if i == len(vals) - 1 else "f-obj")
    if el.get("label"):
        f.text(x, y - H * 0.03, el["label"], "f-label", f.U * 0.055)


def draw_arrow(f, el):
    W, H = f.W, f.H
    a = as_list(el.get("from", [0.2, 0.5]))
    b = as_list(el.get("to", [0.8, 0.5]))
    f.arrow(float(a[0]) * W, float(a[1]) * H, float(b[0]) * W, float(b[1]) * H, "f-path")
    if el.get("label"):
        f.text((float(a[0]) + float(b[0])) / 2 * W, (float(a[1]) + float(b[1])) / 2 * H - H * 0.04,
               el["label"], "f-label", f.U * 0.05, "middle")


def draw_camera_move(f, move):
    """Overlay that shows what the camera does during the shot."""
    W, H = f.W, f.H
    m = re.sub(r"[\s_]+", "-", str(move or "static").lower().strip())
    tag = m.replace("-", " ").upper()
    if m in ("static", "locked", "locked-off", "none", "tripod", ""):
        return
    if any(k in m for k in ("push", "dolly-in", "zoom-in", "zoom", "punch")) and "out" not in m:
        ix, iy = W * 0.2, H * 0.2
        f.rect(ix, iy, W - 2 * ix, H - 2 * iy, "f-move-box")
        for (ox, oy), (tx, ty) in (((4, 4), (ix, iy)), ((W - 4, 4), (W - ix, iy)),
                                   ((4, H - 4), (ix, H - iy)), ((W - 4, H - 4), (W - ix, H - iy))):
            f.arrow(ox, oy, ox + (tx - ox) * 0.8, oy + (ty - oy) * 0.8)
    elif any(k in m for k in ("pull", "dolly-out", "zoom-out", "reveal")):
        ix, iy = W * 0.2, H * 0.2
        f.rect(ix, iy, W - 2 * ix, H - 2 * iy, "f-move-box")
        for (sx, sy), (tx, ty) in (((ix, iy), (4, 4)), ((W - ix, iy), (W - 4, 4)),
                                   ((ix, H - iy), (4, H - 4)), ((W - ix, H - iy), (W - 4, H - 4))):
            f.arrow(sx, sy, sx + (tx - sx) * 0.8, sy + (ty - sy) * 0.8)
    elif "whip" in m:
        y = H * 0.12
        f.arrow(W * 0.15, y, W * 0.85, y)
        for dy in (-0.04, 0.04):
            f.line(W * 0.2, y + dy * H, W * 0.6, y + dy * H, "f-move-thin")
    elif "pan" in m or "track" in m or "truck" in m or "slide" in m:
        right = "right" in m
        y = H * 0.92
        a, b = (W * 0.25, W * 0.75) if right else (W * 0.75, W * 0.25)
        f.arrow(a, y, b, y)
        if "track" in m or "truck" in m or "slide" in m:
            f.line(a, y - H * 0.035, b, y - H * 0.035, "f-move-thin")
    elif "tilt" in m:
        up = "up" in m
        x = W * 0.94
        a, b = (H * 0.75, H * 0.25) if up else (H * 0.25, H * 0.75)
        f.arrow(x, a, x, b)
    elif any(k in m for k in ("crane", "jib", "pedestal", "boom", "rise", "drone")):
        up = "down" not in m
        x = W * 0.06
        a, b = (H * 0.8, H * 0.2) if up else (H * 0.2, H * 0.8)
        f.arrow(x, a, x, b)
        f.line(x + W * 0.02, a, x + W * 0.02, b, "f-move-thin")
    elif "orbit" in m or "arc" in m:
        cx, cy, rx, ry = W / 2, H * 0.86, W * 0.32, H * 0.08
        f.path(f"M{num(cx - rx)} {num(cy)} A{num(rx)} {num(ry)} 0 0 0 {num(cx + rx)} {num(cy)}", "f-move")
        f.arrow(cx + rx * 0.97, cy - ry * 0.25, cx + rx, cy)
    elif "handheld" in m or "gimbal" in m or "follow" in m:
        x0, y0 = W * 0.06, H * 0.9
        pts = " ".join(f"{num(x0 + i * W * 0.025)},{num(y0 + (H * 0.02 if i % 2 else -H * 0.02))}" for i in range(9))
        f.add(f'<polyline points="{pts}" class="f-move"/>')
    elif "rack" in m or "focus" in m:
        f.circle(W * 0.25, H * 0.5, H * 0.06, "f-move-box")
        f.circle(W * 0.75, H * 0.5, H * 0.06, "f-move-box")
        f.arrow(W * 0.33, H * 0.5, W * 0.67, H * 0.5)
    fs = f.U * 0.045
    tw = len(tag) * fs * 0.62 + fs
    f.rect(W - tw - 4, 4, tw, fs * 1.5, "f-tag", 2)
    f.text(W - tw / 2 - 4, 4 + fs * 1.1, tag, "f-tag-text", fs, "middle", 700)


def draw_safe_zones(f):
    """Short-form platforms cover the bottom and right edge with UI."""
    W, H = f.W, f.H
    f.rect(0, H * 0.8, W, H * 0.2, "f-safe")
    f.rect(W * 0.84, H * 0.42, W * 0.16, H * 0.38, "f-safe")
    f.text(W * 0.5, H * 0.95, "platform UI", "f-safe-text", f.U * 0.04, "middle")


ELEMENTS = {
    "person": draw_person, "shoulder": draw_shoulder, "text": draw_text, "object": draw_object,
    "chart": draw_chart, "arrow": draw_arrow,
    "screen": lambda f, e: draw_device(f, e, "screen"), "monitor": lambda f, e: draw_device(f, e, "monitor"),
    "laptop": lambda f, e: draw_device(f, e, "laptop"), "phone": lambda f, e: draw_device(f, e, "phone"),
}


def render_frame(shot, aspect, safe_zones):
    spec = shot.get("frame") or {}
    f = Frame(spec.get("aspect", aspect))
    W, H = f.W, f.H
    f.rect(0, 0, W, H, "f-bg")
    draw_background(f, spec.get("bg"))
    for x in (W / 3, 2 * W / 3):
        f.line(x, 0, x, H, "f-thirds")
    for y in (H / 3, 2 * H / 3):
        f.line(0, y, W, y, "f-thirds")
    if spec.get("svg"):
        f.add(str(spec["svg"]))
    for el in as_list(spec.get("elements")):
        fn = ELEMENTS.get(str(el.get("kind", "")).lower())
        if fn:
            fn(f, el)
        else:
            warn(f"shot {shot.get('id')}: unknown frame element kind {el.get('kind')!r}")
    if not spec:
        f.text(W / 2, H / 2, "no frame spec", "f-label", H * 0.06, "middle")
        warn(f"shot {shot.get('id')}: no frame spec, so its storyboard frame is blank")
    draw_camera_move(f, spec.get("move", shot.get("move")))
    if safe_zones and spec.get("aspect", aspect) == "9:16":
        draw_safe_zones(f)
    label = f"Shot {shot.get('id', '')}: {shot.get('visual', '')}"
    return (f'<svg viewBox="0 0 {W} {H}" class="frame" role="img" aria-label="{esc(label)}" '
            f'preserveAspectRatio="xMidYMid meet">{"".join(f.out)}</svg>')


# --------------------------------------------------------------------------
# Page sections
# --------------------------------------------------------------------------

def is_dropped(shot):
    return str(shot.get("status", "")).lower() in ("dropped", "cut", "replaced")


def feas_pill(level):
    level = str(level or "").lower()
    if level not in FEAS:
        return ""
    name, tip = FEAS[level]
    return f'<span class="feas feas-{level}" title="{esc(tip)}">{name}</span>'


def chips(items, cls="chip"):
    return "".join(f'<span class="{cls}">{esc(i)}</span>' for i in items if i)


def bullet_list(items, cls=""):
    items = [i for i in as_list(items) if i]
    if not items:
        return ""
    c = f' class="{cls}"' if cls else ""
    return f"<ul{c}>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ul>"


def section(sid, title, body, lead=""):
    if not body:
        return ""
    lead_html = f'<p class="lead">{esc(lead)}</p>' if lead else ""
    return f'<section id="{sid}"><h2>{esc(title)}</h2>{lead_html}{body}</section>'


def shot_secs(shot):
    if shot.get("duration") is not None:
        return parse_secs(shot["duration"])
    t = str(shot.get("time", ""))
    if "-" in t or "–" in t:
        a, b = re.split(r"\s*[-–]\s*", t, maxsplit=1)
        sa, sb = parse_secs(a), parse_secs(b)
        if sa is not None and sb is not None and sb >= sa:
            return sb - sa
    return None


def build_header(plan, shots, cur, budget_totals):
    meta = plan.get("meta") or {}
    shots = [s for s in shots if not is_dropped(s)]
    meta_chips = []
    for key, label in (("platform", "Platform"), ("length", "Length"), ("aspect", "Aspect"), ("audience", "Audience"),
                       ("goal", "Goal"), ("budget", "Budget"), ("deadline", "Deadline"), ("crew", "Crew")):
        if meta.get(key):
            meta_chips.append(f'<span class="meta"><b>{label}</b> {esc(meta[key])}</span>')
    total_secs = sum(s for s in (shot_secs(x) for x in shots) if s)
    counts = {k: sum(1 for s in shots if str(s.get("feasibility", "")).lower() == k) for k in FEAS}
    stats = [("Shots", str(len(shots)))]
    if meta.get("length"):
        stats.append(("Runtime", str(meta["length"])))
    if total_secs:
        stats.append(("Storyboarded", fmt_time(total_secs)))
    for name, total in budget_totals:
        stats.append((f"{name} budget", total))
    feas = " ".join(f'<span class="dot dot-{k}"></span>{counts[k]}' for k in FEAS if counts[k])
    if feas:
        stats.append(("Feasibility", feas))
    stat_html = "".join(f'<div class="stat"><div class="stat-k">{esc(k)}</div><div class="stat-v">{v if k == "Feasibility" else esc(v)}</div></div>'
                        for k, v in stats)
    date = f'<span class="muted">Plan v{esc(plan.get("version", 1))} · {esc(meta.get("date", ""))}</span>' if meta.get("date") else ""
    return (f'<header class="hero"><div class="eyebrow">Director\'s board {date}</div>'
            f'<h1>{esc(plan.get("title", "Untitled video"))}</h1>'
            f'{"<p class=logline>" + esc(plan["logline"]) + "</p>" if plan.get("logline") else ""}'
            f'<div class="metas">{"".join(meta_chips)}</div>'
            f'<div class="stats">{stat_html}</div></header>')


def build_vision(plan):
    v = plan.get("vision") or {}
    if not v:
        return ""
    rows = []
    if v.get("intent"):
        rows.append(f'<p class="intent">{esc(v["intent"])}</p>')
    if v.get("tone"):
        rows.append(f'<div class="vrow"><div class="vk">Tone</div><div>{chips(as_list(v["tone"]))}</div></div>')
    for key, label in (("look", "Look"), ("camera", "Camera"), ("light", "Light"), ("type", "Type & graphics"),
                       ("edit", "Edit rhythm"), ("sound", "Sound & music")):
        if v.get(key):
            rows.append(f'<div class="vrow"><div class="vk">{label}</div><div>{esc(v[key])}</div></div>')
    pal = as_list(v.get("palette"))
    if pal:
        sw = []
        for p in pal:
            hexv = p.get("hex") if isinstance(p, dict) else p
            name = p.get("name", "") if isinstance(p, dict) else ""
            if not re.fullmatch(r"#[0-9a-fA-F]{3,8}", str(hexv or "")):
                continue
            sw.append(f'<div class="swatch"><span style="background:{hexv}"></span><b>{esc(name)}</b><code>{esc(hexv)}</code></div>')
        rows.append(f'<div class="vrow"><div class="vk">Palette</div><div class="swatches">{"".join(sw)}</div></div>')
    if v.get("references"):
        rows.append(f'<div class="vrow"><div class="vk">References</div><div>{bullet_list(v["references"])}</div></div>')
    return section("vision", "Vision", "".join(rows))


def build_structure(plan):
    beats = as_list(plan.get("beats"))
    if not beats:
        return ""
    segs, rows = [], []
    for i, b in enumerate(beats):
        a, z = parse_secs(b.get("start")), parse_secs(b.get("end"))
        d = (z - a) if a is not None and z is not None and z > a else parse_secs(b.get("duration")) or 1
        rng = f'{b.get("start", "")}–{b.get("end", "")}' if b.get("start") is not None else ""
        segs.append(f'<div class="seg seg-{i % 6}" style="flex:{num(d, 2)}" title="{esc(b.get("name"))} {esc(rng)}">'
                    f'<span>{esc(b.get("name", ""))}</span></div>')
        rows.append(f'<div class="beat"><div class="beat-h"><span class="sw seg-{i % 6}"></span><b>{esc(b.get("name", ""))}</b>'
                    f'<span class="muted">{esc(rng)}</span></div>'
                    f'<p>{esc(b.get("purpose", ""))}</p>'
                    f'{"<p class=muted>Viewer feels: " + esc(b["feeling"]) + "</p>" if b.get("feeling") else ""}</div>')
    return section("structure", "Structure", f'<div class="timeline">{"".join(segs)}</div><div class="beats">{"".join(rows)}</div>')


def build_storyboard(plan, shots):
    aspect = (plan.get("meta") or {}).get("aspect", "16:9")
    aspect = aspect if aspect in ASPECTS else "16:9"
    safe = (plan.get("meta") or {}).get("safe_zones", True)
    cards = []
    for s in shots:
        svg = render_frame(s, aspect, safe)
        dur = shot_secs(s)
        when = " · ".join(x for x in (esc(s.get("time", "")), f"{num(dur)}s" if dur else "") if x)
        spec = chips([s.get("size"), s.get("angle"), s.get("move"), s.get("lens")])
        body = [f'<div class="shot-h"><b>Shot {esc(s.get("id", ""))}</b><span class="muted">{when}</span>{feas_pill(s.get("feasibility"))}</div>']
        if s.get("beat"):
            body.append(f'<div class="muted small">{esc(s["beat"])}</div>')
        if spec:
            body.append(f'<div class="chips">{spec}</div>')
        if s.get("visual"):
            body.append(f'<p>{esc(s["visual"])}</p>')
        if s.get("audio"):
            body.append(f'<p class="audio"><span class="k">Says</span>{esc(s["audio"])}</p>')
        if s.get("sound"):
            body.append(f'<p class="audio"><span class="k">Sound</span>{esc(s["sound"])}</p>')
        if s.get("onscreen"):
            body.append(f'<p class="audio"><span class="k">On screen</span>{esc(s["onscreen"])}</p>')
        if s.get("transition"):
            body.append(f'<p class="audio"><span class="k">Out</span>{esc(s["transition"])}</p>')
        if s.get("method"):
            body.append(f'<div class="method">{esc(s["method"])}</div>')
        cls = "shot shot-tall" if aspect in ("9:16", "4:5") else "shot"
        if is_dropped(s):
            cls += " shot-dropped"
            body[0] = body[0].replace("</b>", '</b><span class="feas feas-dropped">Dropped</span>', 1)
        cards.append(f'<article class="{cls}"><div class="shot-frame">{svg}</div><div class="shot-b">{"".join(body)}</div></article>')
    legend = ('<p class="legend">Frames are composition diagrams: grey shapes are people and objects, the faint grid is the rule of thirds, '
              'orange arrows show camera movement, dashed boxes show where a push-in ends.</p>')
    return section("storyboard", "Storyboard", legend + f'<div class="board board-{aspect.replace(":", "x").replace(".", "")}">{"".join(cards)}</div>')


def build_script(plan, shots):
    rows = as_list(plan.get("script"))
    if not rows:
        rows = [{"time": s.get("time", ""), "shot": s.get("id", ""), "visual": s.get("visual", ""),
                 "audio": s.get("audio", ""), "sound": s.get("sound", ""), "onscreen": s.get("onscreen", "")}
                for s in shots if not is_dropped(s) and (s.get("audio") or s.get("visual") or s.get("sound"))]
    if not rows:
        return ""
    words = sum(len(str(r.get("audio", "")).split()) for r in rows)
    tr = []
    for r in rows:
        vis = esc(r.get("visual", ""))
        if r.get("onscreen"):
            vis += f'<div class="ost">On screen: {esc(r["onscreen"])}</div>'
        tr.append(f'<tr><td class="tc">{esc(r.get("time", ""))}<div class="muted small">{("Shot " + esc(r["shot"])) if r.get("shot") else ""}</div></td>'
                  f'<td>{vis}</td><td class="vo">{esc(r.get("audio", ""))}'
                  f'{"<div class=sfx>" + esc(r["sound"]) + "</div>" if r.get("sound") else ""}</td></tr>')
    wpm = float((plan.get("meta") or {}).get("wpm", 150))
    lead = (f"{words} spoken words, about {fmt_time(words / wpm * 60)} at {num(wpm)} words a minute."
            if words else "No spoken words: the sound column carries music and effects.")
    table = ('<div class="tw"><table class="script"><thead><tr><th>Time</th><th>Picture</th><th>Words & sound</th></tr></thead>'
             f'<tbody>{"".join(tr)}</tbody></table></div>')
    return section("script", "Script", table, lead)


def build_production(plan, shots, cur):
    rows = []
    for s in shots:
        how = as_list(s.get("how"))
        how_html = "<ol>" + "".join(f"<li>{esc(h)}</li>" for h in how) + "</ol>" if how else ""
        tools = ", ".join(str(t) for t in as_list(s.get("tools")))
        risk = ""
        if s.get("risk"):
            risk += f'<div><span class="k">Risk</span>{esc(s["risk"])}</div>'
        if s.get("fallback"):
            risk += f'<div><span class="k">Fallback</span>{esc(s["fallback"])}</div>'
        alts = as_list(s.get("alternatives"))
        if alts:
            li = []
            for a in alts:
                pick = '<span class="pick">Picked</span>' if a.get("pick") else ""
                meta = " · ".join(x for x in (money(a.get("cost"), cur) if a.get("cost") is not None else "",
                                              esc(a.get("effort", "")),
                                              f'fidelity {esc(a["fidelity"])}/5' if a.get("fidelity") else "") if x)
                li.append(f'<li>{pick}<b>{esc(a.get("option", ""))}</b> <span class="muted">{meta}</span>'
                          f'{"<div>" + esc(a["how"]) + "</div>" if a.get("how") else ""}</li>')
            risk += f'<div class="alts"><span class="k">Options</span><ul>{"".join(li)}</ul></div>'
        level = str(s.get("feasibility", "")).lower()
        if is_dropped(s):
            level = ""
        elif level in ("amber", "red") and not (s.get("fallback") or alts):
            warn(f"shot {s.get('id')}: rated {level} but has no fallback or alternatives")
        if not s.get("method") and not is_dropped(s):
            warn(f"shot {s.get('id')}: no method (how this shot gets made)")
        pill = '<span class="feas feas-dropped">Dropped</span>' if is_dropped(s) else feas_pill(level)
        rows.append(f'<tr{" class=row-dropped" if is_dropped(s) else ""}><td class="tc"><b>{esc(s.get("id", ""))}</b>{pill}</td>'
                    f'<td><b>{esc(s.get("method", ""))}</b><div class="muted">{esc(tools)}</div></td>'
                    f'<td>{how_html}</td><td class="nw">{esc(s.get("effort", ""))}</td>'
                    f'<td class="nw">{money(s.get("cost"), cur)}</td><td>{risk}</td></tr>')
    table = ('<div class="tw"><table class="prod"><thead><tr><th>Shot</th><th>Method & tools</th><th>How to get it</th>'
             f'<th>Effort</th><th>Cost</th><th>Risk & backup</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>')
    return section("production", "How each shot gets made", table)


def budget_totals(plan, cur):
    b = plan.get("budget") or {}
    tiers = [t if isinstance(t, dict) else {"name": t} for t in as_list(b.get("tiers"))]
    items = as_list(b.get("line_items"))
    out = []
    for t in tiers:
        name = t.get("name", "")
        if t.get("total") is not None:
            out.append((name, money(t["total"], cur)))
            continue
        lo = hi = 0.0
        varies = False
        for it in items:
            rng = parse_money((it.get("costs") or {}).get(name))
            if rng is None:
                varies = varies or (it.get("costs") or {}).get(name) not in (None, "", "-")
                continue
            lo += rng[0]
            hi += rng[1]
        total = money(f"{lo}-{hi}" if hi != lo else lo, cur)
        out.append((name, total + ("+" if varies else "")))
    return tiers, items, out


def build_tools_budget(plan, cur):
    parts = []
    tools = as_list(plan.get("tools"))
    if tools:
        tr = "".join(
            f'<tr><td><b>{esc(t.get("name", ""))}</b><div class="muted small">{esc(t.get("category", ""))}</div></td>'
            f'<td>{esc(t.get("use", ""))}</td><td>{esc(t.get("plan", ""))}</td><td class="nw">{money(t.get("cost"), cur)}</td>'
            f'<td>{esc(t.get("alt", ""))}</td></tr>' for t in tools)
        parts.append('<h3>Tools</h3><div class="tw"><table><thead><tr><th>Tool</th><th>Used for</th><th>Plan</th><th>Cost</th>'
                     f'<th>Free or cheaper swap</th></tr></thead><tbody>{tr}</tbody></table></div>')
    tiers, items, totals = budget_totals(plan, cur)
    if tiers:
        cards = "".join(
            f'<div class="tier"><div class="tier-n">{esc(t.get("name", ""))}</div><div class="tier-v">{tot}</div>'
            f'<p>{esc(t.get("summary", ""))}</p></div>' for t, (_, tot) in zip(tiers, totals))
        parts.append(f'<h3>Budget</h3><div class="tiers">{cards}</div>')
        if items:
            head = "".join(f"<th>{esc(t.get('name', ''))}</th>" for t in tiers)
            tr = "".join(
                f'<tr><td>{esc(it.get("item", ""))}<div class="muted small">{esc(it.get("note", ""))}</div></td>'
                + "".join(f'<td class="nw">{money((it.get("costs") or {}).get(t.get("name")), cur) or "–"}</td>' for t in tiers)
                + "</tr>" for it in items)
            foot = "".join(f'<td class="nw"><b>{tot}</b></td>' for _, tot in totals)
            parts.append(f'<div class="tw"><table><thead><tr><th>Line item</th>{head}</tr></thead><tbody>{tr}</tbody>'
                         f'<tfoot><tr><td><b>Total</b></td>{foot}</tr></tfoot></table></div>')
    note = (plan.get("budget") or {}).get("note")
    if note:
        parts.append(f'<p class="note">{esc(note)}</p>')
    return section("costs", "Tools & costs", "".join(parts))


def build_risks(plan):
    risks = as_list(plan.get("risks"))
    if not risks:
        return ""
    tr = "".join(
        f'<tr><td><b>{esc(r.get("risk", ""))}</b></td><td class="nw">{esc(r.get("impact", ""))}</td>'
        f'<td class="nw">{esc(r.get("likelihood", ""))}</td><td>{esc(r.get("plan_b", ""))}</td><td>{esc(r.get("plan_c", ""))}</td></tr>'
        for r in risks)
    return section("risks", "Risks & backup plans",
                   '<div class="tw"><table><thead><tr><th>Risk</th><th>Impact</th><th>Likelihood</th><th>Plan B</th><th>Plan C</th></tr></thead>'
                   f'<tbody>{tr}</tbody></table></div>')


def build_workflow(plan):
    stages = as_list(plan.get("workflow"))
    parts = []
    if stages:
        boxes = "".join(
            f'<div class="stage"><div class="stage-n">{i + 1}</div><b>{esc(st.get("stage", ""))}</b>'
            f'<div class="muted small">{esc(" · ".join(x for x in (st.get("time", ""), st.get("owner", "")) if x))}</div>'
            f'{bullet_list(st.get("steps"))}</div>' for i, st in enumerate(stages))
        parts.append(f'<div class="pipeline">{boxes}</div>')
    if plan.get("checklist"):
        items = "".join(f'<li><label><input type="checkbox"> {esc(c)}</label></li>' for c in as_list(plan["checklist"]))
        parts.append(f'<h3>Checklist</h3><ul class="check">{items}</ul>')
    return section("workflow", "Workflow", "".join(parts))


def build_notes(plan):
    parts = []
    if plan.get("assumptions"):
        parts.append(f'<div><h3>Assumptions</h3>{bullet_list(plan["assumptions"])}</div>')
    if plan.get("questions"):
        parts.append(f'<div><h3>Open questions</h3>{bullet_list(plan["questions"])}</div>')
    body = f'<div class="two">{"".join(parts)}</div>' if parts else ""
    changes = as_list(plan.get("changes"))
    if changes:
        tr = "".join(f'<tr><td class="nw">{esc(c.get("date", ""))}</td><td class="nw">{esc(c.get("shot", ""))}</td>'
                     f'<td>{esc(c.get("was", ""))}</td><td>{esc(c.get("now", ""))}</td><td>{esc(c.get("why", ""))}</td></tr>'
                     for c in changes)
        body += ('<h3>Revision log</h3><div class="tw"><table><thead><tr><th>Date</th><th>Shot</th><th>Was</th><th>Now</th><th>Why</th>'
                 f'</tr></thead><tbody>{tr}</tbody></table></div>')
    return section("notes", "Assumptions, questions & changes", body)


CSS = r"""
:root{--bg:#f6f4ef;--panel:#fffdf9;--ink:#1d1b18;--muted:#6b665d;--line:#e2ddd2;--soft:#efebe3;
--accent:#d9480f;--accent-ink:#fff;--fig:#8f8a80;--fig-hi:#5c574f;--fg:#3a3732;--frame:#fbfaf6;--frame2:#ece8df;
--dark:#26241f;--screen:#dfe7ee;--green:#2b8a3e;--amber:#e8590c;--red:#c92a2a;
--s0:#4c6ef5;--s1:#12b886;--s2:#fab005;--s3:#e64980;--s4:#7950f2;--s5:#15aabf}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#15140f;--panel:#1d1c17;--ink:#eeebe4;--muted:#a49f94;
--line:#34322b;--soft:#26241e;--accent:#ff8a4c;--accent-ink:#1a0f08;--fig:#8a857b;--fig-hi:#c9c4b8;--fg:#0c0b09;--frame:#24231d;
--frame2:#2f2d26;--dark:#0f0e0b;--screen:#2c3640;--green:#51cf66;--amber:#ff922b;--red:#ff6b6b}}
:root[data-theme="dark"]{--bg:#15140f;--panel:#1d1c17;--ink:#eeebe4;--muted:#a49f94;--line:#34322b;--soft:#26241e;--accent:#ff8a4c;
--accent-ink:#1a0f08;--fig:#8a857b;--fig-hi:#c9c4b8;--fg:#0c0b09;--frame:#24231d;--frame2:#2f2d26;--dark:#0f0e0b;--screen:#2c3640;
--green:#51cf66;--amber:#ff922b;--red:#ff6b6b}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:0 16px 64px}
nav{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(6px);
border-bottom:1px solid var(--line);overflow-x:auto;white-space:nowrap}
nav .in{max-width:1180px;margin:0 auto;padding:10px 16px;display:flex;gap:18px}
nav a{color:var(--muted);text-decoration:none;font-size:13px;font-weight:600}
nav a:hover{color:var(--accent)}
.hero{padding:40px 0 8px}
.eyebrow{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-weight:700}
.eyebrow .muted{letter-spacing:0;text-transform:none;font-weight:500;margin-left:8px}
h1{font-size:clamp(28px,4.4vw,44px);line-height:1.1;margin:8px 0 10px;letter-spacing:-.02em}
.logline{font-size:18px;color:var(--muted);max-width:760px;margin:0 0 16px}
.metas{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.meta{background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:13px}
.meta b{color:var(--muted);font-weight:600;margin-right:4px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.stat-k{font-size:12px;color:var(--muted)}.stat-v{font-size:20px;font-weight:700;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-left:6px}
.dot-green{background:var(--green)}.dot-amber{background:var(--amber)}.dot-red{background:var(--red)}
section{margin-top:44px}
h2{font-size:22px;margin:0 0 6px;letter-spacing:-.01em}
h3{font-size:15px;margin:22px 0 8px}
.lead,.legend,.note{color:var(--muted);margin:0 0 14px;font-size:14px}
.muted{color:var(--muted)}.small{font-size:12px}
.chip{display:inline-block;background:var(--soft);border-radius:6px;padding:2px 8px;font-size:12px;margin:0 6px 6px 0}
.intent{font-size:17px;border-left:3px solid var(--accent);padding-left:12px;margin:0 0 14px}
.vrow{display:grid;grid-template-columns:150px 1fr;gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.vk{color:var(--muted);font-size:13px;font-weight:600}
.vrow ul{margin:0;padding-left:18px}
.swatches{display:flex;flex-wrap:wrap;gap:12px}
.swatch{display:flex;align-items:center;gap:8px;font-size:13px}
.swatch span{width:28px;height:28px;border-radius:8px;border:1px solid var(--line)}
.swatch code{color:var(--muted);font-size:12px}
.timeline{display:flex;height:40px;border-radius:10px;overflow:hidden;margin:6px 0 14px}
.seg{display:flex;align-items:center;justify-content:center;min-width:6px;color:#fff;font-size:12px;font-weight:600;overflow:hidden;white-space:nowrap;padding:0 4px}
.seg span{overflow:hidden;text-overflow:ellipsis}
.seg-0{background:var(--s0)}.seg-1{background:var(--s1)}.seg-2{background:var(--s2);color:#1d1b18}.seg-3{background:var(--s3)}.seg-4{background:var(--s4)}.seg-5{background:var(--s5)}
.beats{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.beat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.beat p{margin:4px 0 0;font-size:14px}
.beat-h{display:flex;align-items:center;gap:8px}.beat-h .muted{margin-left:auto;font-size:12px}
.sw{width:10px;height:10px;border-radius:3px;display:inline-block}
.board{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.board-9x16,.board-4x5{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.shot{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;break-inside:avoid;display:flex;flex-direction:column}
.shot-frame{background:var(--frame);border-bottom:1px solid var(--line);padding:8px}
.frame{display:block;width:100%;height:auto;border-radius:6px}
.shot-b{padding:10px 12px 12px;font-size:14px}
.shot-b p{margin:6px 0}
.shot-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.k{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-right:6px}
.audio{color:var(--ink)}
.method{display:inline-block;margin-top:4px;font-size:12px;font-weight:600;color:var(--accent);border:1px solid currentColor;border-radius:6px;padding:1px 8px}
.feas{font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;color:#fff;margin-left:auto}
td .feas{margin:4px 0 0 6px;display:inline-block}
.feas-dropped{background:var(--muted)}
.shot-dropped{opacity:.7}.shot-dropped .shot-frame{filter:grayscale(1)}.row-dropped td{color:var(--muted)}
.feas-green{background:var(--green)}.feas-amber{background:var(--amber)}.feas-red{background:var(--red)}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
table{border-collapse:collapse;width:100%;font-size:14px}
th{text-align:left;font-size:12px;color:var(--muted);font-weight:700;background:var(--soft);padding:8px 10px;white-space:nowrap}
td{padding:9px 10px;border-top:1px solid var(--line);vertical-align:top}
td ol,td ul{margin:0;padding-left:18px}
tfoot td{background:var(--soft)}
.tc{white-space:nowrap}.nw{white-space:nowrap}
.script td.vo{font-size:15px}
.script td{min-width:180px}.script td.tc{min-width:0}
.prod td{min-width:150px}.prod td.tc,.prod td.nw{min-width:0}
.ost{margin-top:4px;font-size:12px;color:var(--accent);font-weight:600}
.sfx{margin-top:4px;font-size:13px;color:var(--muted);font-style:italic}
.alts ul{padding-left:16px;margin:4px 0 0}
.alts li{margin-bottom:4px}
.pick{background:var(--accent);color:var(--accent-ink);font-size:10px;font-weight:700;border-radius:4px;padding:1px 5px;margin-right:6px}
.tiers{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:12px}
.tier{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.tier-n{font-size:13px;color:var(--muted);font-weight:700}.tier-v{font-size:24px;font-weight:800;margin:2px 0}
.tier p{margin:0;font-size:13px;color:var(--muted)}
.pipeline{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:22px}
.stage{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px}
.stage ul{margin:8px 0 0;padding-left:18px}
.stage-n{width:24px;height:24px;border-radius:50%;background:var(--accent);color:var(--accent-ink);font-weight:800;font-size:12px;
display:flex;align-items:center;justify-content:center;margin-bottom:6px}
.stage:not(:last-child)::after{content:"";position:absolute;right:-17px;top:22px;border:7px solid transparent;border-left:9px solid var(--accent)}
.check{list-style:none;padding:0;columns:2 280px}
.check li{margin:0 0 6px;break-inside:avoid}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.two ul{padding-left:18px}
footer{margin-top:48px;color:var(--muted);font-size:12px}
/* storyboard frame drawing */
.f-bg{fill:var(--frame)}.f-bg2{fill:var(--frame2)}.f-dark{fill:var(--dark)}
.f-thirds{stroke:var(--muted);stroke-opacity:.18;stroke-width:.5;stroke-dasharray:2 3}
.f-gridline{stroke:#fff;stroke-opacity:.07;stroke-width:.6}
.f-line{stroke:var(--fig-hi);stroke-width:1}.f-line-soft{stroke:var(--fig);stroke-width:.8}
.f-fig{fill:var(--fig)}.f-fig-hi{fill:var(--fig-hi)}.f-fg{fill:var(--fg);opacity:.85}
.f-eye{fill:var(--frame)}
.f-obj{fill:var(--fig)}.f-bldg{fill:var(--fig);opacity:.55}.f-window{fill:var(--frame);opacity:.7}.f-cloud{fill:var(--frame2)}
.f-handle{fill:none;stroke:var(--fig);stroke-width:2.2}
.f-pen{stroke:var(--fg);stroke-width:2.4;stroke-linecap:round}
.f-outline{fill:none;stroke:var(--fig-hi);stroke-width:1}
.f-device{fill:var(--fg)}.f-screen{fill:var(--screen)}.f-card{fill:var(--panel);stroke:var(--line);stroke-width:.6}
.f-code{stroke:var(--accent);stroke-opacity:.75;stroke-width:1.6;stroke-linecap:round}
.f-accent-fill{fill:var(--accent)}
.f-text{fill:var(--ink)}.f-text-hi{fill:var(--accent)}.f-label{fill:var(--muted)}
.f-boxtext{fill:var(--ink)}.f-boxtext-hi{fill:var(--accent)}
.f-dark~.f-label{fill:#b9b4aa}
.f-dark~.f-text,.f-dark~text.f-text{fill:#f4f1ea}
.f-l3{fill:var(--panel);opacity:.95}.f-cap{fill:var(--dark);opacity:.72}
.f-cap+text.f-text,.f-cap~.f-text{fill:#fff}
.f-move,.f-path{fill:none;stroke:var(--accent);stroke-width:1.6;stroke-linecap:round}
.f-path{stroke-dasharray:4 3}
.f-move-head,.f-path-head{fill:var(--accent)}
.f-move-thin{stroke:var(--accent);stroke-width:.8;stroke-opacity:.7}
.f-move-box{fill:none;stroke:var(--accent);stroke-width:1.2;stroke-dasharray:5 3}
.f-tag{fill:var(--accent)}.f-tag-text{fill:var(--accent-ink)}
.f-safe{fill:var(--red);opacity:.12}.f-safe-text{fill:var(--red);opacity:.8}
@media (max-width:640px){.vrow{grid-template-columns:1fr;gap:2px}.stage:not(:last-child)::after{display:none}.hero{padding-top:24px}}
@media print{nav{display:none}body{background:#fff}.shot,.stage,.tier,.beat{break-inside:avoid}section{margin-top:24px}.tw{overflow:visible}}
"""


def build(plan):
    meta = plan.get("meta") or {}
    cur = meta.get("currency", "$")
    shots = as_list(plan.get("shots"))
    if not shots:
        warn("plan has no shots")
    tiers, _, totals = budget_totals(plan, cur)
    sections = [
        build_vision(plan),
        build_structure(plan),
        build_storyboard(plan, shots),
        build_script(plan, shots),
        build_production(plan, shots, cur),
        build_tools_budget(plan, cur),
        build_risks(plan),
        build_workflow(plan),
        build_notes(plan),
    ]
    names = [("vision", "Vision"), ("structure", "Structure"), ("storyboard", "Storyboard"), ("script", "Script"),
             ("production", "How it's made"), ("costs", "Tools & costs"), ("risks", "Risks"), ("workflow", "Workflow"),
             ("notes", "Notes")]
    nav = "".join(f'<a href="#{sid}">{label}</a>' for (sid, label), body in zip(names, sections) if body)
    title = plan.get("title", "Video plan")
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{esc(title)}</title><style>{CSS}</style></head><body>'
            f'<nav><div class="in">{nav}</div></nav><div class="wrap">'
            f'{build_header(plan, shots, cur, totals)}{"".join(sections)}'
            f'<footer>Costs are estimates{" as of " + esc(meta["date"]) if meta.get("date") else ""}; check current prices before you buy. '
            f'Storyboard frames are layout diagrams, not final images.</footer></div></body></html>')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("plan", help="path to plan.json")
    ap.add_argument("-o", "--out", help="output HTML path (default: director-board.html next to the plan)")
    args = ap.parse_args()
    src = Path(args.plan)
    try:
        plan = json.loads(src.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        sys.exit(f"plan.json is not valid JSON: {e}")
    out = Path(args.out) if args.out else src.with_name("director-board.html")
    out.write_text(build(plan), encoding="utf-8")
    shots = as_list(plan.get("shots"))
    print(f"wrote {out} ({len(shots)} shots)")
    for w in WARNINGS:
        print(f"warning: {w}")


if __name__ == "__main__":
    main()
