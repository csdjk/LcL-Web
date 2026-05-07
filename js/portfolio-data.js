const PORTFOLIO = [
  {
    "id": "genshin",
    "category": "character",
    "categoryLabel": "角色渲染",
    "size": "featured",
    "title": "原神角色渲染",
    "titleEn": "Genshin Impact Character Rendering",
    "desc": "逆向分析并复刻《原神》角色渲染绿植，实现SDF面部阴影、多pass描边、各向异性头发、Ramp光照等效果。",
    "cover": null,
    "primaryVideo": "assets/videos/genshin_demo.mp4",
    "webDemo": "demos/genshin/",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/genshin_demo.mp4",
        "label": "演示视频"
      }
    ],
    "links": [
      {
        "label": "Web Demo",
        "url": "demos/genshin/",
        "icon": "globe"
      }
    ],
    "tags": [
      "Unity",
      "URP",
      "NPR"
    ],
    "featured": true
  },
  {
    "id": "hsr",
    "size": "featured",
    "title": "崩坏·星穹铁道角色渲染",
    "titleEn": "Honkai Star Rail Character Rendering",
    "desc": "逆向复刻《崩坏：星穹铁道》角色渲染，含镜浅、银狼、饮月等角色的金属、皮肤、头发材质及丰富后处理效果。",
    "primaryVideo": "assets/videos/hsr_demo.mp4",
    "webDemo": "demos/starrail/",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/hsr_demo.mp4",
        "label": "演示视频"
      }
    ],
    "links": [
      {
        "label": "Web Demo",
        "url": "demos/starrail/",
        "icon": "globe"
      },
      {
        "label": "知乎分析",
        "url": "https://zhuanlan.zhihu.com/p/693831511",
        "icon": "article"
      }
    ],
    "tags": [
      "Unity",
      "URP",
      "NPR"
    ],
    "featured": true
  },
  {
    "id": "water",
    "size": "featured",
    "title": "风格化水渲染",
    "titleEn": "Stylized Water Rendering",
    "desc": "实现风格化水面着色，含法线扰动、深浅水色渐变、焦散、泡沫线、水下折射及动态交互。",
    "primaryVideo": "assets/videos/water_demo.mp4",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/water_demo.mp4",
        "label": "演示视频 1"
      },
      {
        "type": "video",
        "src": "assets/videos/water_demo2.mp4",
        "label": "演示视频 2"
      }
    ],
    "links": [],
    "tags": [
      "URP",
      "Water"
    ],
    "featured": false
  },
  {
    "id": "g136_jinyuhu",
    "size": "featured",
    "title": "G136 · 金玉葫芦材质",
    "titleEn": "G136 In-Game — Golden Jade Gourd Material",
    "desc": "游戏项目实际落地，金玉葫芦道具材质制作录屏。含金属质感、玉石次表面散射、流光动态纹理等效果。",
    "primaryVideo": "assets/videos/g136_jinyuhu.mp4",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/g136_jinyuhu.mp4",
        "label": "金玉葫芦演示"
      }
    ],
    "links": [],
    "tags": [
      "Game",
      "SSS"
    ],
    "featured": false
  },
  {
    "id": "g136_jiuxiao",
    "size": "video",
    "title": "G136 · 九霄龙吟时装材质",
    "titleEn": "G136 In-Game — Jiuxiao Dragon Weapon FX",
    "desc": "游戏项目实际落地，九霄龙吟时装材质",
    "primaryVideo": "assets/videos/g136_jiuxiao.mp4",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/g136_jiuxiao.mp4",
        "label": "九霄龙吟演示"
      }
    ],
    "links": [],
    "tags": [
      "Game"
    ],
    "featured": false
  },
  {
    "id": "g136_kongque",
    "category": "character",
    "categoryLabel": "角色渲染",
    "size": "video",
    "title": "G136 · 孔雀时装材质",
    "titleEn": "G136 In-Game — Peacock Costume Material",
    "desc": "游戏项目实际落地，孔雀时装角色材质制作录屏。含虹彩羽毛各向异性、镭射布料、薄膜干涉等效果。",
    "cover": null,
    "primaryVideo": "assets/videos/g136_kongque.mp4",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/g136_kongque.mp4",
        "label": "孔雀时装演示"
      }
    ],
    "links": [],
    "tags": [
      "Game",
      "各向异性",
      "镭射"
    ]
  },
  {
    "id": "urp-rain",
    "category": "material",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "雨水涟漪效果",
    "titleEn": "Rain Ripple Effect",
    "desc": "雨水涟漪材质",
    "gallery": [
      {
        "type": "image",
        "label": "对比",
        "src": "assets/images-animated/urp_rain.avif"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP"
    ],
    "featured": false
  },
  {
    "id": "urp-rain-tiandao",
    "category": "material",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "Rain 天刀方案",
    "titleEn": "Rain - Tiandao Style",
    "desc": "参考《天涯明月刀》的雨效实现方案，结合屏幕空间涟漪与粒子降雨，在移动端高效呈现真实感雨天氛围。",
    "cover": "assets/images-animated/urp_rain_tiandao.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_rain_tiandao.avif",
        "label": "Rain 天刀方案"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "shader-water-interact",
    "category": "material",
    "subCategory": "mat-water",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "水面交互",
    "titleEn": "Interactive Water Surface",
    "desc": "角色与水面实时交互效果，基于RenderTexture记录扰动信息，动态生成涟漪扩散与水波位移，还原真实踏水感。",
    "cover": "assets/images-animated/shader_water_interact.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_water_interact.avif",
        "label": "水面交互"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Water"
    ]
  },
  {
    "id": "shader-cartoonwater",
    "category": "material",
    "subCategory": "mat-water",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "卡通水面",
    "titleEn": "Cartoon Water Shader",
    "desc": "风格化卡通水面材质，含程序化水波纹理、深浅水色渐变、岸边泡沫线与FlowMap流动，还原NPR水面要素。",
    "cover": "assets/images-animated/shader_cartoonwater.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_cartoonwater.avif",
        "label": "Cartoon Water"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "NPR",
      "Water"
    ]
  },
  {
    "id": "shader-wave",
    "category": "postprocess",
    "subCategory": "mat-water",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "波浪效果",
    "titleEn": "Ocean Wave Effect",
    "desc": "基于Gerstner Wave的多层叠加波浪模拟，顶点着色器驱动海面起伏，配合法线混合与泡沫遮罩呈现真实海浪质感。",
    "cover": "assets/images-animated/shader_wave.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_wave.avif",
        "label": "波浪效果"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "后处理",
      "Unity"
    ]
  },
  {
    "id": "shader-water-wave",
    "category": "material",
    "subCategory": "mat-water",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "屏幕波纹效果",
    "titleEn": "Screen Water Wave Effect",
    "desc": "基于GrabPass的屏幕空间水面波纹后处理，通过法线扰动折射背景，模拟水面晃动的折光涟漪感。",
    "cover": "assets/images-animated/shader_water_wave.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_water_wave.avif",
        "label": "水面波纹"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-gpu-grass",
    "category": "material",
    "subCategory": "mat-vegetation",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "风格化草地交互",
    "titleEn": "GPU Stylized Interactive Grass",
    "desc": "基于GPU Instancing与几何着色器的大规模草地渲染，支持风力弯曲、角色交互压倒与LOD分级，性能高效。",
    "cover": "assets/images-animated/shader_gpu_grass.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_gpu_grass.avif",
        "label": "GPU Grass"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "GPU Instancing"
    ]
  },
  {
    "id": "shader-snow-interact",
    "category": "material",
    "subCategory": "mat-vegetation",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "雪地交互",
    "titleEn": "Interactive Snow (Tessellation)",
    "desc": "基于曲面细分（Tessellation）的雪地交互效果，角色行走时动态压出脚印凹坑，配合法线扰动还原真实积雪质感。",
    "cover": "assets/images-animated/shader_snow_interact.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_snow_interact.avif",
        "label": "雪地交互"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "urp-fur",
    "category": "material",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "毛发渲染 Shell Fur",
    "titleEn": "Shell-based Fur Rendering",
    "desc": "基于Shell层叠技术的毛发渲染方案，多Pass剥离毛皮层级，模拟真实毛发体积与各向异性高光。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/urp_fur.webp",
        "label": "毛发"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP"
    ],
    "featured": false
  },
  {
    "id": "urp-vat",
    "category": "anim",
    "categoryLabel": "动画",
    "size": "standard",
    "title": "VAT-RBD 顶点动画贴图",
    "titleEn": "Vertex Animation Texture (Rigid Body)",
    "desc": "将Houdini RBD刚体破碎动画烘焙至贴图，运行时通过顶点采样还原动画，实现海量动态破碎而无需骨骼。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_vat.avif",
        "label": "VAT-RBD"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP",
      "VAT",
      "Houdini"
    ],
    "featured": false
  },
  {
    "id": "shader-pbr",
    "category": "material",
    "subCategory": "mat-pbr",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "自定义 PBR",
    "titleEn": "Custom Physically-Based Rendering",
    "desc": "从零实现基于Cook-Torrance BRDF的物理着色，含GGX法线分布、Smith几何遮蔽、Fresnel-Schlick近似，完整还原工业级PBR管线。",
    "cover": "assets/images/shader_pbr.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_pbr.webp",
        "label": "PBR"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "PBR"
    ]
  },
  {
    "id": "shader-pbr-aniso",
    "size": "standard",
    "title": "各向异性",
    "titleEn": "Anisotropic",
    "desc": "在PBR框架下扩展各向异性高光，采用Kajiya-Kay与Ward模型，模拟拉丝金属、头发丝绒等具有方向性高光的材质。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_pbr_aniso.webp",
        "label": "各向异性PBR"
      },
      {
        "type": "image",
        "src": "assets/images/shader_aniso.webp",
        "label": "各向异性高光"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "PBR",
      "各向异性"
    ],
    "featured": false
  },
  {
    "id": "shader-sss",
    "size": "standard",
    "title": "次表面散射 SSS",
    "titleEn": "Sub-Surface Scattering",
    "desc": "多种SSS实现方案：预积分皮肤SSS、PBR皮肤扩展、Shader Graph节点SSS，真实模拟皮肤/蜡烛/玉石等半透介质。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_sss.webp",
        "label": "SSS"
      },
      {
        "type": "image",
        "src": "assets/images/shader_sss2.webp",
        "label": "SSS 2"
      },
      {
        "type": "image",
        "src": "assets/images/shader_pbr_skin.webp",
        "label": "皮肤PBR"
      },
      {
        "type": "image",
        "src": "assets/images/shader_sg_sss.webp",
        "label": "Shader Graph SSS"
      },
      {
        "type": "image",
        "src": "assets/images/shader_screen_sss.webp",
        "label": "屏幕空间SSS"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "SSS"
    ],
    "featured": false
  },
  {
    "id": "shader-film-interference",
    "category": "material",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "薄膜干涉",
    "titleEn": "Thin-Film Interference",
    "desc": "薄膜干涉效果，模拟肥皂泡、镭射布料、彩虹油膜等多彩渐变光学现象。",
    "gallery": [
      {
        "type": "grid",
        "label": "薄膜干涉 1",
        "images": [
          {
            "src": "assets/images/shader_film_interference2.webp",
            "label": ""
          },
          {
            "src": "assets/images/shader_film_interference1.webp",
            "label": ""
          }
        ]
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "镭射"
    ],
    "featured": false
  },
  {
    "id": "shader-toon",
    "category": "material",
    "subCategory": "mat-stylized",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "卡通渲染 Toon Shading",
    "titleEn": "Toon Shading",
    "desc": "NPR卡通着色实现，含阶梯化漫反射、Rim光、描边等要素，可与角色渲染管线灵活组合。",
    "cover": "assets/images/shader_toon.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_toon.webp",
        "label": "Toon Shading"
      },
      {
        "type": "image",
        "src": "assets/images/shader_character.webp",
        "label": "角色着色"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_character.avif",
        "label": "角色着色动画"
      },
      {
        "type": "image",
        "src": "assets/images/shader_original2.webp",
        "label": "参考对比"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "NPR"
    ]
  },
  {
    "id": "shader-outlines",
    "category": "material",
    "subCategory": "mat-stylized",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "多种描边方案",
    "titleEn": "Outline Techniques",
    "desc": "汇集菲涅尔描边、法线扩展描边（含遮挡处理）等多种描边实现，覆盖NPR渲染中常见的轮廓线需求。",
    "cover": "assets/images-animated/shader_fresnel_outline.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_fresnel_outline.avif",
        "label": "菲涅尔描边"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_normal_outline.avif",
        "label": "法线描边"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_normal_outline_occ.avif",
        "label": "法线描边(遮挡)"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "NPR",
      "Outline"
    ]
  },
  {
    "id": "urp-cloud",
    "category": "material",
    "subCategory": "mat-stylized",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "模型云",
    "titleEn": "Model-based Cloud",
    "desc": "基于体积/Mesh模型的卡通风格云朵渲染，模拟次表面散射与边缘光，适合写实/二次元天空场景。",
    "cover": "assets/images-animated/urp_cloud.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_cloud.avif",
        "label": "模型云"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP",
      "NPR"
    ]
  },
  {
    "id": "urp-ice",
    "category": "material",
    "subCategory": "mat-stylized",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "冰冻效果",
    "titleEn": "Ice Freezing Effect",
    "desc": "动态冰冻覆盖效果，基于World Position与噪声渐变控制冰层生长，搭配菲涅尔与法线扰动表现冰晶质感。",
    "cover": "assets/images-animated/urp_ice2.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_ice2.avif",
        "label": "冰冻动态"
      },
      {
        "type": "image",
        "src": "assets/images/urp_ice.webp",
        "label": "冰晶静态"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP"
    ]
  },
  {
    "id": "shader-reflection",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "反射与折射",
    "titleEn": "Reflection & Refraction",
    "desc": "基于Cubemap与GrabPass的反射/折射效果，含Snell定律折射、菲涅尔混合，模拟玻璃球与水晶质感。",
    "cover": "assets/images/shader_reflection.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_reflection.webp",
        "label": "Reflection"
      },
      {
        "type": "image",
        "src": "assets/images/shader_reflection2.webp",
        "label": "Refraction"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-glass",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "风格化玻璃",
    "titleEn": "Stylized Glass",
    "desc": "风格化玻璃Shader，含背景扭曲、菲涅尔边缘光与多层高光叠加，模拟卡通/写实风格透明玻璃质感。",
    "cover": "assets/images/shader_glass.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_glass.webp",
        "label": "Glass"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Glass"
    ]
  },
  {
    "id": "shader-liquid-bottle",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "液体瓶",
    "titleEn": "Liquid Bottle",
    "desc": "液体瓶材质模拟晃动时液面动态变化与气泡漂浮，基于世界空间高度裁切与法线扰动实现真实液体感。",
    "cover": "assets/images-animated/shader_liquid_bottle.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_liquid_bottle.avif",
        "label": "液体瓶"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-interior",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "Interior Mapping 室内映射",
    "titleEn": "Interior Mapping",
    "desc": "通过Cube贴图与切线空间运算在单平面上模拟室内房间，无需建模即可营造大量楼宇内饰，并扩展2D视角室内版本。",
    "cover": "assets/images-animated/shader_interior.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_interior.avif",
        "label": "Interior (Cubemap)"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_interior_cubemap.avif",
        "label": "Interior Cubemap"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_interior_2d.avif",
        "label": "Interior 2D"
      },
      {
        "type": "image",
        "src": "assets/images/shader_interior_2dview1.webp",
        "label": "2D视角 1"
      },
      {
        "type": "image",
        "src": "assets/images/shader_interior_2dview2.webp",
        "label": "2D视角 2"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "urp-parallax",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "Parallax 视差映射",
    "titleEn": "Parallax Occlusion Mapping",
    "desc": "通过高度图与视线步进模拟表面凹凸感的视差映射（POM），在平面上呈现深度感极强的砖墙、地板等细节。",
    "cover": "assets/images/urp_parallax.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/urp_parallax.webp",
        "label": "Parallax Mapping"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP"
    ]
  },
  {
    "id": "shader-triplanar",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "Triplanar 三向投影",
    "titleEn": "Triplanar Mapping",
    "desc": "三向投影贴图，无需UV即可在任意地形表面自然贴合纹理，适用于程序化地形、岩石等复杂模型。",
    "cover": "assets/images/shader_triplanar1.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_triplanar1.webp",
        "label": "Triplanar 1"
      },
      {
        "type": "image",
        "src": "assets/images/shader_triplanar2.webp",
        "label": "Triplanar 2"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP"
    ]
  },
  {
    "id": "shader-shadow",
    "category": "material",
    "subCategory": "mat-other",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "阴影算法集",
    "titleEn": "Shadow Algorithms",
    "desc": "ShadowMap基础、PCF软化、Poisson盘采样、PCSS接触硬化及Alpha透明阴影等多种阴影技术实现与对比。",
    "cover": "assets/images/shader_pcss.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_shadowmap.webp",
        "label": "Shadow Map"
      },
      {
        "type": "image",
        "src": "assets/images/shader_pcf.webp",
        "label": "PCF"
      },
      {
        "type": "image",
        "src": "assets/images/shader_pcf_poisson.webp",
        "label": "PCF Poisson"
      },
      {
        "type": "image",
        "src": "assets/images/shader_pcss.webp",
        "label": "PCSS"
      },
      {
        "type": "image",
        "src": "assets/images/shader_alpha_shadow.webp",
        "label": "Alpha透明阴影"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Shadow"
    ]
  },
  {
    "id": "shader-dissolve",
    "size": "standard",
    "title": "溶解效果",
    "titleEn": "Dissolve Effect",
    "desc": "基于噪声贴图的动态溶解Shader，支持溶解边缘发光、方向性溶解与UI溶解，广泛用于角色死亡、技能释放等场景。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_dissolve.avif",
        "label": "溶解 1"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_dissolve2.avif",
        "label": "方向溶解"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_ui_dissolve.avif",
        "label": "UI溶解"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "UI"
    ],
    "featured": false
  },
  {
    "id": "shader-energyball",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "能量球特效",
    "titleEn": "Energy Ball VFX",
    "desc": "科幻风格能量球Shader，结合菲涅尔轮廓光、噪声扰动UV、内部流动纹理，呈现脉动能量感。",
    "cover": "assets/images-animated/shader_energyball.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_energyball.avif",
        "label": "Energy Ball"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-cloth",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "布料物理模拟",
    "titleEn": "Cloth Physics Simulation",
    "desc": "基于质点-弹簧模型的布料物理模拟，结合GPU计算并行求解约束，实时表现风力与碰撞响应。",
    "cover": "assets/images-animated/shader_cloth.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_cloth.avif",
        "label": "布料模拟"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-rope",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "Bezier 绳索",
    "titleEn": "Bezier Rope",
    "desc": "基于贝塞尔曲线的程序化绳索Mesh生成，沿曲线挤出几何体，支持动态悬挂、流光等交互形态。",
    "cover": "assets/images-animated/shader_rope.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_rope.avif",
        "label": "绳索"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-bezier-mesh",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "Bezier 曲线网格",
    "titleEn": "Bezier Curve Mesh",
    "desc": "沿贝塞尔曲线路径挤出任意截面形状生成连续网格，可用于道路、轨道、管道等程序化建模场景。",
    "cover": "assets/images-animated/shader_bezier.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_bezier.avif",
        "label": "Bezier Mesh"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "tools-brush",
    "size": "standard",
    "title": "笔刷",
    "titleEn": "Brush",
    "desc": "笔刷工具",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_brush_world.avif",
        "label": "笔刷世界空间"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "工具"
    ],
    "featured": false
  },
  {
    "id": "shader-flipbook",
    "size": "standard",
    "title": "翻书效果",
    "titleEn": "Flipbook ",
    "desc": "",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_flipbook.avif",
        "label": "Flipbook"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ],
    "featured": false
  },
  {
    "id": "shader-mask",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "遮罩效果集",
    "titleEn": "Mask Effects",
    "desc": "汇集球形遮罩、2D遮罩、Box遮罩等多种遮罩工具，用于光照区域限定、交互区域可视化等效果。",
    "cover": "assets/images-animated/shader_mask.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_mask.avif",
        "label": "Mask"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_mask2.avif",
        "label": "Mask 2"
      },
      {
        "type": "image",
        "src": "assets/images/shader_sphere_mask.webp",
        "label": "球形遮罩"
      },
      {
        "type": "image",
        "src": "assets/images/shader_2d_mask.webp",
        "label": "2D遮罩"
      },
      {
        "type": "image",
        "src": "assets/images/shader_box_mask.webp",
        "label": "Box遮罩"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-geo",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "几何着色器效果",
    "titleEn": "Geometry Shader Effects",
    "desc": "利用Geometry Shader生成程序化几何体和粒子，含自定义基元生成与GPU粒子系统，展示几何管线扩展能力。",
    "cover": "assets/images-animated/shader_geo_particle.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_geo_particle.avif",
        "label": "几何粒子"
      },
      {
        "type": "image",
        "src": "assets/images/shader_geo_primitive.webp",
        "label": "几何基元"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity"
    ]
  },
  {
    "id": "shader-ui",
    "category": "material",
    "subCategory": "mat-fx",
    "categoryLabel": "普通材质",
    "size": "standard",
    "title": "UI 特效",
    "titleEn": "UI Shader Effects",
    "desc": "UI层Shader效果集，含旧照片滤镜（噪点、褪色、划痕）、UI溶解特效等，为HUD界面增添艺术表现力。",
    "cover": "assets/images/shader_ui_oldphoto.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_ui_oldphoto.webp",
        "label": "旧照片"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "UI"
    ]
  },
  {
    "id": "urp-ssr",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "SSR 屏幕空间反射",
    "titleEn": "Screen Space Reflection",
    "desc": "基于屏幕空间的反射技术，通过深度图与法线图实时计算反射结果，适用于水面、湿润地面等场景。",
    "cover": "assets/images-animated/urp_ssr.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_ssr.avif",
        "label": "SSR"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP",
      "后处理"
    ]
  },
  {
    "id": "urp-sspr",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "SSPR 平面反射",
    "titleEn": "Screen Space Planar Reflection",
    "desc": "基于Compute Shader的屏幕空间平面反射，性能优于传统镜面相机方案，常用于水面/地面镜面反射。",
    "cover": "assets/images-animated/urp_sspr.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_sspr.avif",
        "label": "SSPR"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "后处理",
      "URP"
    ]
  },
  {
    "id": "urp-hbao",
    "size": "standard",
    "title": "HBAO 环境光遮蔽",
    "titleEn": "Horizon-Based Ambient Occlusion",
    "desc": "Horizon-Based AO实现屏幕空间环境光遮蔽，相比SSAO更精确还原物体接触阴影，提升画面层次感。",
    "gallery": [
      {
        "type": "compare",
        "label": "HBAO",
        "before": {
          "src": "assets/images/urp_hbao0.webp",
          "label": "前"
        },
        "after": {
          "src": "assets/images/urp_hbao.webp",
          "label": "后"
        }
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP",
      "HBAO",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "urp-taa",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "TAA 时间抗锯齿",
    "titleEn": "Temporal Anti-Aliasing",
    "desc": "基于历史帧重投影的时间抗锯齿方案，通过Jitter与速度缓冲消除锯齿，画面平滑稳定。",
    "cover": "assets/images/urp_taa.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/urp_taa.webp",
        "label": "TAA"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "后处理",
      "URP",
      "TAA",
      "抗锯齿"
    ]
  },
  {
    "id": "shader-bloom",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "Bloom 泛光",
    "titleEn": "Bloom Post-Processing",
    "desc": "自定义Bloom泛光后处理，基于亮度阈值提取发光区域后多级降采样再混合，还原高亮溢出的光晕感。",
    "cover": "assets/images/shader_bloom.webp",
    "gallery": [
      {
        "type": "compare",
        "label": "Bloom",
        "before": {
          "src": "assets/images/shader_bloom.webp",
          "label": "前"
        },
        "after": {
          "src": "assets/images/shader_bloom2.webp",
          "label": "后"
        }
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "urp-volume-light",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "Fast Volume Light 体积光",
    "titleEn": "Fast Volumetric Light",
    "desc": "后处理实现的快速体积光方案，适合移动端性能预算，通过射线步进与散射积分模拟丁达尔光效。",
    "cover": "assets/images-animated/urp_volume_light.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/urp_volume_light.avif",
        "label": "体积光"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "后处理",
      "URP"
    ]
  },
  {
    "id": "urp-starfield-crack",
    "size": "video",
    "title": "星空裂缝",
    "titleEn": "Starfield Crack Effect",
    "desc": "科幻风格星空裂缝特效，结合噪声扰动、程序化裂纹生长与粒子光晕，营造宇宙撕裂的震撼视觉。",
    "gallery": [
      {
        "type": "video",
        "src": "assets/videos/urp_starfield_crack.mp4",
        "label": "星空裂缝演示"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP",
      "特效"
    ],
    "featured": false
  },
  {
    "id": "shader-box-blur",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "Box Blur",
    "titleEn": "Box Blur",
    "desc": "最基础的均值模糊算法，对周围像素等权均值采样，实现快速低成本的全屏模糊，适合低性能需求场景。",
    "cover": "assets/images/shader_box_blur.webp",
    "gallery": [
      {
        "type": "compare",
        "label": "Box Blur",
        "before": {
          "src": "assets/images/shader_original2.webp",
          "label": "前"
        },
        "after": {
          "src": "assets/images/shader_box_blur.webp",
          "label": "后"
        }
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Blur",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "shader-gauss-blur",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "Gaussian Blur",
    "titleEn": "Gaussian Blur",
    "desc": "基于高斯核的双Pass模糊，先横向再纵向卷积，兼顾质量与性能，是后处理管线中最常用的模糊方案。",
    "gallery": [
      {
        "type": "compare",
        "label": "Gaussian Blur 2",
        "before": {
          "src": "assets/images/shader_original2.webp",
          "label": "前"
        },
        "after": {
          "src": "assets/images/shader_gauss_blur2.webp",
          "label": "后"
        }
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Blur",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "shader-radial-blur",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "Radial Blur 径向模糊",
    "titleEn": "Radial Blur",
    "desc": "以屏幕中心为起点向外放射采样，产生镜头推拉感与爆炸冲击感，常用于技能释放、过场转场等视觉特效。",
    "gallery": [
      {
        "type": "compare",
        "label": "Radial Blur",
        "before": {
          "src": "assets/images/shader_original2.webp",
          "label": "前"
        },
        "after": {
          "src": "assets/images/shader_radial_blur.webp",
          "label": "后"
        }
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Blur",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "shader-motion-blur",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "Motion Blur 运动模糊",
    "titleEn": "Motion Blur",
    "desc": "基于速度缓冲（Velocity Buffer）的屏幕空间运动模糊，根据物体运动向量对像素进行方向性拖影采样，模拟高速运动的视觉残影。",
    "cover": "assets/images-animated/shader_motion_blur.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_motion_blur.avif",
        "label": "Motion Blur"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Blur",
      "后处理"
    ]
  },
  {
    "id": "shader-edge-detect",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "边缘检测",
    "titleEn": "Edge Detection",
    "desc": "基于Sobel/Roberts算子的屏幕空间边缘检测，可生成卡通轮廓线或水墨风描边，并支持遮挡信息融合。",
    "cover": "assets/images-animated/shader_edge_detection.avif",
    "gallery": [
      {
        "type": "grid",
        "label": "边缘检测对比",
        "images": [
          {
            "src": "assets/images-animated/shader_edge_detection.avif",
            "label": "边缘检测动态"
          },
          {
            "src": "assets/images/shader_edge_detect.webp",
            "label": "边缘检测"
          },
          {
            "src": "assets/images/shader_edge_extract.webp",
            "label": "边缘提取"
          }
        ]
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "shader-pp-outline",
    "size": "standard",
    "title": "后处理描边",
    "titleEn": "Post-Process Outline",
    "desc": "后处理描边",
    "gallery": [
      {
        "type": "grid",
        "label": "描边效果对比",
        "images": [
          {
            "src": "assets/images-animated/shader_pp_outline.avif",
            "label": "后处理描边"
          },
          {
            "src": "assets/images-animated/shader_pp_outline_occ.avif",
            "label": "后处理描边(遮挡)"
          },
          {
            "src": "assets/images-animated/shader_screen_outline.avif",
            "label": "后处理描边"
          }
        ]
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "Outline",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "shader-depth-fx",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "深度图与深度扫描",
    "titleEn": "Depth Map & Depth Scan",
    "desc": "利用深度缓冲实现深度图可视化，以及基于深度的扫描波效果（科幻雷达感）。",
    "cover": "assets/images-animated/shader_depth_scan.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_depth_scan.avif",
        "label": "深度扫描"
      },
      {
        "type": "image",
        "src": "assets/images/shader_depth_map.webp",
        "label": "深度图"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "shader-zoom-fx",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "变焦效果",
    "titleEn": "Zoom Effect",
    "desc": "基于深度缓冲的放大镜/变焦后处理效果，可对屏幕局部区域进行实时缩放。",
    "cover": "assets/images-animated/shader_zoom.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_zoom.avif",
        "label": "变焦效果"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "shader-screen-sss",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "屏幕空间 SSS",
    "titleEn": "Screen Space Sub-Surface Scattering",
    "desc": "屏幕空间次表面散射后处理，在不修改材质的前提下为全场景皮肤区域添加散射晕染效果，兼容URP渲染管线。",
    "cover": "assets/images/shader_screen_sss.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_screen_sss.webp",
        "label": "屏幕空间SSS"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "SSS",
      "后处理"
    ]
  },
  {
    "id": "urp-decal",
    "size": "standard",
    "title": "Screen Decal 屏幕贴花",
    "titleEn": "Screen Space Decal",
    "desc": "基于深度重建的屏幕空间贴花系统，将弹孔、血迹、涂鸦等贴花精准投射到任意几何表面。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/urp_decal.webp",
        "label": "Screen Decal"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "URP"
    ],
    "featured": false
  },
  {
    "id": "shader-bad-tv",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "故障艺术 Glitch",
    "titleEn": "Bad TV / Glitch Effect",
    "desc": "模拟信号干扰的故障艺术后处理，含扫描线噪波、色差分离、块状错位等多重叠加，营造赛博朋克屏幕感。",
    "cover": "assets/images-animated/shader_bad_tv.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/shader_bad_tv.avif",
        "label": "Bad TV"
      },
      {
        "type": "image",
        "src": "assets/images-animated/shader_bad_tv2.avif",
        "label": "Bad TV 2"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "shader-brightness",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "亮度 / 对比度调节",
    "titleEn": "Brightness & Contrast",
    "desc": "基于后处理的全屏亮度与对比度调节效果，支持实时预览，可用于昼夜切换、场景氛围渲染等需求。",
    "cover": "assets/images/shader_brightness.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_brightness.webp",
        "label": "亮度/对比度"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "urp-oit",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "OIT 顺序无关透明",
    "titleEn": "Order Independent Transparency",
    "desc": "对比Alpha Blend、Depth Peeling与Weighted Blend三种OIT方案，解决透明物体排序问题，实现正确的透明度叠加。",
    "cover": "assets/images/urp_oit_depthpeeling.webp",
    "gallery": [
      {
        "type": "grid",
        "label": "简单场景对比",
        "images": [
          {
            "src": "assets/images/urp_oit_alphablend.webp",
            "label": "Alpha Blend"
          },
          {
            "src": "assets/images/urp_oit_depthpeeling.webp",
            "label": "Depth Peeling"
          },
          {
            "src": "assets/images/urp_oit_weightedbend.webp",
            "label": "Weighted Blend"
          }
        ]
      },
      {
        "type": "grid",
        "label": "复杂场景对比",
        "images": [
          {
            "src": "assets/images/urp_oit_scene_alphablend.webp",
            "label": "场景 Alpha Blend"
          },
          {
            "src": "assets/images/urp_oit_scene_depthpeeling.webp",
            "label": "场景 Depth Peeling"
          },
          {
            "src": "assets/images/urp_oit_scene_weighted.webp",
            "label": "场景 Weighted Blend"
          }
        ]
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnURP",
        "icon": "github"
      }
    ],
    "tags": [
      "后处理",
      "URP",
      "OIT"
    ]
  },
  {
    "id": "shader-cmd-dof",
    "size": "standard",
    "title": "景深 DOF",
    "titleEn": "Depth of Field (CommandBuffer)",
    "desc": "利用 CommandBuffer 自定义渲染 Pass，实现景深（DOF）效果。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_cmd_dof.webp",
        "label": "DOF 景深"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ],
    "featured": false
  },
  {
    "id": "shader-cmd-bake",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "烘焙 RT",
    "titleEn": "Bake Render Texture (CommandBuffer)",
    "desc": "利用 CommandBuffer 自定义渲染 Pass，将场景内容烘焙到 RenderTexture 中。",
    "cover": "assets/images/shader_cmd_bake1.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_cmd_bake1.webp",
        "label": "烘焙 RT 1"
      },
      {
        "type": "image",
        "src": "assets/images/shader_cmd_bake2.webp",
        "label": "烘焙 RT 2"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "shader-cmd-local-pp",
    "category": "postprocess",
    "categoryLabel": "后处理",
    "size": "standard",
    "title": "局部后处理",
    "titleEn": "Local Post Processing (CommandBuffer)",
    "desc": "利用 CommandBuffer 自定义渲染 Pass，实现仅对指定区域或对象生效的局部后处理效果。",
    "cover": "assets/images/shader_cmd_local_pp.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/shader_cmd_local_pp.webp",
        "label": "局部后处理"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LearnUnityShader",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "后处理"
    ]
  },
  {
    "id": "softraster",
    "category": "graphics",
    "categoryLabel": "图形学",
    "size": "standard",
    "title": "软光栅化渲染器",
    "titleEn": "Software Rasterizer",
    "desc": "基于Unity实现的自定义软光栅化渲染器，涵盖背面剔除、视锥裁剪、透视纠正插值、MSAA等核心图形算法。",
    "cover": "assets/images/softraster_1.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/softraster_1.webp",
        "label": "线框模式"
      },
      {
        "type": "image",
        "src": "assets/images/softraster_2.webp",
        "label": "自定义光栅化渲染"
      },
      {
        "type": "image",
        "src": "assets/images/softraster_3.webp",
        "label": "unity内置渲染"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcL-Soft-Render",
        "icon": "github"
      }
    ],
    "tags": [
      "MSAA"
    ],
    "featured": false
  },
  {
    "id": "houdini-water-ripple",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "雨滴水波模拟",
    "titleEn": "Rain Drop Water Ripple",
    "desc": "Houdini 中模拟雨滴打在水面上产生的涟漪扩散效果，基于粒子与流体求解器实现真实的波纹传播与衰减。",
    "cover": "assets/images-animated/1693816134877.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/1693816134877.webp",
        "label": "雨滴水波模拟"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini"
    ]
  },
  {
    "id": "houdini-smoke",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "烟雾模拟",
    "titleEn": "Smoke Simulation",
    "desc": "Houdini 中基于体素的烟雾流体模拟，支持密度、温度、速度等场的交互，可用于游戏特效离线烘焙。",
    "cover": "assets/images-animated/1693821659576.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/1693821659576.webp",
        "label": "烟雾模拟"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini"
    ]
  },
  {
    "id": "houdini-water-wave",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "FFT 海水工具",
    "titleEn": "Water Wave Tools (FFT)",
    "desc": "自定义 HDA：基于 FFT 算法创建无缝循环海水动画，可调节波长、波高、波速、风向等参数，支持导出序列帧法线贴图供 Shader 实时采样。",
    "cover": "assets/images-animated/1693818175779.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/1693818175779.webp",
        "label": "FFT 海水动画"
      },
      {
        "type": "image",
        "src": "assets/images-animated/1693904688049.webp",
        "label": "合成法线贴图 8×8"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini",
      "FFT"
    ]
  },
  {
    "id": "houdini-noise-creator",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "噪声贴图生成器",
    "titleEn": "Noise Creator",
    "desc": "自定义 HDA：在 Houdini COP 中生成多种类型噪声贴图，支持 Perlin、Worley、Voronoi、Simplex 等，可用于游戏材质的程序化纹理制作。",
    "cover": "assets/images/1693828818467.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/1693828818467.webp",
        "label": "多种噪声类型预览"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini"
    ]
  },
  {
    "id": "houdini-gpa-importer",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "GPA 数据导入器",
    "titleEn": "GPA Data Importer",
    "desc": "自定义 HDA：将 Intel GPA 截帧工具导出的 CSV 顶点数据（UV、法线、顶点色等）写回 FBX 模型，解决 GPA 导出 OBJ 丢失顶点属性的问题。",
    "cover": "assets/images/1693972063318.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/1693971844222.webp",
        "label": "CSV 数据格式"
      },
      {
        "type": "image",
        "src": "assets/images/1693972063318.webp",
        "label": "写入 FBX 后效果"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini",
      "工具",
      "逆向分析"
    ]
  },
  {
    "id": "houdini-scatter",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "不重叠散点 / 陨石分布",
    "titleEn": "Non-Overlapping Scatter & Meteorite Distribution",
    "desc": "两个粒子散布 HDA：不重叠散点在 Scatter Align 基础上剔除互相穿插的 Point；陨石分布工具按物理规律生成随机陨石坑阵列，适用于程序化地形装饰。",
    "cover": "assets/images/1704784939634.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/1704784939634.webp",
        "label": "不重叠撒点"
      },
      {
        "type": "image",
        "src": "assets/images/1704786399736.webp",
        "label": "陨石分布"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini"
    ]
  },
  {
    "id": "houdini-volume-texture",
    "category": "houdini",
    "categoryLabel": "Houdini",
    "size": "standard",
    "title": "3D Texture → Volume 导入",
    "titleEn": "Import 3D Texture to Volume",
    "desc": "自定义 HDA：将 3D Texture 序列帧导入 Houdini 并转换为 Volume 体数据，方便在 Karma/Mantra 中渲染或进一步处理 VDB 体积。",
    "cover": "assets/images/1704787356247.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/1704787356247.webp",
        "label": "3D Texture 导入节点"
      },
      {
        "type": "image",
        "src": "assets/images/1704787556062.webp",
        "label": "转换后的 Volume 效果"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini"
    ]
  },
  {
    "id": "houdini-rock-generator",
    "size": "standard",
    "title": "石头生成器",
    "titleEn": "Rock Generator",
    "desc": "三档精度石头生成 HDA（Low / Complex / High），通过程序化噪声与布尔运算生成形态各异的石块，支持法线烘焙，适用于游戏场景快速填充。",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/1706519960942.webp",
        "label": "石头生成器预览"
      },
      {
        "type": "image",
        "src": "assets/images-animated/1706522527711.webp",
        "label": "Low 精度生成"
      },
      {
        "type": "image",
        "src": "assets/images-animated/1706521940141.webp",
        "label": "Complex 精度生成"
      },
      {
        "type": "image",
        "src": "assets/images-animated/1706522225385.webp",
        "label": "High 精度生成"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcLLib-for-Houdini",
        "icon": "github"
      }
    ],
    "tags": [
      "Houdini"
    ],
    "featured": false
  },
  {
    "id": "unitytool-shadergui",
    "category": "tools",
    "categoryLabel": "工具",
    "size": "standard",
    "title": "LcLShaderGUI",
    "titleEn": "LcLShaderGUI — Custom Shader Inspector",
    "desc": "自定义 Unity ShaderGUI 扩展，支持无限嵌套可折叠区域、Texture 缩略图、属性默认值重置、Vector Slider、Min/Max 限制、根据 Toggle 显隐属性、切换 Pass 等功能，大幅提升 Shader 参数编辑效率。",
    "cover": "assets/images/unitytool_ShaderGUI.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/unitytool_ShaderGUI.webp",
        "label": "ShaderGUI 面板预览"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcL-Tools-Unity",
        "icon": "github"
      }
    ],
    "tags": [
      "Unity",
      "ShaderGUI",
      "URP",
      "工具"
    ]
  },
  {
    "id": "unitytool-shader-variant",
    "category": "tools",
    "categoryLabel": "工具",
    "size": "standard",
    "title": "Shader 变体收集与剔除工具",
    "titleEn": "Shader Variant Collection & Stripping Tool",
    "desc": "Unity Editor 扩展工具集：变体收集界面可批量扫描场景并生成 ShaderVariantCollection；变体剔除工具基于 IPreprocessShaders 接口，在 Build 时按规则自动剔除冗余变体，显著减少包体大小与加载耗时。",
    "cover": "assets/images/unitytool_1709883622784.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/unitytool_1709885366011.webp",
        "label": "创建配置文件"
      },
      {
        "type": "image",
        "src": "assets/images/unitytool_1709883622784.webp",
        "label": "变体收集界面"
      },
      {
        "type": "image",
        "src": "assets/images/unitytool_1709884816981.webp",
        "label": "变体收集结果"
      },
      {
        "type": "image",
        "src": "assets/images/unitytool_1709883925163.webp",
        "label": "变体剔除工具面板"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcL-Tools-Unity",
        "icon": "github"
      }
    ],
    "tags": [
      "工具",
      "Unity"
    ]
  },
  {
    "id": "unitytool-snapdragon",
    "category": "tools",
    "categoryLabel": "工具",
    "size": "standard",
    "title": "Snapdragon Profiler 截帧数据可视化",
    "titleEn": "Snapdragon Profiler Data Visualizer",
    "desc": "Python 工具：解析 Snapdragon Profiler 截帧导出的数据文件，将 Draw Call、Shader 耗时、纹理采样等性能数据可视化展示，方便移动端 GPU 性能瓶颈分析。",
    "cover": "assets/images-animated/unitytool_snapTools_compressed.avif",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/unitytool_snapTools_compressed.avif",
        "label": "截帧数据可视化界面"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcL-Tools-Unity",
        "icon": "github"
      }
    ],
    "tags": [
      "工具"
    ]
  },
  {
    "id": "unitytool-renderdoc-csv",
    "category": "tools",
    "categoryLabel": "工具",
    "size": "standard",
    "title": "RenderDoc CSV → FBX 转换工具",
    "titleEn": "RenderDoc CSV Convert To FBX Tool",
    "desc": "将 RenderDoc 导出的顶点 CSV 数据转换为 FBX 模型，在原版基础上新增自动映射所有顶点字段（位置、法线、UV、顶点色等）、修改字段时自动应用所有分量，方便逆向分析游戏渲染网格结构。",
    "cover": "assets/images-animated/1709888519062.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images-animated/1709888519062.webp",
        "label": "CSV 导入转换过程"
      },
      {
        "type": "image",
        "src": "assets/images-animated/1709888858620.webp",
        "label": "生成 FBX 效果"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcL-Tools-Unity",
        "icon": "github"
      }
    ],
    "tags": [
      "工具",
      "Unity",
      "RenderDoc",
      "逆向分析"
    ]
  },
  {
    "id": "unitytools",
    "category": "tools",
    "categoryLabel": "工具",
    "size": "standard",
    "title": "Unity Editor 工具集",
    "titleEn": "Unity Editor Tools",
    "desc": "自定义ShaderGUI扩展、Shader变体收集与剔除工具、LcLProfiler性能分析器等实用Editor扩展工具集。",
    "cover": "assets/images/unitytools_shadergui.webp",
    "gallery": [
      {
        "type": "image",
        "src": "assets/images/unitytools_shadergui.webp",
        "label": "ShaderGUI"
      },
      {
        "type": "image",
        "src": "assets/images-animated/unitytools_snap.avif",
        "label": "Snap Tools"
      }
    ],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/csdjk/LcL-Tools-Unity",
        "icon": "github"
      }
    ],
    "tags": [
      "工具",
      "ShaderGUI"
    ]
  }
];
