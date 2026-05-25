/**
 * AI Prompt Optimizer
 * Vanilla JS — Production-ready prompt engine & UI
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     Constants
  ───────────────────────────────────────────── */

  const STORAGE_KEYS = {
    theme: "apo_theme",
    language: "apo_language",
  };

  const PLACEHOLDER = "[INSERT DETAILS HERE]";

  const LANG_META = {
    en: { dir: "ltr", label: "English" },
    ar: { dir: "rtl", label: "العربية" },
    it: { dir: "ltr", label: "Italiano" },
    es: { dir: "ltr", label: "Español" },
    zh: { dir: "ltr", label: "中文" },
    ja: { dir: "ltr", label: "日本語" },
    ko: { dir: "ltr", label: "한국어" },
  };

  const DETECTED_LANG_LABELS = {
    en: { en: "English detected", ar: "تم اكتشاف الإنجليزية", it: "Rilevato inglese", es: "Inglés detectado", zh: "检测到英语", ja: "英語を検出", ko: "영어 감지됨" },
    ar: { en: "Arabic detected", ar: "تم اكتشاف العربية", it: "Rilevato arabo", es: "Árabe detectado", zh: "检测到阿拉伯语", ja: "アラビア語を検出", ko: "아랍어 감지됨" },
    mixed: { en: "Mixed language detected", ar: "تم اكتشاف لغة مختلطة", it: "Lingua mista rilevata", es: "Idioma mixto detectado", zh: "检测到混合语言", ja: "混合言語を検出", ko: "혼합 언어 감지됨" },
    other: { en: "Multilingual input", ar: "إدخال متعدد اللغات", it: "Input multilingue", es: "Entrada multilingüe", zh: "多语言输入", ja: "多言語入力", ko: "다국어 입력" },
  };

  /* ─────────────────────────────────────────────
     i18n Strings
  ───────────────────────────────────────────── */

  const i18n = {
    en: {
      skipToContent: "Skip to main content",
      appTitle: "AI Prompt Optimizer",
      appTagline: "Transform casual ideas into professional AI prompts",
      languageLabel: "Language",
      inputTitle: "Your Input",
      inputLabel: "Enter your casual prompt or idea",
      inputPlaceholder: "Describe what you want the AI to do — in any language...",
      generateBtn: "Generate Prompt",
      clearBtn: "Clear",
      outputTitle: "Optimized Prompt",
      copyBtn: "Copy",
      emptyState: "Your structured prompt will appear here after generation.",
      loadingState: "Optimizing your prompt...",
      errorState: "Something went wrong. Please try again.",
      errorEmpty: "Please enter some text before generating.",
      copiedToast: "Prompt copied to clipboard!",
      copyFailToast: "Failed to copy. Please select and copy manually.",
      themeLight: "Switch to dark mode",
      themeDark: "Switch to light mode",
      clearedToast: "Cleared successfully.",
      copyAria: "Copy optimized prompt to clipboard",
    },
    ar: {
      skipToContent: "انتقل إلى المحتوى الرئيسي",
      appTitle: "محسّن أوامر الذكاء الاصطناعي",
      appTagline: "حوّل أفكارك العفوية إلى أوامر احترافية للذكاء الاصطناعي",
      languageLabel: "اللغة",
      inputTitle: "مدخلاتك",
      inputLabel: "أدخل فكرتك أو طلبك العفوي",
      inputPlaceholder: "صف ما تريد من الذكاء الاصطناعي — بأي لغة...",
      generateBtn: "إنشاء الأمر",
      clearBtn: "مسح",
      outputTitle: "الأمر المحسّن",
      copyBtn: "نسخ",
      emptyState: "سيظهر الأمر المنظم هنا بعد الإنشاء.",
      loadingState: "جاري تحسين الأمر...",
      errorState: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      errorEmpty: "يرجى إدخال نص قبل الإنشاء.",
      copiedToast: "تم نسخ الأمر!",
      copyFailToast: "فشل النسخ. يرجى النسخ يدوياً.",
      themeLight: "التبديل إلى الوضع الداكن",
      themeDark: "التبديل إلى الوضع الفاتح",
      clearedToast: "تم المسح بنجاح.",
      copyAria: "نسخ الأمر المحسّن إلى الحافظة",
    },
    it: {
      skipToContent: "Vai al contenuto principale",
      appTitle: "Ottimizzatore Prompt IA",
      appTagline: "Trasforma idee informali in prompt IA professionali",
      languageLabel: "Lingua",
      inputTitle: "Il Tuo Input",
      inputLabel: "Inserisci la tua idea o richiesta informale",
      inputPlaceholder: "Descrivi cosa vuoi che l'IA faccia — in qualsiasi lingua...",
      generateBtn: "Genera Prompt",
      clearBtn: "Cancella",
      outputTitle: "Prompt Ottimizzato",
      copyBtn: "Copia",
      emptyState: "Il prompt strutturato apparirà qui dopo la generazione.",
      loadingState: "Ottimizzazione del prompt...",
      errorState: "Qualcosa è andato storto. Riprova.",
      errorEmpty: "Inserisci del testo prima di generare.",
      copiedToast: "Prompt copiato negli appunti!",
      copyFailToast: "Copia fallita. Seleziona e copia manualmente.",
      themeLight: "Passa alla modalità scura",
      themeDark: "Passa alla modalità chiara",
      clearedToast: "Cancellato con successo.",
      copyAria: "Copia il prompt ottimizzato negli appunti",
    },
    es: {
      skipToContent: "Ir al contenido principal",
      appTitle: "Optimizador de Prompts IA",
      appTagline: "Convierte ideas casuales en prompts IA profesionales",
      languageLabel: "Idioma",
      inputTitle: "Tu Entrada",
      inputLabel: "Ingresa tu idea o solicitud informal",
      inputPlaceholder: "Describe lo que quieres que la IA haga — en cualquier idioma...",
      generateBtn: "Generar Prompt",
      clearBtn: "Limpiar",
      outputTitle: "Prompt Optimizado",
      copyBtn: "Copiar",
      emptyState: "El prompt estructurado aparecerá aquí después de generar.",
      loadingState: "Optimizando tu prompt...",
      errorState: "Algo salió mal. Inténtalo de nuevo.",
      errorEmpty: "Ingresa texto antes de generar.",
      copiedToast: "¡Prompt copiado al portapapeles!",
      copyFailToast: "Error al copiar. Selecciona y copia manualmente.",
      themeLight: "Cambiar a modo oscuro",
      themeDark: "Cambiar a modo claro",
      clearedToast: "Limpiado correctamente.",
      copyAria: "Copiar el prompt optimizado al portapapeles",
    },
    zh: {
      skipToContent: "跳转到主要内容",
      appTitle: "AI 提示词优化器",
      appTagline: "将随意想法转化为专业的 AI 提示词",
      languageLabel: "语言",
      inputTitle: "您的输入",
      inputLabel: "输入您的随意想法或请求",
      inputPlaceholder: "描述您希望 AI 做什么——任何语言均可...",
      generateBtn: "生成提示词",
      clearBtn: "清除",
      outputTitle: "优化后的提示词",
      copyBtn: "复制",
      emptyState: "生成后，结构化提示词将显示在此处。",
      loadingState: "正在优化您的提示词...",
      errorState: "出了点问题，请重试。",
      errorEmpty: "生成前请输入一些文字。",
      copiedToast: "提示词已复制到剪贴板！",
      copyFailToast: "复制失败，请手动选择并复制。",
      themeLight: "切换到深色模式",
      themeDark: "切换到浅色模式",
      clearedToast: "已成功清除。",
      copyAria: "将优化后的提示词复制到剪贴板",
    },
    ja: {
      skipToContent: "メインコンテンツへスキップ",
      appTitle: "AIプロンプト最適化ツール",
      appTagline: "カジュアルなアイデアをプロフェッショナルなAIプロンプトに変換",
      languageLabel: "言語",
      inputTitle: "あなたの入力",
      inputLabel: "カジュアルなアイデアやリクエストを入力",
      inputPlaceholder: "AIにしてほしいことを説明してください — どの言語でも...",
      generateBtn: "プロンプト生成",
      clearBtn: "クリア",
      outputTitle: "最適化されたプロンプト",
      copyBtn: "コピー",
      emptyState: "生成後、構造化されたプロンプトがここに表示されます。",
      loadingState: "プロンプトを最適化中...",
      errorState: "問題が発生しました。もう一度お試しください。",
      errorEmpty: "生成前にテキストを入力してください。",
      copiedToast: "プロンプトをクリップボードにコピーしました！",
      copyFailToast: "コピーに失敗しました。手動でコピーしてください。",
      themeLight: "ダークモードに切り替え",
      themeDark: "ライトモードに切り替え",
      clearedToast: "クリアしました。",
      copyAria: "最適化されたプロンプトをクリップボードにコピー",
    },
    ko: {
      skipToContent: "본문으로 건너뛰기",
      appTitle: "AI 프롬프트 최적화 도구",
      appTagline: "캐주얼한 아이디어를 전문적인 AI 프롬프트로 변환",
      languageLabel: "언어",
      inputTitle: "입력",
      inputLabel: "캐주얼한 아이디어나 요청을 입력하세요",
      inputPlaceholder: "AI가 수행할 작업을 설명하세요 — 어떤 언어든 가능...",
      generateBtn: "프롬프트 생성",
      clearBtn: "지우기",
      outputTitle: "최적화된 프롬프트",
      copyBtn: "복사",
      emptyState: "생성 후 구조화된 프롬프트가 여기에 표시됩니다.",
      loadingState: "프롬프트 최적화 중...",
      errorState: "문제가 발생했습니다. 다시 시도해 주세요.",
      errorEmpty: "생성 전에 텍스트를 입력해 주세요.",
      copiedToast: "프롬프트가 클립보드에 복사되었습니다!",
      copyFailToast: "복사에 실패했습니다. 직접 선택하여 복사하세요.",
      themeLight: "다크 모드로 전환",
      themeDark: "라이트 모드로 전환",
      clearedToast: "성공적으로 지워졌습니다.",
      copyAria: "최적화된 프롬프트를 클립보드에 복사",
    },
  };

  /* ─────────────────────────────────────────────
     DOM References
  ───────────────────────────────────────────── */

  const $ = (sel) => document.querySelector(sel);

  const els = {
    html: document.documentElement,
    langSelect: $("#lang-select"),
    themeToggle: $("#theme-toggle"),
    userInput: $("#user-input"),
    generateBtn: $("#generate-btn"),
    clearBtn: $("#clear-btn"),
    copyBtn: $("#copy-btn"),
    detectedLang: $("#detected-lang"),
    outputContainer: $("#output-container"),
    outputEmpty: $("#output-empty"),
    outputLoading: $("#output-loading"),
    outputError: $("#output-error"),
    outputResult: $("#output-result"),
    errorMessage: $("#error-message"),
    toast: $("#toast"),
  };

  let currentLang = "en";
  let currentTheme = "light";
  let lastGeneratedPrompt = "";

  /* ─────────────────────────────────────────────
     Theme Management
  ───────────────────────────────────────────── */

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    currentTheme = theme;
    els.html.setAttribute("data-theme", theme);
    els.themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    updateThemeAria();
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch (_) {
      /* storage unavailable */
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEYS.theme);
    } catch (_) {
      /* ignore */
    }

    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      applyTheme(getSystemTheme());
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      try {
        if (!localStorage.getItem(STORAGE_KEYS.theme)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      } catch (_) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  function toggleTheme() {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  }

  function updateThemeAria() {
    const t = i18n[currentLang];
    els.themeToggle.setAttribute(
      "aria-label",
      currentTheme === "dark" ? t.themeDark : t.themeLight
    );
  }

  /* ─────────────────────────────────────────────
     Language / i18n
  ───────────────────────────────────────────── */

  function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key;
  }

  function applyLanguage(lang) {
    if (!i18n[lang]) lang = "en";
    currentLang = lang;

    const meta = LANG_META[lang];
    els.html.setAttribute("lang", lang);
    els.html.setAttribute("dir", meta.dir);
    els.langSelect.value = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (i18n[lang][key]) el.textContent = i18n[lang][key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (i18n[lang][key]) el.placeholder = i18n[lang][key];
    });

    updateThemeAria();
    els.copyBtn.setAttribute("aria-label", t("copyAria"));
    updateDetectedBadge();

    try {
      localStorage.setItem(STORAGE_KEYS.language, lang);
    } catch (_) {
      /* ignore */
    }
  }

  function initLanguage() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEYS.language);
    } catch (_) {
      /* ignore */
    }
    applyLanguage(saved && i18n[saved] ? saved : "en");
  }

  /* ─────────────────────────────────────────────
     Toast
  ───────────────────────────────────────────── */

  let toastTimer = null;

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("toast--visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove("toast--visible");
    }, 2800);
  }

  /* ─────────────────────────────────────────────
     Output States
  ───────────────────────────────────────────── */

  function setOutputState(state, errorMsg) {
    els.outputEmpty.hidden = state !== "empty";
    els.outputLoading.hidden = state !== "loading";
    els.outputError.hidden = state !== "error";
    els.outputResult.hidden = state !== "result";

    els.outputContainer.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    els.outputContainer.classList.toggle("output--busy", state === "loading");

    if (state === "error" && errorMsg) {
      els.errorMessage.textContent = errorMsg;
    }

    els.copyBtn.disabled = state !== "result";
    els.generateBtn.disabled = state === "loading";
    els.generateBtn.classList.toggle("btn--loading", state === "loading");
  }

  /* ─────────────────────────────────────────────
     Language Detection (input)
  ───────────────────────────────────────────── */

  function detectInputLanguage(text) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const latinPattern = /[a-zA-Z]/;
    const cjkPattern = /[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/;

    const hasArabic = arabicPattern.test(text);
    const hasLatin = latinPattern.test(text);
    const hasCJK = cjkPattern.test(text);

    if (hasArabic && hasLatin) return "mixed";
    if (hasArabic) return "ar";
    if (hasCJK) return "other";
    if (hasLatin) return "en";
    return "other";
  }

  function updateDetectedBadge() {
    const text = els.userInput.value.trim();
    if (!text) {
      els.detectedLang.classList.add("badge--hidden");
      els.detectedLang.textContent = "";
      return;
    }

    const detected = detectInputLanguage(text);
    const labels = DETECTED_LANG_LABELS[detected] || DETECTED_LANG_LABELS.other;
    els.detectedLang.textContent = labels[currentLang] || labels.en;
    els.detectedLang.classList.remove("badge--hidden");
  }

  /* ─────────────────────────────────────────────
     Prompt Engine — Task Classification
  ───────────────────────────────────────────── */

  const TASK_PATTERNS = [
    {
      type: "code",
      weight: 3,
      keywords: {
        en: ["code", "program", "script", "function", "bug", "debug", "api", "javascript", "python", "react", "html", "css", "database", "sql", "algorithm", "develop", "build app", "website", "software"],
        ar: ["كود", "برمجة", "سكربت", "دالة", "خطأ", "تصحيح", "موقع", "تطبيق", "قاعدة بيانات", "خوارزمية", "مطور", "برنامج"],
      },
    },
    {
      type: "write",
      weight: 2,
      keywords: {
        en: ["write", "article", "blog", "essay", "email", "letter", "story", "content", "copy", "caption", "post", "paragraph", "summary", "rewrite", "translate", "proofread"],
        ar: ["اكتب", "مقال", "مدونة", "رسالة", "بريد", "قصة", "محتوى", "نص", "ملخص", "إعادة صياغة", "ترجمة", "تدقيق"],
      },
    },
    {
      type: "analyze",
      weight: 2,
      keywords: {
        en: ["analyze", "analysis", "compare", "research", "evaluate", "review", "assess", "study", "report", "data", "statistics", "insights", "breakdown", "examine"],
        ar: ["حلل", "تحليل", "قارن", "بحث", "تقييم", "مراجعة", "دراسة", "تقرير", "بيانات", "إحصائيات", "فحص"],
      },
    },
    {
      type: "creative",
      weight: 2,
      keywords: {
        en: ["design", "logo", "creative", "brainstorm", "idea", "name", "slogan", "brand", "marketing", "campaign", "ad", "social media", "image", "video"],
        ar: ["تصميم", "شعار", "إبداعي", "عصف ذهني", "فكرة", "اسم", "شعار تسويقي", "علامة تجارية", "تسويق", "حملة", "إعلان"],
      },
    },
    {
      type: "learn",
      weight: 2,
      keywords: {
        en: ["explain", "teach", "learn", "tutorial", "how to", "guide", "lesson", "understand", "simplify", "beginner", "step by step"],
        ar: ["اشرح", "علّم", "تعلم", "شرح", "دليل", "درس", "فهم", "تبسيط", "مبتدئ", "خطوة بخطوة"],
      },
    },
    {
      type: "plan",
      weight: 2,
      keywords: {
        en: ["plan", "schedule", "organize", "strategy", "roadmap", "timeline", "project", "workflow", "checklist", "agenda"],
        ar: ["خطة", "جدول", "تنظيم", "استراتيجية", "خارطة طريق", "جدول زمني", "مشروع", "قائمة مهام"],
      },
    },
    {
      type: "business",
      weight: 2,
      keywords: {
        en: ["business", "proposal", "pitch", "resume", "cv", "cover letter", "interview", "meeting", "presentation", "sales"],
        ar: ["أعمال", "عرض", "سيرة ذاتية", "مقابلة", "اجتماع", "عرض تقديمي", "مبيعات", "اقتراح"],
      },
    },
  ];

  const TASK_META = {
    code: {
      role: "You are a Senior Software Engineer with expertise in clean, production-ready code.",
      taskVerb: "Write, refactor, or debug code based on the user's requirements.",
      outputFormat: "Provide complete, runnable code with brief inline comments only where logic is non-obvious. Include file structure notes if multiple files are needed.",
      constraints: "Do not execute or deploy code. Focus on correctness, security best practices, and readability. Use the language/framework implied by the request.",
    },
    write: {
      role: "You are a Professional Content Writer and Editor skilled in clear, engaging communication.",
      taskVerb: "Create or refine written content according to the user's specifications.",
      outputFormat: "Deliver polished prose in the requested tone, length, and format (e.g., article, email, social post). Use headings and bullets where appropriate.",
      constraints: "Do not fabricate facts or citations. Match the requested language, tone, and audience. Avoid filler and clichés.",
    },
    analyze: {
      role: "You are an Expert Analyst skilled in structured reasoning and evidence-based conclusions.",
      taskVerb: "Perform a thorough analysis of the topic or data described by the user.",
      outputFormat: "Present findings in sections: Overview, Key Points, Analysis, Recommendations. Use tables or bullet lists for comparisons.",
      constraints: "Distinguish facts from assumptions. State limitations clearly. Do not invent data the user did not provide.",
    },
    creative: {
      role: "You are a Creative Director with expertise in branding, ideation, and visual storytelling.",
      taskVerb: "Generate creative concepts and deliverables as described by the user.",
      outputFormat: "Provide multiple distinct options where applicable. Include rationale for each concept. Use descriptive, vivid language.",
      constraints: "Respect brand guidelines if provided. Avoid generic or overused ideas. Stay within the scope of the request.",
    },
    learn: {
      role: "You are an Expert Educator who explains complex topics clearly and patiently.",
      taskVerb: "Explain or teach the subject matter described by the user.",
      outputFormat: "Use progressive structure: simple overview → core concepts → examples → summary. Include analogies where helpful.",
      constraints: "Adapt complexity to the stated audience level. Be accurate and avoid oversimplification that causes misconceptions.",
    },
    plan: {
      role: "You are a Strategic Planner experienced in project management and operational excellence.",
      taskVerb: "Create a structured plan based on the user's goals and constraints.",
      outputFormat: "Deliver a phased plan with timelines, milestones, action items, and success metrics. Use numbered steps and checklists.",
      constraints: "Be realistic about resources and time. Flag risks and dependencies. Do not assume unavailable information.",
    },
    business: {
      role: "You are a Business Communication Specialist with expertise in professional documents and strategy.",
      taskVerb: "Produce professional business content as specified by the user.",
      outputFormat: "Use formal business structure appropriate to the document type (proposal, email, pitch deck outline, etc.).",
      constraints: "Maintain professionalism and confidentiality awareness. Do not invent company-specific data not provided by the user.",
    },
    general: {
      role: "You are an Expert AI Assistant specialized in delivering precise, high-quality responses.",
      taskVerb: "Complete the task described by the user with professionalism and accuracy.",
      outputFormat: "Structure the response clearly with headings, bullet points, or numbered lists as appropriate to the content type.",
      constraints: "Stay focused on the user's request. Do not add unrelated information. Ask for clarification only if critical details are missing.",
    },
  };

  function scoreTaskType(text) {
    const lower = text.toLowerCase();
    const scores = {};

    TASK_PATTERNS.forEach(({ type, weight, keywords }) => {
      let score = 0;
      (keywords.en || []).forEach((kw) => {
        if (lower.includes(kw.toLowerCase())) score += weight;
      });
      (keywords.ar || []).forEach((kw) => {
        if (text.includes(kw)) score += weight;
      });
      scores[type] = score;
    });

    let best = "general";
    let bestScore = 0;
    Object.entries(scores).forEach(([type, s]) => {
      if (s > bestScore) {
        bestScore = s;
        best = type;
      }
    });

    return best;
  }

  /* ─────────────────────────────────────────────
     Prompt Engine — Intent Extraction
  ───────────────────────────────────────────── */

  function cleanInput(text) {
    return text
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractIntent(text) {
    const cleaned = cleanInput(text);

    const intentPatterns = [
      { regex: /^(?:please\s+)?(?:can you\s+|could you\s+|i want you to\s+|i need you to\s+|help me\s+)?(.+)/i, group: 1 },
      { regex: /^(?:اكتب|اعمل|ساعدني|أريد|بدي|عايز|ممكن)\s+(.+)/i, group: 1 },
      { regex: /^(?:write|create|make|build|generate|design|analyze|explain|list|summarize|translate)\s+(.+)/i, group: 1 },
    ];

    for (const { regex, group } of intentPatterns) {
      const match = cleaned.match(regex);
      if (match && match[group]) {
        return match[group].trim();
      }
    }

    return cleaned;
  }

  function inferAudience(text) {
    const lower = text.toLowerCase();
    if (/beginner|مبتدئ|bambini|niños|初心者|初学者|초보/.test(lower + text)) return "beginners / general audience";
    if (/expert|advanced|محترف|متقدم|esperto|experto|专家|上級|전문가/.test(lower + text)) return "expert / technical audience";
    if (/client|customer|عميل|cliente|客户|顧客|고객/.test(lower + text)) return "clients / external stakeholders";
    if (/team|colleague|فريق|زملاء|team|equipo|团队|チーム|팀/.test(lower + text)) return "internal team / colleagues";
    return null;
  }

  function inferTone(text) {
    const lower = text.toLowerCase();
    if (/formal|professional|رسمي|احترافي|formale|profesional|正式|フォーマル|공식/.test(lower + text)) return "formal and professional";
    if (/casual|friendly|ودي|عفوي|informale|casual|随意|カジュアル|캐주얼/.test(lower + text)) return "casual and friendly";
    if (/persuasive|convincing|إقناع|مقنع|persuasivo|说服|説得|설득/.test(lower + text)) return "persuasive and compelling";
    if (/technical|تقني|tecnico|技术|技術|기술/.test(lower + text)) return "technical and precise";
    return null;
  }

  function inferFormat(text) {
    const lower = text.toLowerCase();
    if (/bullet|list|نقاط|قائمة|elenco|lista|列表|リスト|목록/.test(lower + text)) return "bullet list";
    if (/table|جدول|tabella|tabla|表格|表|표/.test(lower + text)) return "table format";
    if (/step|خطوة|passo|paso|步骤|ステップ|단계/.test(lower + text)) return "numbered step-by-step format";
    if (/json|xml|yaml|markdown|md/.test(lower)) return "structured markdown / code format";
    return null;
  }

  function inferLength(text) {
    const lower = text.toLowerCase();
    if (/short|brief|concise|مختصر|قصير|breve|corto|简短|簡潔|짧은/.test(lower + text)) return "concise (under 300 words)";
    if (/long|detailed|comprehensive|مفصل|طويل|lungo|detallado|详细|詳細|상세/.test(lower + text)) return "comprehensive and detailed";
    return null;
  }

  function buildContextBlock(text, inputLang, taskType) {
    const parts = [];

    parts.push(`The user provided the following casual request (detected language: ${inputLang}):`);
    parts.push(`"${text}"`);

    const audience = inferAudience(text);
    const tone = inferTone(text);
    const format = inferFormat(text);
    const length = inferLength(text);

    const details = [];
    if (audience) details.push(`Target audience: ${audience}`);
    if (tone) details.push(`Desired tone: ${tone}`);
    if (format) details.push(`Preferred format: ${format}`);
    if (length) details.push(`Expected length: ${length}`);
    details.push(`Inferred task category: ${taskType}`);

    if (details.length) {
      parts.push("");
      parts.push("Extracted parameters:");
      details.forEach((d) => parts.push(`- ${d}`));
    }

    const missing = [];
    if (!audience) missing.push("target audience");
    if (!tone) missing.push("tone/style");
    if (!format) missing.push("output structure preference");
    if (!length) missing.push("desired length");

    if (missing.length) {
      parts.push("");
      parts.push(`Missing details (use placeholders): ${missing.join(", ")}`);
    }

    return parts.join("\n");
  }

  function buildTaskBlock(intent, taskType) {
    const meta = TASK_META[taskType] || TASK_META.general;
    return `${meta.taskVerb}\n\nRefined intent: ${intent || PLACEHOLDER}`;
  }

  function buildInstructionsBlock(taskType) {
    const base = [
      "Analyze the user's intent carefully before responding.",
      "Do NOT execute, run, or perform the task yourself — only provide the requested output as if completing it for the user.",
      "Ask clarifying questions only if critical information is missing and cannot be reasonably inferred.",
      "Prioritize accuracy, relevance, and actionable quality.",
    ];

    const extras = {
      code: ["Follow language-specific best practices and idiomatic patterns.", "Include error handling where appropriate."],
      write: ["Preserve the user's core message and intent.", "Optimize for readability and engagement."],
      analyze: ["Support conclusions with logical reasoning.", "Highlight assumptions and gaps in provided data."],
      creative: ["Offer diverse, original concepts.", "Explain the reasoning behind each recommendation."],
      learn: ["Build from fundamentals to advanced points.", "Use examples to reinforce understanding."],
      plan: ["Make action items specific and measurable.", "Account for dependencies and realistic timelines."],
      business: ["Use industry-standard terminology.", "Align with professional communication norms."],
    };

    const lines = base.concat(extras[taskType] || []);
    return lines.map((l, i) => `${i + 1}. ${l}`).join("\n");
  }

  function buildConstraintsBlock(text, taskType) {
    const meta = TASK_META[taskType] || TASK_META.general;
    const lines = [meta.constraints];

    if (/arabic|عربي|بالعربي/i.test(text)) {
      lines.push("Respond in Arabic unless otherwise specified.");
    } else if (/english|انجليزي|بالانجليزي/i.test(text)) {
      lines.push("Respond in English unless otherwise specified.");
    } else if (detectInputLanguage(text) === "ar") {
      lines.push("Respond in Arabic unless the user explicitly requests another language.");
    }

    lines.push("Never include meta-commentary about being an AI unless explicitly asked.");
    lines.push(`If specific details are unavailable, use the placeholder: ${PLACEHOLDER}`);

    return lines.join("\n");
  }

  function generateStructuredPrompt(rawInput) {
    const text = cleanInput(rawInput);
    const inputLang = detectInputLanguage(text);
    const langLabel = { en: "English", ar: "Arabic", mixed: "Arabic/English mixed", other: "Multilingual" }[inputLang] || "Multilingual";
    const taskType = scoreTaskType(text);
    const meta = TASK_META[taskType] || TASK_META.general;
    const intent = extractIntent(text);

    const audience = inferAudience(text);
    const tone = inferTone(text);
    const format = inferFormat(text) || PLACEHOLDER;
    const length = inferLength(text) || PLACEHOLDER;

    const sections = [
      "🟢 ROLE",
      "",
      meta.role,
      "",
      "🔵 TASK",
      "",
      buildTaskBlock(intent, taskType),
      "",
      "🟡 CONTEXT",
      "",
      buildContextBlock(text, langLabel, taskType),
      "",
      "🟣 INSTRUCTIONS",
      "",
      buildInstructionsBlock(taskType),
      "",
      "🟠 OUTPUT FORMAT",
      "",
      meta.outputFormat,
      "",
      `Additional format requirements:`,
      `- Structure: ${format}`,
      `- Length: ${length}`,
      `- Tone: ${tone || PLACEHOLDER}`,
      `- Audience: ${audience || PLACEHOLDER}`,
      "",
      "🔴 CONSTRAINTS",
      "",
      buildConstraintsBlock(text, taskType),
    ];

    return sections.join("\n");
  }

  /* ─────────────────────────────────────────────
     Actions
  ───────────────────────────────────────────── */

  function handleGenerate() {
    const input = els.userInput.value.trim();

    if (!input) {
      setOutputState("error", t("errorEmpty"));
      return;
    }

    setOutputState("loading");

    window.setTimeout(() => {
      try {
        const prompt = generateStructuredPrompt(input);
        lastGeneratedPrompt = prompt;
        els.outputResult.textContent = prompt;
        setOutputState("result");
      } catch (err) {
        setOutputState("error", t("errorState"));
        console.error("Prompt generation error:", err);
      }
    }, 600);
  }

  function handleClear() {
    els.userInput.value = "";
    lastGeneratedPrompt = "";
    els.outputResult.textContent = "";
    setOutputState("empty");
    updateDetectedBadge();
    els.userInput.focus();
    showToast(t("clearedToast"));
  }

  async function handleCopy() {
    if (!lastGeneratedPrompt) return;

    try {
      await navigator.clipboard.writeText(lastGeneratedPrompt);
      showToast(t("copiedToast"));
    } catch (_) {
      try {
        const range = document.createRange();
        range.selectNodeContents(els.outputResult);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        const ok = document.execCommand("copy");
        selection.removeAllRanges();
        showToast(ok ? t("copiedToast") : t("copyFailToast"));
      } catch (__) {
        showToast(t("copyFailToast"));
      }
    }
  }

  /* ─────────────────────────────────────────────
     Event Listeners
  ───────────────────────────────────────────── */

  function bindEvents() {
    els.themeToggle.addEventListener("click", toggleTheme);

    els.langSelect.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
    });

    els.generateBtn.addEventListener("click", handleGenerate);

    els.clearBtn.addEventListener("click", handleClear);

    els.copyBtn.addEventListener("click", handleCopy);

    els.userInput.addEventListener("input", updateDetectedBadge);

    els.userInput.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    });
  }

  /* ─────────────────────────────────────────────
     Init
  ───────────────────────────────────────────── */

  function init() {
    initTheme();
    initLanguage();
    bindEvents();
    setOutputState("empty");
    updateDetectedBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
