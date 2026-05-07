#!/usr/bin/env python3
"""
批量整理 portfolio-data.js 的 tag：
1. 按 category 字段补全大类 tag（后处理 / 工具 / Houdini / 图形学）
2. 删除冗余/过度细节的 tag（单品专属、无过滤价值的描述词）
3. 合并同义 tag（如 卡通渲染→NPR，曲面细分→Tessellation 等）
"""

import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC  = ROOT / "js" / "portfolio-data.js"

# ── 1. 按 category 需要强制添加的大类 tag ────────────────────
CATEGORY_TAGS = {
    "postprocess": "后处理",
    "tools":       "工具",
    "houdini":     "Houdini",
    "graphics":    "图形学",
}

# ── 2. 要删除的冗余 tag（过于细节、单品专属、无筛选价值）─────
REMOVE_TAGS = {
    # 单品游戏/场景专属
    "武器", "时装", "道具", "天刀", "城市场景",
    # 描述过于具体，不用于筛选
    "能量球", "玉石", "旧照片", "星空", "裂缝", "亮度",
    # 与其他 tag 重复/多余
    "特效材质",   # 太宽泛
    "模拟",       # 太宽泛，已有"流体模拟""物理模拟"
    "角色渲染",   # 原分类，不需要出现在 tag 里
}

# ── 3. 同义合并：把 key 替换为 value ────────────────────────
MERGE_TAGS = {
    "卡通渲染":  "NPR",
    "次表面散射": "SSS",
    "描边":      "Outline",
    "粒子":      "Particle",
    "遮罩":      "Mask",
    "序列帧":    "Flipbook",
    "噪声":      "Noise",
    "散布":      "Procedural",
    "程序化":    "Procedural",
    "程序化纹理": "Procedural",
    "程序化建模": "Procedural",
}

# ── 读取文件 ─────────────────────────────────────────────────
txt   = SRC.read_text(encoding="utf-8")
match = re.search(r'(const PORTFOLIO\s*=\s*)(\[.*?\])(;)', txt, re.S)
if not match:
    raise RuntimeError("未找到 PORTFOLIO 数组")

prefix, raw_json, suffix = match.group(1), match.group(2), match.group(3)
data = json.loads(raw_json)

# ── 处理每个作品 ─────────────────────────────────────────────
stats = {"added": 0, "removed": 0, "merged": 0}

for item in data:
    tags = item.get("tags", [])

    # (a) 同义合并
    new_tags = []
    for t in tags:
        if t in MERGE_TAGS:
            replacement = MERGE_TAGS[t]
            if replacement not in new_tags:
                new_tags.append(replacement)
            stats["merged"] += 1
        else:
            new_tags.append(t)
    tags = new_tags

    # (b) 删除冗余
    before = len(tags)
    tags = [t for t in tags if t not in REMOVE_TAGS]
    stats["removed"] += before - len(tags)

    # (c) 按 category 补全大类 tag
    cat = item.get("category", "")
    # Houdini id 前缀也补 Houdini tag
    if item.get("id", "").startswith("houdini-"):
        cat = "houdini"
    broad = CATEGORY_TAGS.get(cat)
    if broad and broad not in tags:
        tags.insert(0, broad)   # 放在最前面
        stats["added"] += 1

    # 去重保序
    seen = set()
    deduped = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            deduped.append(t)

    item["tags"] = deduped

# ── 写回文件 ─────────────────────────────────────────────────
new_json = json.dumps(data, ensure_ascii=False, indent=2)
new_txt  = txt[:match.start(2)] + new_json + txt[match.end(2):]
SRC.write_text(new_txt, encoding="utf-8")

print(f"✅ 处理完成：补全大类 tag +{stats['added']}，"
      f"删除冗余 -{stats['removed']}，合并同义 ~{stats['merged']}")
