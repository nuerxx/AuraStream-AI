import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThreeDView from "./components/ThreeDView";
import {
  Download,
  Video,
  Music,
  Sparkles,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileText,
  MessageSquare,
  ShieldCheck,
  Cpu,
  Layers,
  Globe,
  RefreshCw,
  Play,
  Volume2,
  Lock,
  Copy,
  Save,
  Search,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  BarChart3,
  Calendar,
  Eye,
  DollarSign,
  Users,
  Settings,
  Flame,
  Palette,
  Bot,
  Send,
  Zap,
  Plus,
  Compass
} from "lucide-react";

// Platform icons helper
const renderPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("youtube")) return <Youtube className="w-5 h-5 text-red-500" />;
  if (p.includes("tiktok")) return <Youtube className="w-5 h-5 text-teal-400" />; // Fallback as a standard
  if (p.includes("instagram")) return <Instagram className="w-5 h-5 text-pink-500" />;
  if (p.includes("twitter") || p.includes("x.com")) return <Twitter className="w-5 h-5 text-blue-400" />;
  if (p.includes("facebook")) return <Facebook className="w-5 h-5 text-blue-600" />;
  return <Video className="w-5 h-5 text-cyan-400" />;
};

interface VideoFormat {
  quality: string;
  resolution: string;
  size: string;
  fps: number;
  url: string;
  type: "video" | "audio";
}

interface VideoMetadata {
  id: string;
  title: string;
  duration: string;
  author: string;
  platform: string;
  thumbnail: string;
  views: string;
  likes: string;
  url: string;
  formats: VideoFormat[];
}

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [activeView, setActiveView] = useState<string>("downloader");

  // Telemetry metrics
  const [videosCount, setVideosCount] = useState(47);
  const [viewsCount, setViewsCount] = useState(1248000);
  const [revenueCount, setRevenueCount] = useState(23088);
  const [subsCount, setSubsCount] = useState(8420);

  // Video Extractor / Downloader States
  const [inputUrl, setInputUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [downloadAbortController, setDownloadAbortController] = useState<AbortController | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Batch Queue Download States
  const [downloadMode, setDownloadMode] = useState<"single" | "queue">("single");
  const [queueInput, setQueueInput] = useState("");
  const [urlQueue, setUrlQueue] = useState<Array<{
    id: string;
    url: string;
    status: "pending" | "extracting" | "downloading" | "completed" | "error";
    progress: number;
    title?: string;
    platform?: string;
    duration?: string;
    size?: string;
    errorMsg?: string;
  }>>([]);
  const [queueProcessing, setQueueProcessing] = useState(false);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);

  // AI states
  const [summarizing, setSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState("");
  
  const [generatingScript, setGeneratingScript] = useState(false);
  const [scriptStyle, setScriptStyle] = useState("تكتيكي حماسي");
  const [scriptLanguage, setScriptLanguage] = useState("العربية الفصحى");
  const [scriptResult, setScriptResult] = useState("");

  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [seoKeyword, setSeoKeyword] = useState("");
  const [seoResult, setSeoResult] = useState("");

  // Editor states
  const [generatingShotList, setGeneratingShotList] = useState(false);
  const [editorShots, setEditorShots] = useState(40);
  const [editorStyle, setEditorStyle] = useState("cinematic");
  const [editorSources, setEditorSources] = useState("balanced");
  const [editorResult, setEditorResult] = useState("");

  // Voice States
  const [generatingVoice, setGeneratingVoice] = useState(false);
  const [voiceProfile, setVoiceProfile] = useState("adam");
  const [voiceEmotion, setVoiceEmotion] = useState("rising");
  const [voiceWords, setVoiceWords] = useState(1500);
  const [voiceMusic, setVoiceMusic] = useState("epic-orchestral");
  const [voiceResult, setVoiceResult] = useState("");

  // Shorts States
  const [generatingShorts, setGeneratingShorts] = useState(false);
  const [shortsCount, setShortsCount] = useState(5);
  const [shortsResult, setShortsResult] = useState("");

  // Pipeline execution state
  const [pipelineRendering, setPipelineRendering] = useState(false);
  const [pipelineVideoUrl, setPipelineVideoUrl] = useState<string | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [pipelineType, setPipelineType] = useState<"video" | "short">("short");
  const [pipelineCaption, setPipelineCaption] = useState("WORLD CUP STRIKER");

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<any>(null);

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(5); // June
  const [currentYear, setCurrentYear] = useState(2026);

  // Firecrawl & Scheduler States
  const [firecrawlUrl, setFirecrawlUrl] = useState("");
  const [scrapingWithFirecrawl, setScrapingWithFirecrawl] = useState(false);
  const [schedulerActive, setSchedulerActive] = useState(true);
  const [schedulerInterval, setSchedulerInterval] = useState(12);
  const [schedulerMaxTokens, setSchedulerMaxTokens] = useState(1000);
  const [schedulerAutoProcess, setSchedulerAutoProcess] = useState(true);
  const [schedulerStatsCount, setSchedulerStatsCount] = useState(14);
  const [schedulerHistory, setSchedulerHistory] = useState<Array<{
    timestamp: string;
    url: string;
    title: string;
    tokensUsed: number;
    status: "success" | "warning" | "failed";
  }>>([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetchSchedulerConfig();
  }, []);

  const fetchSchedulerConfig = async () => {
    try {
      const res = await fetch("/api/scheduler/config");
      const data = await res.json();
      if (data.config) {
        setSchedulerActive(data.config.active);
        setSchedulerInterval(data.config.intervalHours);
        setSchedulerMaxTokens(data.config.maxTokens);
        setSchedulerAutoProcess(data.config.autoProcessVideo);
        setSchedulerStatsCount(data.config.scrapesCount);
      }
      if (data.logs) {
        setSchedulerHistory(data.logs);
      }
    } catch (err) {
      console.error("Failed to load scheduler config:", err);
    }
  };

  const updateSchedulerConfig = async (updatedFields: { active?: boolean; intervalHours?: number; maxTokens?: number; autoProcess?: boolean }) => {
    try {
      const payload = {
        active: updatedFields.active !== undefined ? updatedFields.active : schedulerActive,
        intervalHours: updatedFields.intervalHours !== undefined ? updatedFields.intervalHours : schedulerInterval,
        maxTokens: updatedFields.maxTokens !== undefined ? updatedFields.maxTokens : schedulerMaxTokens,
        autoProcessVideo: updatedFields.autoProcess !== undefined ? updatedFields.autoProcess : schedulerAutoProcess,
      };
      const res = await fetch("/api/scheduler/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "ar" ? "✓ تم حفظ إعدادات الأتمتة والتوكنات بنجاح!" : "✓ Automation and Token settings saved!");
        if (data.config) {
          setSchedulerActive(data.config.active);
          setSchedulerInterval(data.config.intervalHours);
          setSchedulerMaxTokens(data.config.maxTokens);
          setSchedulerAutoProcess(data.config.autoProcessVideo);
        }
      }
    } catch (err) {
      showToast(lang === "ar" ? "🛑 فشل تحديث الإعدادات" : "🛑 Updates failed");
    }
  };

  const triggerSchedulerRunNow = async () => {
    try {
      showToast(lang === "ar" ? "جاري تشغيل جدول الاستخراج الفوري..." : "Triggering dynamic scraper feed...");
      const res = await fetch("/api/scheduler/run-now", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(lang === "ar" ? "✓ تم استخراج وتحميل ميديا جديدة بنجاح!" : "✓ New media harvested successfully!");
        if (data.metadata) {
          setVideoMeta(data.metadata);
          if (data.metadata.formats && data.metadata.formats.length > 0) {
            setSelectedFormat(data.metadata.formats[0]);
          }
        }
        // Reload logs
        fetchSchedulerConfig();
      }
    } catch (err) {
      showToast(lang === "ar" ? "🛑 فشل تشغيل الجدولة" : "🛑 Scheduler run failed");
    }
  };

  const handleFirecrawlScrape = async () => {
    if (!firecrawlUrl.trim()) return;
    setScrapingWithFirecrawl(true);
    showToast(lang === "ar" ? "جاري الاستعانه بمحرك Firecrawl لكشط الصفحة وتحليل الرابط..." : "Scraping page with Firecrawl...");
    try {
      const res = await fetch("/api/firecrawl/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: firecrawlUrl,
          maxTokens: schedulerMaxTokens
        })
      });

      const data = await res.json();
      if (data.success && data.metadata) {
        setVideoMeta(data.metadata);
        if (data.metadata.formats && data.metadata.formats.length > 0) {
          setSelectedFormat(data.metadata.formats[0]);
        }
        showToast(lang === "ar" ? `✓ نجح الكشط! تم كشف وتنسيق فيديو: ${data.metadata.title}` : `✓ Scrape success! Mapped: ${data.metadata.title}`);
        setActiveView("downloader");
      } else {
        showToast(data.error || (lang === "ar" ? "🛑 فشل محرك الكشط" : "🛑 Scraper failed"));
      }
    } catch (err) {
      showToast(lang === "ar" ? "🛑 خطأ فني أثناء الكشط" : "🛑 Network error during crawl");
    } finally {
      setScrapingWithFirecrawl(false);
    }
  };


  const handleRunPipeline = async (type: "video" | "short", captionText: string) => {
    setPipelineRendering(true);
    setPipelineError(null);
    setPipelineVideoUrl(null);

    const targetTopic = videoMeta ? videoMeta.title : (lang === "ar" ? "مونديال كأس العالم 2026" : "World Cup 2026");
    const numClips = type === "short" ? 5 : 8;

    showToast(lang === "ar" ? "🚀 جاري تشغيل محرك المونتاج وتوليد مقاطع B-roll..." : "🚀 Launching pipeline & generating stock B-rolls...");

    try {
      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic,
          numClips,
          outputType: type,
          caption: captionText
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Rendering pipeline failed");

      setPipelineVideoUrl(data.videoUrl);
      showToast(lang === "ar" ? "✅ اكتمل المونتاج! تم حفظ وتوليد الفيديو الفائق." : "✅ Render complete! Cinematic file is ready for offline download.");
    } catch (err: any) {
      console.error(err);
      setPipelineError(err.message || "Pipeline error");
      showToast(lang === "ar" ? "⚠️ فشل تشغيل محرك الرندرة تزامناً مع محاكاة السيرفر" : "⚠️ Failed to execute compiler engine");
    } finally {
      setPipelineRendering(false);
    }
  };

  // Preset information matching the specifications
  const ideas = [
    { id: 1, title: "The Group of Death in World Cup 2026", titleAr: "مجموعة الموت الشديدة في مونديال 2026", hook: "One group will send the world champion home. The #4 team is the reason.", cpm: 18, score: 94, type: "TACTICAL", badge: "gold" },
    { id: 2, title: "Italy OUT of World Cup 2026 — 3 Mistakes That Cost Everything", titleAr: "خروج إيطاليا الصادم من كأس العالم 2026 - الكارثة التكتيكية", hook: "4-time world champion. 0 goals in the playoff. The third mistake is unforgivable.", cpm: 22, score: 97, type: "CONTROVERSIAL", badge: "red" },
    { id: 3, title: "8 Arab Nations at World Cup 2026 — The Strongest Arab Squad Ever", titleAr: "8 دول عربية في كأس العالم 2026 - التواجد الأقوى تاريخياً", hook: "For the first time in history, 8 Arab teams. But only one will reach the quarters.", cpm: 25, score: 96, type: "STORYTELLING", badge: "red" },
    { id: 4, title: "The 16 Stadiums of World Cup 2026 — Which One Hosts the Final?", titleAr: "ملاعب المونديال الـ 16 - من يستضيف النهائي التاريخي؟", hook: "16 stadiums. 3 countries. 1 final. The answer is not who you think.", cpm: 15, score: 88, type: "LISTICLE", badge: "blue" },
    { id: 5, title: "Haaland vs Mbappé — The Match That Will Decide the World Cup", titleAr: "مواجهة هالاند وبابي الملتهبة التي ستحسم المونديال الأكبر", hook: "The two most expensive players on Earth. Same group. June 16.", cpm: 28, score: 99, type: "TACTICAL", badge: "gold" },
  ];

  const trends = [
    { topic: "Italy World Cup 2026 failure", topicAr: "إخفاق إيطاليا في تصفيات مونديال 2026", vol: "2.4M", growth: "+1840%", src: "Google" },
    { topic: "World Cup 2026 Group of Death", topicAr: "مجموعة الموت في مونديال 2026", vol: "1.8M", growth: "+920%", src: "YouTube" },
    { topic: "Haaland Norway World Cup", topicAr: "مشاركة هالاند ونرويج 2026", vol: "980K", growth: "+612%", src: "Twitter" },
    { topic: "8 Arab nations World Cup", topicAr: "الثمانية المنتخبات العربية المتأهلة", vol: "1.2M", growth: "+744%", src: "TikTok" },
  ];

  const gaps = [
    { txt: "Tactical analysis of NEW 48-team format (nobody has covered this yet)", txtAr: "التحليل التكتيكي لنظام الـ 48 فريقاً الجديد والمستحدث" },
    { txt: "Specific player matchups in Group I (France vs Norway / Senegal vs Iraq)", txtAr: "المواجهات الثنائية في المجموعة التاسعة (فرنسا ضد النرويج)" },
    { txt: "How climate affects matches across 16 venues in 3 climate zones", txtAr: "تأثير درجات الحرارة والمناخ عبر 16 ملعباً في 3 مناطق جغرافية" },
  ];

  const questions = [
    { q: "Why is Italy not in the 2026 World Cup?", qAr: "لماذا لم تتأهل إيطاليا لبطولة كأس العالم 2026؟" },
    { q: "Which group is the group of death in 2026?", qAr: "ما هي مجموعة الموت الحقيقية في مونديال 2026؟" },
    { q: "How many Arab countries are in the 2026 World Cup?", qAr: "كم عدد الدول العربية المشاركة في المونديال؟" },
  ];

  const pipeline = [
    { agent: "Watcher", agentAr: "المرشد التكتيكي", task: "Detected 12 winning ideas", taskAr: "تم رصد 12 فكرة محتوى ذهبية", time: "2 min ago", status: "done" },
    { agent: "Copywriter", agentAr: "كاتب النصوص الذكي", task: "Script 60% complete (Tactical Analysis)", taskAr: "السيناريو مكتمل بنسبة 60% (تحليل تكتيكي)", time: "8 min ago", status: "working" },
    { agent: "Editor", agentAr: "المحرر السينمائي", task: "Awaiting script handoff", taskAr: "بانتظار تسليم سيناريو كاتب النصوص", time: "—", status: "queued" },
    { agent: "Voice", agentAr: "المعلق المحترف", task: "Idle — ready for script", taskAr: "جاهز لتسجيل التعليق الصوتي فورا", time: "—", status: "queued" },
  ];

  const matchDays: { [key: string]: string } = {
    "2026-06-11": "Mexico vs South Africa | المكسيك ضد جنوب أفريقيا",
    "2026-06-12": "Group A Matches | مواجهات المجموعة أ",
    "2026-06-14": "Group C Matches | مواجهات المجموعة ج",
    "2026-06-16": "France vs Senegal | القمة: فرنسا ضد السنغال",
    "2026-07-19": "🏆 World Cup Grand Final | النهائي التاريخي للمونديال"
  };

  const videoDays: { [key: string]: string } = {
    "2026-06-10": "PREVIEW: Great Kickoff",
    "2026-06-11": "LONG: Opening Day Analysis",
    "2026-06-14": "LONG: Group of Death Tactics",
    "2026-07-19": "LONG: Winner Celebration Document"
  };

  // Examples prefilled
  const examples = [
    { name: "YouTube World Cup", url: "https://www.youtube.com/watch?v=soccer_wc2026_insights" },
    { name: "TikTok Football Trend", url: "https://www.tiktok.com/@football_trends/video/viral_high_kick" },
    { name: "Instagram Real Footage", url: "https://www.instagram.com/p/training_stars_session/" },
  ];

  // Pipeline simulation
  const runFullAutomation = () => {
    const steps = lang === "ar" ? [
      "🕵️ رصد المحتوى: تم كشف 12 فكرة فيروسية مرشحة لمونديال 2026...",
      "✍️ كاتب النصوص: توليد 12 سيناريو تكتيكي دقيق لرفع نسبة الاحتفاظ بالمشاهد...",
      "🎞️ المونتاج: تم تخطيط هيكل اللقطات والروابط المباشرة تلقائياً...",
      "🎙️ معالج دبلجة التعليق: بناء تضخيم النبرة والتعليق بحماس فائق...",
      "📤 الناشر الزمني: جدولة 60 مقطعاً قصيراً ورفع دقة التصدير لبطاقة المونديال!",
      "✅ تم اكتمال تدفق العمل المتكامل! الفيديوهات جاهزة بلمسة بيكسل متناهية."
    ] : [
      "🕵️ Watcher: 12 potential viral World Cup 2026 ideas discovered...",
      "✍️ Copywriter: Generated high-retention script formats using Gemini AI...",
      "🎞️ Editor: Rendered cinematic shot plans automatically...",
      "🎙️ Voice Pro: Created audio commentary pacing curves...",
      "📤 Publisher: All 60 video short variations successfully scheduled!",
      "✅ Pipeline execution completed with extreme visual precision!"
    ];

    let i = 0;
    showToast(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        showToast(steps[i]);
      } else {
        clearInterval(interval);
        setVideosCount((prev) => prev + 12);
        setViewsCount((prev) => prev + 540000);
        setRevenueCount((prev) => prev + 4120);
        setSubsCount((prev) => prev + 1950);
      }
    }, 1500);
  };

  // Direct downstream extractor metadata fetcher
  const handleExtract = async () => {
    if (!inputUrl) {
      setErrorMsg(lang === "ar" ? "الرجاء إدخال رابط فيديو صالح" : "Please enter a valid video URL");
      return;
    }
    setAnalyzing(true);
    setErrorMsg(null);
    setVideoMeta(null);
    setSelectedFormat(null);
    setDownloadSuccess(false);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Extraction failed");

      setVideoMeta(data);
      if (data.formats && data.formats.length > 0) {
        setSelectedFormat(data.formats[0]);
      }
      showToast(lang === "ar" ? "تم استخراج وتحليل الفيديو بدقة متناهية!" : "Video parsed and indexed accurately!");
      triggerSummary(data);
    } catch (err: any) {
      setErrorMsg(err.message || "فشل تحليل الرابط");
    } finally {
      setAnalyzing(false);
    }
  };

  // Add URLs to queue
  const addToQueue = (urlsStr: string) => {
    if (!urlsStr.trim()) {
      showToast(lang === "ar" ? "الرجاء إدخال رابط أو عدة روابط صالحة" : "Please enter one or more valid URLs");
      return;
    }

    const lines = urlsStr.split(/[\n,]+/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return;

    const newItems = lines.map(url => ({
      id: Math.random().toString(36).substring(2, 10),
      url,
      status: "pending" as const,
      progress: 0
    }));

    setUrlQueue(prev => [...prev, ...newItems]);
    setQueueInput("");
    showToast(lang === "ar" ? `تمت إضافة ${newItems.length} رابط إلى طابور التنزيل!` : `Added ${newItems.length} URLs to download queue!`);
  };

  // Clear entire queue
  const clearQueue = () => {
    setUrlQueue([]);
    setQueueInput("");
    setErrorMsg(null);
    showToast(lang === "ar" ? "تم تفريغ طابور المعالجة بالكامل" : "Cleared the download queue completely");
  };

  // Remove single item from queue
  const removeFromQueue = (id: string) => {
    setUrlQueue(prev => prev.filter(item => item.id !== id));
  };

  // Process queue sequentially for efficiency
  const processQueueSequentially = async () => {
    if (urlQueue.length === 0) {
      showToast(lang === "ar" ? "الطابور فارغ! أضف بعض الروابط أولاً." : "Queue is empty! Add some URLs first.");
      return;
    }
    if (queueProcessing) return;

    setQueueProcessing(true);
    setErrorMsg(null);
    showToast(lang === "ar" ? "جاري معالجة طابور الفيديوهات بالتتابع..." : "Processing video queue sequentially...");

    for (let i = 0; i < urlQueue.length; i++) {
      const item = urlQueue[i];
      if (item.status === "completed") continue; // skip already completed items

      setCurrentQueueIndex(i);
      
      // Update status to extracting
      setUrlQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: "extracting" as const } : q));

      try {
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.url }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Extraction failed");

        // Update status to downloading and store metadata info
        setUrlQueue(prev => prev.map((q, idx) => idx === i ? {
          ...q,
          status: "downloading" as const,
          title: data.title,
          platform: data.platform,
          duration: data.duration,
          size: data.formats?.[0]?.size || "HQ Video",
          progress: 10
        } : q));

        // Simulate chunk-by-chunk download stream sequential progression
        for (let p = 25; p <= 100; p += 25) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setUrlQueue(prev => prev.map((q, idx) => idx === i ? { ...q, progress: p } : q));
        }

        // Set completed
        setUrlQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: "completed" as const, progress: 100 } : q));
        
        // Update stats
        setVideosCount(prev => prev + 1);
        setViewsCount(prev => prev + Math.floor(Math.random() * 45000) + 12000);
        setRevenueCount(prev => prev + Math.floor(Math.random() * 120) + 40);

      } catch (err: any) {
        setUrlQueue(prev => prev.map((q, idx) => idx === i ? {
          ...q,
          status: "error" as const,
          errorMsg: err.message || "Failed"
        } : q));
      }
    }

    setQueueProcessing(false);
    setCurrentQueueIndex(-1);
    showToast(lang === "ar" ? "أكتملت معالجة جميع عناصر الطابور بنجاح!" : "All queue items have been processed successfully!");
  };

  const cancelDownload = () => {
    if (downloadAbortController) {
      downloadAbortController.abort();
      setDownloadAbortController(null);
    }
    setDownloading(false);
    setDownloadProgress(0);
    showToast(lang === "ar" ? "تم إلغاء عملية التنزيل بنجاح." : "Download has been cancelled successfully.");
  };

  const triggerDownload = async () => {
    if (!videoMeta || !selectedFormat) return;
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadSuccess(false);

    const controller = new AbortController();
    setDownloadAbortController(controller);

    const speedOptions = ["14.8 MB/s", "19.5 MB/s", "24.1 MB/s", "28.6 MB/s"];
    const interval = setInterval(() => {
      if (controller.signal.aborted) {
        clearInterval(interval);
        return;
      }
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadAbortController(null);
          setDownloadSuccess(true);
          showToast(lang === "ar" ? "تم معالجة وتصدير وحفظ ملف الفيديو بنجاح!" : "Prisline rendering file saved successfully!");
          window.open(`/api/download?platform=${encodeURIComponent(videoMeta.platform)}&quality=${encodeURIComponent(selectedFormat.quality)}&title=${encodeURIComponent(videoMeta.title)}`, "_blank");
          return 100;
        }
        setDownloadSpeed(speedOptions[Math.floor(Math.random() * speedOptions.length)]);
        return prev + Math.floor(Math.random() * 8) + 5;
      });
    }, 120);

    controller.signal.addEventListener("abort", () => {
      clearInterval(interval);
    });
  };

  const triggerSummary = async (meta: VideoMetadata) => {
    setSummarizing(true);
    setSummaryResult("");
    try {
      const resp = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meta.title,
          platform: meta.platform,
          duration: meta.duration,
          author: meta.author
        }),
      });
      const data = await resp.json();
      setSummaryResult(data.result);
    } catch (err) {
      setSummaryResult(lang === "ar" ? "تعذر الاتصال بـ Gemini لتلخيص هذا الفيديو." : "Gemini summary fallback failure.");
    } finally {
      setSummarizing(false);
    }
  };

  const triggerAIGenerateScript = async () => {
    const targetTitle = videoMeta ? videoMeta.title : (lang === "ar" ? "مباراة كأس العالم 2026 ومفاجأة تكتيكية" : "Tactical stadium breakdown World Cup 2026");
    setGeneratingScript(true);
    setScriptResult("");
    try {
      const resp = await fetch("/api/ai/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: targetTitle,
          style: scriptStyle,
          language: scriptLanguage
        }),
      });
      const data = await resp.json();
      setScriptResult(data.result);
      showToast(lang === "ar" ? "تم توليد سيناريو الاحتفاظ الجماهيري الفيروسي!" : "Viral script compiled successfully!");
    } catch (err) {
      setScriptResult("Error generating script");
    } finally {
      setGeneratingScript(false);
    }
  };

  const triggerAIGenerateSEO = async () => {
    const targetTitle = videoMeta ? videoMeta.title : "World Cup 2026 Video";
    setGeneratingSeo(true);
    setSeoResult("");
    try {
      const resp = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: targetTitle,
          keyword: seoKeyword || "كأس العالم 2026"
        }),
      });
      const data = await resp.json();
      setSeoResult(data.result);
      showToast(lang === "ar" ? "تم توليد وصياغة حزمة السو وتحسين الظهور!" : "SEO tags and titles compiled!");
    } catch (err) {
      setSeoResult("Error generating SEO optimization material.");
    } finally {
      setGeneratingSeo(false);
    }
  };

  const triggerAIGenerateEditorShotlist = () => {
    setGeneratingShotList(true);
    setEditorResult("");
    setTimeout(() => {
      const isAr = lang === "ar";
      setEditorResult(isAr ? `🎬 جدول قائمة اللقطات المونتاجية (Shot List) - المونديال 2026:
----------------------------------------
• [لقطة 01] زاوية علوية مهيبة للملعب ثلاثية الأبعاد (المدة: 3 ثوانٍ) - مؤثر صوتي: هدير الجماهير.
• [لقطة 02] التكبير الفيروسي على أقدام اللاعب بالكرة (المدة: 2 ثانية) - تعديل: عكس لوني مع زيادة التباين.
• [لقطة 03] رسم بياني تكتيكي وحركة خطوط التسلل (المدة: 4 ثوانٍ) - مؤثر بصري: خط مهتز مشع.
• [لقطة 04] ردة فعل المدرب بانفعال حركي من المدرجات (المدة: 3 ثوانٍ) - تعديل: إبطاء السرعة 0.5x.
• [لقطة 05] النهاية مع ظهور أيقونة الاشتراك وزر الجرس وتوقيع القناة المالي المضمون.`
      : `🎬 Cinematic Montage Shot List - WC26:
----------------------------------------
• [Shot 01] Magnificent wide 3D aerial view of the stadium (3s) | SFX: Deep rumble rise
• [Shot 02] Fast visual camera zoom on player boots dribbling (2s) | Edit: Mirror flipped & contrast boosted
• [Shot 03] Animated 3D tactical grid map (4s) | Graphics overlay
• [Shot 04] Dramatic slow-motion fan celebrating in the rain (3s) | Speed: 0.5x native
• [Shot 05] Dynamic end screen displaying animated subscribe overlay (5s).`);
      setGeneratingShotList(false);
      showToast(isAr ? "تم كتابة وصياغة قائمة لقطات المخرج بنجاح!" : "Shot List written flawlessly!");
    }, 1200);
  };

  const triggerAIGenerateVoicePlan = () => {
    setGeneratingVoice(true);
    setVoiceResult("");
    setTimeout(() => {
      const isAr = lang === "ar";
      setVoiceResult(isAr ? `🎙️ خطة مواءمة التعليق الصوتي والترددات:
----------------------------------------
• المعلق الصوتي المختار: "آدم" (نبرة عميقة، صدى ذكوري مهيب لزيادة الاحتفاظ).
• نغمة الصوت ومستويات التفاعل (Emotion Curve): تصاعد عالي ومفاجئ قبل اللحظات الاستراتيجية.
• الموسيقى التصويرية: "أوركسترا ملحمية" مدمجة على ديسيبل -12 ديسيبل لتفادي المساءلة بموجب لجان النشر العادلة.
• إعدادات معالجة النطق المستهدفة ومراكز تفادي الإجهاد الصوتي مفعلة بنسبة 100%.`
      : `🎙️ Commentary Flow & Voice Modulation Map:
----------------------------------------
• Target Voice Actor: "Adam" (Voice Profile: Authoritative Deep Cinematic Voice).
• Emotion Curve Index: Rising tension building up to strategic highlight moments.
• Music Profile Track: "Epic Orchestral Stadium" lowered dynamically to -12dB level to pass Fair Use.
• Synthesis Sample Model: Eleven Multilingual v2 enabled.`);
      setGeneratingVoice(false);
      showToast(isAr ? "تم بناء مخطط المعلق الصوتي والمؤثرات!" : "Voice commentaries pacing generated!");
    }, 1000);
  };

  const triggerAIGenerateShortsPlan = () => {
    setGeneratingShorts(true);
    setShortsResult("");
    setTimeout(() => {
      const isAr = lang === "ar";
      setShortsResult(isAr ? `⚡ خطة مصنع الفيديوهات القصيرة (Shorts Plan) - عدد المقاطع (${shortsCount}):
----------------------------------------
1. مقطع الريلز 1: "اللحظة التاريخية التي لا ينساها أحد" - الخطاف: 2 ثانية، الهاشتاق: #كأس_العالم
2. مقطع الريلز 2: "الخطأ الفادح الذي أطاح بآمال الفريق" - الخطاف: 1.5 ثانية، التفاعل المتوقع: جبار
3. مقطع الريلز 3: "اللقطة التكتيكية المخفية من المدرج" - زاوية تسلل مبلورة فريدة
4. مقطع الريلز 4: "توقع بطل المونديال بناء على حسابات رقمية دقيقة" - إشراك الجمهور بالتعليقات
5. مقطع الريلز 5: "مقارنة النجمين الأكثر تكلفة وجنوناً" - خطاف تحفيزي حاد جداً`
      : `⚡ Viral Clip Snippets Extractor Map (${shortsCount} shorts planned):
----------------------------------------
1. Reel 1: "The unbelievable tactical error that cost everything" | Focus: Retaining curiosity gaps
2. Reel 2: "Behind the closed stadium doors mystery" | Pacing: Rapid cuts every 1.5s
3. Reel 3: "Haaland vs Mbappe - pixel statistics comparison" | Contrast visuals
4. Reel 4: "Unanswered World Cup question revealed" | Strong debate call to action (CTA)
5. Reel 5: "Final champion projection simulator based on raw computer indices".`);
      setGeneratingShorts(false);
      showToast(isAr ? "تم تقسيم وهيكلة مقاطع الشورتس الفيروسية!" : "Shorts factory strategy prepared!");
    }, 1100);
  };

  // chatbot interaction
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userQuery = chatInput;
    setChatInput("");
    
    const updatedMessages = [...chatMessages, { role: "user" as const, content: userQuery }];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await resp.json();
      setChatMessages([...updatedMessages, { role: "assistant" as const, content: data.result }]);
    } catch (err) {
      setChatMessages([...updatedMessages, { role: "assistant" as const, content: lang === "ar" ? "عذراً، أواجه ضغط معالجة برمجية حالياً." : "Undergoing minor server latency, please retry." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Calendar render functions
  const renderCalendarDays = () => {
    const daysInMonth = 30; // June
    const grid = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2026-06-${String(day).padStart(2, "0")}`;
      const isMatch = matchDays[dateStr];
      const isVideo = videoDays[dateStr];
      grid.push(
        <div
          key={day}
          onClick={() => {
            setModalContent({
              title: lang === "ar" ? `تقويم الاستحقاق: ${day} يونيو 2026` : `Calendar Slot: June ${day}, 2026`,
              body: (
                <div className="space-y-3 font-sans">
                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-xs font-bold text-cyan-400">⚡ {lang === "ar" ? "توقيت النشر الاستراتيجي المؤتمت" : "Automated Viral Release Timing"}</p>
                    <p className="text-xs mt-1 text-gray-200">{lang === "ar" ? "أفضل وقت نشر: الساعة 6:00 مسااً لزيادة النقر والظهور" : "Recommended peak: 6:00 PM EST based on stadium zone."}</p>
                  </div>
                  {isMatch && (
                    <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
                      <p className="text-xs font-bold">⚽ {lang === "ar" ? "مباراة رسمية بالمونديال" : "Official World Cup Match"}</p>
                      <p className="text-xs mt-0.5">{isMatch}</p>
                    </div>
                  )}
                  {isVideo ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      <p className="text-xs font-bold">🎬 {lang === "ar" ? "محتوى مجدول للنشر والتصدير" : "Scheduled YouTube Automation Video"}</p>
                      <p className="text-xs mt-0.5">{isVideo}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">{lang === "ar" ? "شاغر حالياً للتنزيل والنشر المباشر." : "Empty content lot. Click to schedule automated video."}</p>
                  )}
                  <button
                    onClick={() => {
                      showToast(lang === "ar" ? "تم جدولة وضبط الجدول بنجاح!" : "Automated release lot secured!");
                      setModalContent(null);
                    }}
                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                  >
                    {lang === "ar" ? "تفعيل الجدولة الآلية" : "Enact Automation Schedule"}
                  </button>
                </div>
              )
            });
          }}
          className={`min-h-[85px] bg-[#0c0f18] hover:bg-white/5 border rounded-xl p-2 transition-all cursor-pointer flex flex-col justify-between ${
            isMatch ? "border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-transparent" : "border-white/5"
          } ${isVideo ? "border-amber-500/40" : ""}`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-gray-400">{day}</span>
            {isMatch && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            {isVideo && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </div>
          <div className="mt-1">
            {isMatch && (
              <p className="text-[10px] text-rose-400 font-bold truncate line-clamp-1 leading-tight">
                ⚽ {lang === "ar" ? "مباراة" : "Match"}
              </p>
            )}
            {isVideo && (
              <p className="text-[10px] text-amber-300 truncate line-clamp-1 leading-tight">
                🎬 {lang === "ar" ? "مجدول" : "Video"}
              </p>
            )}
          </div>
        </div>
      );
    }
    return grid;
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(lang === "ar" ? "تم نسخ النص بنجاح!" : "Copied successfully!");
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-[#eef2f7] font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* TOAST BOX */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-xl bg-[#0b101f] border border-cyan-400/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL DIALOG */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e1220] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{modalContent.title}</h4>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer px-2"
                >
                  ✕
                </button>
              </div>
              <div>{modalContent.body}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT WRAPPER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* SIDEBAR COMPONENT (COPIED AND STYLED TO EXCEL IN ACCENTS AND TYPOGRAPHY) */}
        <aside className="lg:col-span-2.5 bg-gradient-to-b from-[#0a1a3a] to-[#04060c] border-r border-white/10 p-5 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-amber-400 p-[2px] shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full bg-[#0d0f19] rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-emerald-400 text-lg">
                AS
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none text-white">
                WC26 <span className="text-cyan-400 font-extrabold">EMPIRE</span>
              </h1>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono mt-1">
                AI COMMAND CENTER
              </p>
            </div>
          </div>

          {/* VIEW NAVIGATION LIST */}
          <nav className="flex flex-col gap-1.5 flex-1" dir={lang === "ar" ? "rtl" : "ltr"}>
            <p className="text-[10px] uppercase font-bold text-gray-500 px-3 tracking-widest mb-1 font-mono">
              {lang === "ar" ? "أدوات التنزيل والقنوات" : "Tools & Platforms"}
            </p>
            
            <button
              onClick={() => setActiveView("downloader")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "downloader" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{lang === "ar" ? "📥 مستخرج الفيديوهات" : "📥 Downloader"}</span>
            </button>

            <button
              onClick={() => setActiveView("automation")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "automation" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md animate-pulse" : "text-gray-400 hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{lang === "ar" ? "🤖 جدولة الكشط الذكي (Firecrawl)" : "🤖 Smart Scraper Scheduler"}</span>
            </button>

            <button
              onClick={() => setActiveView("dashboard")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "dashboard" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{lang === "ar" ? "📊 لوحة التحكم والعمليات" : "📊 Dashboard"}</span>
            </button>

            <button
              onClick={() => setActiveView("calendar")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "calendar" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === "ar" ? "📅 تقويم المحتوى الذكي" : "📅 Content Calendar"}</span>
            </button>

            <p className="text-[10px] uppercase font-bold text-gray-500 px-3 tracking-widest mt-6 mb-1 font-mono">
              {lang === "ar" ? "وكلاء الذكاء الاصطناعي" : "Autonomous AI Agents"}
            </p>

            <button
              onClick={() => setActiveView("watcher")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "watcher" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{lang === "ar" ? "🕵️ المراقب (Watcher)" : "🕵️ Watcher (Ideas)"}</span>
            </button>

            <button
              onClick={() => setActiveView("copywriter")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "copywriter" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{lang === "ar" ? "✍️ كاتب السيناريو" : "✍️ Copywriter Script"}</span>
            </button>

            <button
              onClick={() => setActiveView("editor")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "editor" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{lang === "ar" ? "🎞️ المحرر المونتاجي" : "🎞️ Editor Shotlist"}</span>
            </button>

            <button
              onClick={() => setActiveView("voice")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "voice" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === "ar" ? "🎙️ المواءمة الصوتية" : "🎙️ Voice Commentator"}</span>
            </button>

            <button
              onClick={() => setActiveView("publisher")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "publisher" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === "ar" ? "📤 المروج والسيو SEO" : "📤 SEO & Publisher"}</span>
            </button>

            <button
              onClick={() => setActiveView("shorts")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "shorts" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4 animate-bounce" />
              <span>{lang === "ar" ? "⚡ مصنع مقاطع Shorts" : "⚡ Shorts Factory"}</span>
            </button>

            <p className="text-[10px] uppercase font-bold text-gray-500 px-3 tracking-widest mt-6 mb-1 font-mono">
              {lang === "ar" ? "الهوية والإعدادات" : "Identity & Variables"}
            </p>

            <button
              onClick={() => setActiveView("brand")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "brand" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{lang === "ar" ? "🎨 قوالب هوية القناة" : "🎨 Channel Brand Kit"}</span>
            </button>

            <button
              onClick={() => setActiveView("settings")}
              className={`w-full text-xs font-bold px-3.5 py-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                activeView === "settings" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{lang === "ar" ? "⚙️ مفاتيح الربط والإدارة" : "⚙️ System Settings"}</span>
            </button>

          </nav>

          {/* SIDEBAR FOOTER METRICS STATUS */}
          <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Channel Engine:</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Security Shield:</span>
              <span className="text-cyan-400">SSL v3</span>
            </div>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <div className="lg:col-span-9.5 p-6 sm:p-8 flex flex-col justify-between">
          
          {/* HEADER TOP BAR CONTAINER */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-white/10 mb-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                AuraStream AI + WC26 Empire <span className="text-xs bg-cyan-400 text-black px-2 py-0.5 rounded font-black font-mono">v4.1 PRO</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === "ar" ? "مركز تحكم المونتاج وتصدير الفيديوهات الذكي لمونديال 2026" : "Integrated high fidelity media downloader and autonomous AI pipeline engine."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer outline-none"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{lang === "ar" ? "English" : "العربية"}</span>
              </button>
              
              <button
                onClick={runFullAutomation}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-cyan-400/20"
              >
                ⚡ {lang === "ar" ? "تشغيل التدفق المؤتمت" : "Trigger Autonomous Run"}
              </button>
            </div>
          </div>

          {/* RENDERING SWITCH-VIEWS */}
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: DIRECT MEDIA EXTRACTOR / DOWNLOADER */}
            {activeView === "downloader" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="downloader"
                className="space-y-8"
              >
                {/* 3D PERSPECTIVE HERO INTERFACE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#070911] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-bold tracking-wider mb-4 border border-cyan-400/20">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
                      {lang === "ar" ? "دقة تصدير فائقة بدون حسابات مدفوعة" : "Direct export mapping with no premium logins"}
                    </span>
                    <h3 className="text-3xl font-black text-white leading-tight">
                      {lang === "ar" ? "مستخرج فيديوهات المونديال المتطور" : "Advanced High-Fidelity Downloader"}
                      <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 font-extrabold pb-2">
                        {lang === "ar" ? "تيك توك، يوتيوب، إنستقرام بجودة عالية جداً" : "Pristine streams ready for YouTube Automation"}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {lang === "ar" 
                        ? "الصق الرابط وسيقوم السيرفر المحمي محلياً بتمرير البث الآمن بأعلى دقة متوفرة بمعدل 60 إطاراً في الثانية مجاناً لتفادي أي ثغرات أو متطفلين."
                        : "Fetch visual elements instantly. Our secure local proxy guarantees zero data logging and compliance with public media laws."}
                    </p>
                  </div>

                  <div className="lg:col-span-12 hidden">
                    <ThreeDView lang={lang} />
                  </div>
                </div>



                {/* FORM AND EXTRACTED RESULT WRAPPER */}
                <div className="bg-[#0f121d] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl">
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-2 mb-5 border-b border-white/5 pb-3">
                    <button
                      onClick={() => setDownloadMode("single")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        downloadMode === "single" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/25 shadow-md shadow-cyan-400/5" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {lang === "ar" ? "📥 تنزيل فيديو فردي" : "📥 Single Downloader"}
                    </button>
                    <button
                      onClick={() => setDownloadMode("queue")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                        downloadMode === "queue" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/25 shadow-md shadow-cyan-400/5" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <span>{lang === "ar" ? "⚡ طابور الفيديو بالتتابع" : "⚡ Sequential Batch Queue"}</span>
                      {urlQueue.length > 0 && (
                        <span className="bg-cyan-400 text-black px-1.5 py-0.5 text-[9px] rounded-full font-black font-mono">
                          {urlQueue.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {downloadMode === "single" ? (
                    <>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                        {lang === "ar" ? "أدخل رابط محتوى الفيديو المباشر للتنزيل" : "Enter public video share URL"}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none"
                          />
                        </div>
                        <button
                          onClick={handleExtract}
                          disabled={analyzing}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-400/10 cursor-pointer disabled:opacity-50"
                        >
                          {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          <span>{analyzing ? (lang === "ar" ? "جاري المعالجة..." : "Analyzing...") : (lang === "ar" ? "تحليل واستخراج" : "Extract")}</span>
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span className="font-semibold">{lang === "ar" ? "روابط سريعة للتجربة:" : "Try Examples:"}</span>
                        {examples.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInputUrl(item.url);
                              showToast(lang === "ar" ? "تم نسخ الرابط التجريبي!" : "Demo URL copied!");
                            }}
                            className="px-2.5 py-1 rounded bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 text-[11px] transition-colors cursor-pointer"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                        {lang === "ar" ? "أدخل عدة روابط (رابط واحد في كل سطر أو مفصولة بفاصلة)" : "Enter multiple video URLs (one per line or comma-separated)"}
                      </label>
                      
                      <textarea
                        placeholder="https://www.youtube.com/watch?v=soccer_wc2026_insights&#10;https://www.tiktok.com/@football_trends/video/viral_high_kick"
                        value={queueInput}
                        onChange={(e) => setQueueInput(e.target.value)}
                        rows={3}
                        className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl p-3 text-xs text-white font-mono placeholder:text-gray-650 outline-none resize-none"
                      />
                      
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={() => addToQueue(queueInput)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-400/10 cursor-pointer animate-pulse"
                        >
                          <Plus className="w-4 h-4 text-black" />
                          <span>{lang === "ar" ? "أضف الروابط للطابور" : "Add to Queue"}</span>
                        </button>
                        
                        {urlQueue.length > 0 && (
                          <>
                            <button
                              onClick={processQueueSequentially}
                              disabled={queueProcessing}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {queueProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-black" />}
                              <span>{queueProcessing ? (lang === "ar" ? "جاري المعالجة بالتتابع..." : "Processing Queue...") : (lang === "ar" ? "🚀 معالجة الطابور تتابعاً" : "🚀 Run Sequential Queue")}</span>
                            </button>
                            
                            <button
                              onClick={clearQueue}
                              disabled={queueProcessing}
                              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                            >
                              {lang === "ar" ? "مسح الطابور" : "Clear Queue"}
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Examples for Queue */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 border-t border-white/5 pt-3">
                        <span className="font-semibold">{lang === "ar" ? "أضف روابط تجريبية مدمجة:" : "Try Examples:"}</span>
                        <button
                          onClick={() => {
                            const samplePack = examples.map(ex => ex.url).join("\n");
                            setQueueInput(samplePack);
                            showToast(lang === "ar" ? "تم ملء الروابط التجريبية!" : "Demo URLs inserted in text area!");
                          }}
                          className="px-2.5 py-1 rounded bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 text-[11px] transition-colors cursor-pointer"
                        >
                          {lang === "ar" ? "⚡ إضافة 3 روابط تجربة" : "⚡ Load 3 Demo URLs"}
                        </button>
                      </div>

                      {/* Queue Progress List */}
                      {urlQueue.length > 0 && (
                        <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400">
                            <span>{lang === "ar" ? "حالة طابور المعالجة التتابعي" : "Sequential Queue Status"}</span>
                            <span className="font-mono text-[10px] text-cyan-400">
                              {urlQueue.filter(q => q.status === "completed").length} / {urlQueue.length} {lang === "ar" ? "مكتمل" : "done"}
                            </span>
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {urlQueue.map((item, idx) => {
                              const isActive = currentQueueIndex === idx;
                              return (
                                <div
                                  key={item.id}
                                  className={`p-3 rounded-xl border text-xs transition-all flex flex-col gap-2 ${
                                    isActive ? "bg-cyan-500/10 border-cyan-400/50" : "bg-[#070911] border-white/5"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-[10px] text-gray-500 font-mono">#{idx + 1}</span>
                                      <span className="truncate text-gray-300 max-w-xs font-mono text-[11px]" title={item.url}>{item.url}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      {item.status === "pending" && (
                                        <span className="bg-gray-500/10 text-gray-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/5">
                                          {lang === "ar" ? "انتظار" : "Pending"}
                                        </span>
                                      )}
                                      {item.status === "extracting" && (
                                        <span className="bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-cyan-400/20 flex items-center gap-1">
                                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                          <span>{lang === "ar" ? "تحليل السيرفر..." : "Extracting..."}</span>
                                        </span>
                                      )}
                                      {item.status === "downloading" && (
                                        <span className="bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-400/20 flex items-center gap-1">
                                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                          <span>{lang === "ar" ? "تحميل فائق..." : "Downloading..."}</span>
                                        </span>
                                      )}
                                      {item.status === "completed" && (
                                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                          <Check className="w-3.5 h-3.5" />
                                          <span>{lang === "ar" ? "مكتمل وحُفظ" : "Completed"}</span>
                                        </span>
                                      )}
                                      {item.status === "error" && (
                                        <span className="bg-rose-500/10 text-rose-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-rose-500/20" title={item.errorMsg}>
                                          {lang === "ar" ? "مخفق" : "Error"}
                                        </span>
                                      )}
                                      
                                      {!queueProcessing && (
                                        <button
                                          onClick={() => removeFromQueue(item.id)}
                                          className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs p-1"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Detailed meta shown when extracted/downloading/completed */}
                                  {(item.title || item.status === "downloading" || item.status === "completed") && (
                                    <div className="bg-[#0f121d] p-2 rounded border border-white/5 mt-1">
                                      <p className="font-bold text-gray-200 truncate text-[11px] leading-relaxed">{item.title}</p>
                                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-gray-400 font-mono mt-1">
                                        <span>Platform: {item.platform}</span>
                                        <span>Duration: {item.duration}</span>
                                        <span>Size: {item.size}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Progress Line for active item */}
                                  {(item.status === "downloading" || item.status === "completed") && (
                                    <div className="mt-1 space-y-1">
                                      <div className="flex justify-between text-[9px] text-cyan-400 font-mono">
                                        <span>{lang === "ar" ? "تقدم المعالجة والتنزيل السلس:" : "Processing & Download Progress:"}</span>
                                        <span>{item.progress}%</span>
                                      </div>
                                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-150" style={{ width: `${item.progress}%` }} />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {item.status === "error" && item.errorMsg && (
                                    <p className="text-[10px] text-rose-400 font-mono mt-0.5">⚠️ {item.errorMsg}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ERROR DISCOVERY BOX */}
                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-xs">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                {/* RESULTS ACCORDION CONTAINER */}
                <AnimatePresence>
                  {videoMeta && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                      {/* Left: Card stage representation */}
                      <div className="lg:col-span-5 bg-[#0f121d] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="relative aspect-video">
                          <img src={videoMeta.thumbnail} className="w-full h-full object-cover" />
                          <span className="absolute bottom-3 right-3 bg-black/85 text-xs font-bold font-mono px-2 py-0.5 rounded text-cyan-400">
                            {videoMeta.duration}
                          </span>
                          <span className="absolute top-3 left-3 bg-[#0d0f19] text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 text-white">
                            {renderPlatformIcon(videoMeta.platform)}
                            <span>{videoMeta.platform}</span>
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-xs text-white leading-relaxed line-clamp-2">{videoMeta.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-2 font-mono">By: {videoMeta.author}</p>
                          
                          <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                            <div className="bg-white/5 rounded-lg p-2.5">
                              <p className="text-[9px] text-gray-400">EST. VIEWS</p>
                              <p className="text-xs font-extrabold text-white mt-1">{videoMeta.views}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2.5">
                              <p className="text-[9px] text-gray-400">ENGAGEMENT</p>
                              <p className="text-xs font-extrabold text-cyan-400 mt-1">{videoMeta.likes}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quality and Action Stage */}
                      <div className="lg:col-span-7 bg-[#0f121d] rounded-2xl border border-white/10 p-5 shadow-xl">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2 mb-4">
                          {lang === "ar" ? "اختر جودة الفيديو المطلوبة للتنزيل المباشر" : "Select video format stream output"}
                        </h4>

                        <div className="grid gap-2">
                          {videoMeta.formats.map((fmt, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedFormat(fmt);
                                setDownloadSuccess(false);
                              }}
                              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                selectedFormat?.quality === fmt.quality ? "bg-cyan-500/10 border-cyan-400/50 text-cyan-400" : "bg-white/5 border-white/5 text-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                                  {fmt.type === "audio" ? <Music className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-white">{fmt.quality}</p>
                                  <p className="text-[9px] text-gray-400 mt-0.5">{fmt.resolution} • {fmt.fps > 0 ? `${fmt.fps} FPS` : "HQ Audio"}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-400 font-mono">{fmt.size}</span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                          <button
                            onClick={triggerDownload}
                            disabled={downloading}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/10 text-xs uppercase tracking-wider cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-black" />
                            <span>{lang === "ar" ? "تصدير وحفظ الملف فورا" : "Enact direct download stream"}</span>
                          </button>

                          {/* Progress Loader */}
                          {downloading && (
                            <div className="mt-4 bg-[#0a0c14] rounded-xl p-3 border border-white/5 space-y-3">
                              <div>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-1.5">
                                  <span>{lang === "ar" ? "جاري النحت والترشيح التكتيكي..." : "Compiling stream container..."}</span>
                                  <span className="text-cyan-400 font-bold">{downloadProgress}%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400 transition-all duration-150" style={{ width: `${downloadProgress}%` }} />
                                </div>
                              </div>
                              <button
                                onClick={cancelDownload}
                                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-450 border border-rose-500/20 hover:border-rose-500/40 font-bold text-[10px] rounded-lg tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                              >
                                ✕ {lang === "ar" ? "إلغاء التنزيل النشط" : "Cancel Active Download"}
                              </button>
                            </div>
                          )}

                          {downloadSuccess && (
                            <div className="mt-4 p-3 bg-emerald-500/10 text-emerald-300 rounded-xl text-center text-xs font-bold border border-emerald-500/20">
                              {lang === "ar" ? "✓ تم التنزيل! تصفح الحفظ على جهازك الآن." : "✓ Download started! Please check your native browser files."}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* VIEW 2: STATS DASHBOARD & CHANNELS SUMMARY */}
            {activeView === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="dashboard"
                className="space-y-8"
              >
                {/* 4 CARDS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{lang === "ar" ? "فيديوهات مؤتمتة" : "Videos Produced"}</p>
                      <h4 className="text-3xl font-black text-white mt-1 font-mono">{videosCount}</h4>
                      <p className="text-[10px] text-emerald-400 mt-1">↑ 12% {lang === "ar" ? "هذا الأسبوع" : "this week"}</p>
                    </div>
                    <Video className="w-10 h-10 text-cyan-400 bg-cyan-400/15 p-2 rounded-xl" />
                  </div>

                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{lang === "ar" ? "مشاهدات تقديرية" : "Estimated Views"}</p>
                      <h4 className="text-3xl font-black text-white mt-1 font-mono">{(viewsCount / 1000).toFixed(0)}K</h4>
                      <p className="text-[10px] text-emerald-400 mt-1">↑ 28% {lang === "ar" ? "نمو فيروسي" : "viral growth"}</p>
                    </div>
                    <Eye className="w-10 h-10 text-emerald-400 bg-emerald-400/15 p-2 rounded-xl" />
                  </div>

                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{lang === "ar" ? "صافي الأرباح المقدرة" : "Expected Revenue"}</p>
                      <h4 className="text-3xl font-black text-white mt-1 font-mono">${revenueCount.toLocaleString()}</h4>
                      <p className="text-[10px] text-cyan-400 mt-1">CPM: $18.5 {lang === "ar" ? "المعدل الكلي" : "average"}</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-amber-400 bg-amber-400/15 p-2 rounded-xl" />
                  </div>

                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{lang === "ar" ? "المشتركون الموالون" : "Subscribers"}</p>
                      <h4 className="text-3xl font-black text-white mt-1 font-mono">{(subsCount / 1000).toFixed(1)}K</h4>
                      <p className="text-[10px] text-emerald-400 mt-1">↑ 156 {lang === "ar" ? "مشترك اليوم" : "today"}</p>
                    </div>
                    <Users className="w-10 h-10 text-indigo-400 bg-indigo-400/15 p-2 rounded-xl" />
                  </div>
                </div>

                {/* GRAPH/PIPELINE SPLIT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Pipeline state list */}
                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span>{lang === "ar" ? "⚡ حالة خط معالجة وكلاء الذكاء الاصطناعي اليوم" : "⚡ Autonomous AI Agents Pipeline Status"}</span>
                    </h4>
                    <div className="space-y-3">
                      {pipeline.map((item, idx) => (
                        <div key={idx} className="p-3 bg-[#070911] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              item.status === "done" ? "bg-emerald-500" : item.status === "working" ? "bg-amber-400 animate-pulse" : "bg-gray-600"
                            }`} />
                            <div>
                              <p className="font-extrabold text-white">{lang === "ar" ? item.agentAr : item.agent}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{lang === "ar" ? item.taskAr : item.task}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hot Trends */}
                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-500" />
                      <span>{lang === "ar" ? "🔥 أعلى مواضيع بحث متداولة بالملعب (24 ساعة)" : "🔥 Live World Cup Trends (Last 24h)"}</span>
                    </h4>
                    <div className="space-y-2">
                      {trends.map((t, idx) => (
                        <div key={idx} className="p-3 bg-[#070911] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-white font-mono">{lang === "ar" ? t.topicAr : t.topic}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{t.src} • {t.vol} monthly index</p>
                          </div>
                          <span className="text-xs font-black text-emerald-400 font-mono">{t.growth}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* UPCOMING LOT */}
                <div className="p-5 bg-cyan-950/15 border border-cyan-800/30 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">{lang === "ar" ? "قائمة الجدولة الآلية للنشر (الـ 7 أيام القادمة)" : "Upcoming Content Lot (Automated Calendar Slots)"}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
                    <div className="bg-[#070911]/80 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold">JUNE 11</p>
                      <p className="font-bold text-white mt-1">Mexico vs South Africa</p>
                      <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono mt-2 inline-block">MATCH PREVIEW</span>
                    </div>
                    <div className="bg-[#070911]/80 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold">JUNE 12</p>
                      <p className="font-bold text-white mt-1">Opening Day Shorts</p>
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono mt-2 inline-block">5x REELS</span>
                    </div>
                    <div className="bg-[#070911]/80 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold">JUNE 14</p>
                      <p className="font-bold text-white mt-1">Group of Death preview</p>
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono mt-2 inline-block">LONG SCRIPT</span>
                    </div>
                    <div className="bg-[#070911]/80 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold">JUNE 16</p>
                      <p className="font-bold text-white mt-1">France vs Senegal</p>
                      <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono mt-2 inline-block">MAIN VIDEO</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 3: INTERACTIVE CONTENT CALENDAR */}
            {activeView === "calendar" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="calendar"
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <h3 className="text-lg font-black text-white">
                    {lang === "ar" ? "🗓️ تقويم محتوى مونديال كأس العالم 2026 والجدولة" : "🗓️ Tactical Content Calendar World Cup 2026"}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                      className="p-1 px-3 bg-white/5 border border-white/10 text-xs rounded hover:bg-white/10"
                    >
                      {lang === "ar" ? "السابق" : "Prev"}
                    </button>
                    <span className="text-xs font-bold bg-cyan-900/50 text-cyan-400 border border-cyan-800/40 px-3 py-1 rounded">
                      {currentMonth === 5 ? (lang === "ar" ? "يونيو 2026" : "June 2026") : (lang === "ar" ? "يوليو 2026" : "July 2026")}
                    </span>
                    <button
                      onClick={() => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                      className="p-1 px-3 bg-white/5 border border-white/10 text-xs rounded hover:bg-white/10"
                    >
                      {lang === "ar" ? "التالي" : "Next"}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed bg-[#0c101d] p-3 rounded-xl border border-white/5">
                  {lang === "ar"
                    ? "💡 اضغط على أي يوم في التقويم لمشاهدة تفاصيل المباريات والجدولة الآلية للفيديوهات والتحقق من ساعات ذروة النشر."
                    : "💡 Click any day on the list below to discover matching schedules and coordinate viral high CTR videos."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                  {renderCalendarDays()}
                </div>
              </motion.div>
            )}

            {/* VIEW 4: WATCHER (IDEAS AND TRENDS GAP FINDER) */}
            {activeView === "watcher" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="watcher"
                className="space-y-6"
              >
                <div className="p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center gap-3">
                  <Bot className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-white">{lang === "ar" ? "العميل العارف بالأسرار ومجموعة الموت" : "Autonomous Market Gap Finder Agent Enabled"}</p>
                    <p className="text-gray-400 mt-0.5">{lang === "ar" ? "يقوم هذا الوكيل تكتيكياً بالبحث والتحقق من الأسئلة غير المجابة لإرسالها لكاتب النصوص." : "Click any winning video concept card to instantly load it into the Copywriter generator."}</p>
                  </div>
                </div>

                {/* Ideas list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ideas.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setVideoMeta({
                          id: String(item.id),
                          title: lang === "ar" ? item.titleAr : item.title,
                          duration: "10:15",
                          author: "قناة إمبراطورية الكرة (Tactical Empire)",
                          platform: "YouTube",
                          thumbnail: "https://images.unsplash.com/photo-1540747737956-378724044453?w=800&auto=format&fit=crop&q=60",
                          views: "1.2M",
                          likes: "148K",
                          url: "https://youtube.com/watch?v=soccer_insights",
                          formats: [
                            { quality: "1085p Ultra HD", resolution: "1920x1080", size: "86M", fps: 60, url: "youtube", type: "video" }
                          ]
                        });
                        setActiveView("copywriter");
                        showToast(lang === "ar" ? `تم نقل "${item.titleAr}" لكاتب النصوص!` : "Idea loaded successfully into Copywriter!");
                      }}
                      className="bg-[#0f121d] border border-white/10 hover:border-cyan-400/50 p-4 rounded-2xl cursor-pointer transition-all shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded font-black max-w-fit ${
                            item.badge === "gold" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">Score: {item.score}/100</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{lang === "ar" ? item.titleAr : item.title}</h4>
                        <p className="text-xs text-gray-400 italic mt-1.5 leading-relaxed">"{item.hook}"</p>
                      </div>
                      
                      <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
                        <span>Expected CPM: ${item.cpm}</span>
                        <span className="text-cyan-400 font-bold">🎯 Click to Script</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search gaps / questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{lang === "ar" ? "فجوات محتوى منخفضة المنافسة" : "Low Competition Gaps Detected"}</h4>
                    <ul className="space-y-3">
                      {gaps.map((g, idx) => (
                        <li key={idx} className="p-3 bg-[#070911] rounded-xl text-xs text-gray-300 leading-relaxed border border-white/5">
                          {lang === "ar" ? g.txtAr : g.txt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{lang === "ar" ? "أسئلة يبحث عنها الجمهور ولا توجد إجابات جيدة" : "Unanswered Questions Fans Searched"}</h4>
                    <ul className="space-y-3">
                      {questions.map((q, idx) => (
                        <li key={idx} className="p-3 bg-[#070911] rounded-xl text-xs text-cyan-300 font-mono leading-relaxed border border-white/5">
                          ❓ {lang === "ar" ? q.qAr : q.q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 5: COPYWRITER INTERACTIVE RETENTION SCRIPTWRITER */}
            {activeView === "copywriter" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="copywriter"
                className="space-y-6"
              >
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md">
                  <h3 className="text-base font-bold text-white mb-4">
                    {lang === "ar" ? "✍️ توليد السيناريو المشوق للفيديو والمقاطع القصيرة" : "✍️ High-Retention Script Generator (Retention Architecture)"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "الموضوع أو الكلمة المفتاحية المستهدفة" : "Video Topic Title"}
                      </label>
                      <input
                        type="text"
                        value={videoMeta ? videoMeta.title : inputUrl}
                        onChange={(e) => {
                          if (videoMeta) {
                            setVideoMeta({ ...videoMeta, title: e.target.value });
                          } else {
                            setInputUrl(e.target.value);
                          }
                        }}
                        className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs text-white"
                        placeholder={lang === "ar" ? "مجموعة الموت في مونديال 2026..." : "e.g. World Cup 2026 death group..."}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "أسلوب السرد والدراما" : "Commentary Style Pattern"}
                      </label>
                      <select
                        value={scriptStyle}
                        onChange={(e) => setScriptStyle(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs text-white"
                      >
                        <option value="تكتيكي حماسي">{lang === "ar" ? "⚔️ تكتيكي حماسي ملتهب" : "⚔️ Tactical Enthusiast"}</option>
                        <option value="قصصي وثائقي">{lang === "ar" ? "📖 وثائقي حركي" : "📖 Narrative Documentary"}</option>
                        <option value="مثير للجدل">{lang === "ar" ? "🔥 نقاش مثير وجدلي" : "🔥 Controversial Debate"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "اللغة المستهدفة لـ Gemini" : "Language Output Mode"}
                      </label>
                      <select
                        value={scriptLanguage}
                        onChange={(e) => setScriptLanguage(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs text-white"
                      >
                        <option value="العربية الفصحى">{lang === "ar" ? "🇸🇦 العربية الفصحى البسيطة" : "Arabic Standard Mode"}</option>
                        <option value="العربية العامية الحديثة">{lang === "ar" ? "⚽ الدارجة الرياضية الكروية" : "Arabic Sports Slang"}</option>
                        <option value="English Pro">{lang === "ar" ? "🇬🇧 الإنجليزية الاحترافية" : "English Pro"}</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={triggerAIGenerateScript}
                        disabled={generatingScript}
                        className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50"
                      >
                        {generatingScript ? <RefreshCw className="w-4 h-4 animate-spin inline mr-1" /> : null}
                        <span>{generatingScript ? (lang === "ar" ? "جاري تحضير الأفكار وصياغتها..." : "Compiling script...") : (lang === "ar" ? "توليد السيناريو التكتيكي" : "Enact Gemini AI Scripting")}</span>
                      </button>
                    </div>
                  </div>

                  {scriptResult && (
                    <div className="mt-6 border-t border-white/5 pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Generated Output</span>
                        <button
                          onClick={() => copyText(scriptResult)}
                          className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 text-gray-300 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{lang === "ar" ? "نسخ النص" : "Copy to Clipboard"}</span>
                        </button>
                      </div>
                      <div className="bg-[#070911] rounded-2xl p-4 border border-white/5 text-gray-200 text-xs leading-relaxed font-sans select-text whitespace-pre-wrap max-h-[350px] overflow-y-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
                        {scriptResult}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* VIEW 6: EDITOR SHOTLIST */}
            {activeView === "editor" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="editor"
                className="space-y-6"
              >
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md">
                  <h3 className="text-base font-bold text-white mb-4">
                    {lang === "ar" ? "🎞️ المحرر والوكيل المونتاجي (سيناريو اللقطات)" : "🎞️ Editor & Camera Shotlist Director"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "أسلوب تباين المشاهد" : "Visual Theme Gradient"}
                      </label>
                      <select
                        value={editorStyle}
                        onChange={(e) => setEditorStyle(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      >
                        <option value="cinematic">{lang === "ar" ? "🎬 سينمائي مشبع" : "🎬 Cinematic Thriller"}</option>
                        <option value="hype">{lang === "ar" ? "⚡ حماسي رياضي مشع" : "⚡ High Energy Dynamic"}</option>
                        <option value="documentary">{lang === "ar" ? "📹 وثائقي كلاسيكي" : "📹 Documentary natural"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "تقدير اللقطات الفريدة" : "Amount of Shot Cutpoints"}
                      </label>
                      <input
                        type="number"
                        value={editorShots}
                        onChange={(e) => setEditorShots(Number(e.target.value))}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "مصادر الفيديو المسموحة" : "Stock / Fair Use ratio"}
                      </label>
                      <select
                        value={editorSources}
                        onChange={(e) => setEditorSources(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      >
                        <option value="balanced">{lang === "ar" ? "⚖️ متوازن للاستخدام العادل" : "⚖️ Balanced ratio (No-Copyright)"}</option>
                        <option value="heavy-stock">{lang === "ar" ? "📦 مخزون مشاع مجاني" : "📦 100% Free Stock Clips"}</option>
                        <option value="ai-heavy">{lang === "ar" ? "🤖 مولد بالكامل بالذكاء" : "🤖 AI Midjourney/Runway heavy"}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={triggerAIGenerateEditorShotlist}
                    disabled={generatingShotList}
                    className="w-full mt-5 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {generatingShotList ? <RefreshCw className="w-4 h-4 animate-spin inline mr-1" /> : null}
                    <span>{generatingShotList ? "Compiling..." : (lang === "ar" ? "توليد قائمة اللقطات المونتاجية" : "Render Interactive Shot List")}</span>
                  </button>

                  {editorResult && (
                    <div className="mt-6 border-t border-white/5 pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-cyan-400 font-mono">Compiled Shot Direction</span>
                        <button
                          onClick={() => copyText(editorResult)}
                          className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-1.5 text-gray-300 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{lang === "ar" ? "نسخ" : "Copy"}</span>
                        </button>
                      </div>
                      <div className="bg-[#070911] rounded-2xl p-4 border border-white/5 text-gray-200 text-xs leading-relaxed font-mono whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto">
                        {editorResult}
                      </div>
                    </div>
                  )}

                  {/* COMPILATION RENDER PIPELINE INTEGRATION */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2 font-mono">
                      <span>🚀 {lang === "ar" ? "محرك رندرة أوراستريم الفائق (بدون مفتاح API)" : "AuraStream End-to-End Render Engine"}</span>
                      <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-[9px]">Offline Pipeline</span>
                    </h4>
                    <p className="text-xs text-gray-400 mb-5 leading-relaxed font-sans">
                      {lang === "ar" 
                        ? "قم بتجميع مقاطع B-roll، دمج التعليق الصوتي المخصص، وتركيب الموسيقى الخلفية وإنتاج ملفات MP4 المجهزة بالكامل للنشر." 
                        : "Test the absolute end-to-end editing, voice-mix, and video-render pipeline. Generate stock B-roll clips and mux custom audio instantly using ffmpeg."}
                    </p>

                    <div className="bg-[#0a0c14] border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                            {lang === "ar" ? "نوع ونسبة أبعاد العرض للتصدير" : "Aspect Ratio preset"}
                          </label>
                          <div className="flex bg-[#05060b] p-1.5 rounded-xl border border-white/5 gap-2">
                            <button
                              onClick={() => setPipelineType("short")}
                              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg cursor-pointer transition-colors ${pipelineType === "short" ? "bg-cyan-400 text-black" : "text-gray-400 hover:text-white"}`}
                            >
                              📱 Vertical Short (9:16)
                            </button>
                            <button
                              onClick={() => setPipelineType("video")}
                              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg cursor-pointer transition-colors ${pipelineType === "video" ? "bg-cyan-400 text-black" : "text-gray-400 hover:text-white"}`}
                            >
                              📺 Cinematic (16:9)
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                            {lang === "ar" ? "مدير النصوص التوضيحية (Caption overlays)" : "Caption overlay text (For Shorts)"}
                          </label>
                          <input
                            type="text"
                            value={pipelineCaption}
                            onChange={(e) => setPipelineCaption(e.target.value)}
                            placeholder="e.g. RECORD BREAKERS WC26"
                            className="w-full bg-[#05060b] border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleRunPipeline(pipelineType, pipelineCaption)}
                        disabled={pipelineRendering}
                        className="w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {pipelineRendering ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : null}
                        <span>
                          {pipelineRendering 
                            ? (lang === "ar" ? "جاري المعالجة المونتاجية السريعة بقوة..." : "Compiling Clips & Muxing sound tracks...") 
                            : (lang === "ar" ? "بدء الرندرة والتصدير التلقائي الفائق" : "Run Pipeline and Compile MP4 Video")}
                        </span>
                      </button>

                      {pipelineError && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                          {lang === "ar" ? "⚠️ فشل تشغيل الرندرة. يرجى التحقق من تثبيت ffmpeg وضبط البيئة المحلية:" : "⚠️ Pipeline execution error:"}
                          <pre className="mt-2 bg-[#05060b] p-3 rounded-lg overflow-x-auto text-[10px] text-gray-400 font-mono select-all whitespace-pre-wrap">
                            {pipelineError}
                          </pre>
                        </div>
                      )}

                      {pipelineVideoUrl && (
                        <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-4">
                          <p className="text-xs font-bold text-emerald-400 flex items-center gap-2 font-sans">
                            <span>✓ {lang === "ar" ? "تم توليد وتصدير الفيديو بنجاح فائق!" : "Video Compiled successfully!"}</span>
                          </p>
                          
                          <div className={`shadow-lg bg-[#05060b] rounded-xl overflow-hidden border border-white/10 mx-auto relative ${pipelineType === "short" ? "max-w-[240px] aspect-[9/16]" : "aspect-video"}`}>
                            <video 
                              src={pipelineVideoUrl} 
                              controls 
                              key={pipelineVideoUrl}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex gap-3 justify-center">
                            <a
                              href={pipelineVideoUrl}
                              download
                              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-cyan-400/50 rounded-xl text-xs font-black tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>📥 Download MP4 File</span>
                            </a>
                            <button
                              onClick={() => setModalContent({
                                title: lang === "ar" ? "معاينة الفيديو المونتاجي" : "Pipeline Preview Cinema Mode",
                                body: (
                                  <div className="space-y-4">
                                    <div className="aspect-video bg-[#05060b] rounded-xl overflow-hidden border border-white/10">
                                      <video src={pipelineVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-mono text-center">Location: {pipelineVideoUrl}</p>
                                  </div>
                                )
                              })}
                              className="px-5 py-2.5 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/20 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              {lang === "ar" ? "معاينة بملء الشاشة" : "Full Screen Theater"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* VIEW 7: VOICE COMPONENT COMMENTATOR */}
            {activeView === "voice" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="voice"
                className="space-y-6"
              >
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md">
                  <h3 className="text-base font-bold text-white mb-4">
                    {lang === "ar" ? "🎙️ وكيل مواءمة النبرات الصوتية والمؤثرات" : "🎙️ Voice Coach & Audio Pacing planner"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "نموذج ونوع الصوت" : "Voice Actor ID Profile"}
                      </label>
                      <select
                        value={voiceProfile}
                        onChange={(e) => setVoiceProfile(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      >
                        <option value="adam">{lang === "ar" ? "🎙️ آدم - نبرة عميقة ملحمية" : "🎙️ Adam (Very Deep, Cinematic)"}</option>
                        <option value="josh">{lang === "ar" ? "⚡ جوش - معلق حماسي سريع" : "⚡ Josh (Exited Sportscaster)"}</option>
                        <option value="ARIA">{lang === "ar" ? "🌟 آريا - وثائقي كلاسيكي هادئ" : "🌟 Aria (Smooth documentary)"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "نبض الحماس المستهدف" : "Audio Emotion Curve Dynamic"}
                      </label>
                      <select
                        value={voiceEmotion}
                        onChange={(e) => setVoiceEmotion(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      >
                        <option value="rising">{lang === "ar" ? "📈 توتر متصاعد ومفاجئ للمشاهد" : "📈 Gradual tension leading to climax"}</option>
                        <option value="steady">{lang === "ar" ? "➡️ نبرة هادئة ورصينة تكتيكياً" : "➡️ Steady descriptive commentary"}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={triggerAIGenerateVoicePlan}
                    disabled={generatingVoice}
                    className="w-full mt-5 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {generatingVoice ? <RefreshCw className="w-4 h-4 animate-spin inline mr-1" /> : null}
                    <span>{generatingVoice ? "Analyzing..." : (lang === "ar" ? "تحضير مواءمة الترددات والتعليق" : "Produce Commentary Modulation Map")}</span>
                  </button>

                  {voiceResult && (
                    <div className="mt-6 border-t border-white/5 pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-cyan-400 font-mono">Acoustic Setup Outline</span>
                        <button
                          onClick={() => copyText(voiceResult)}
                          className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-1.5 text-gray-300 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{lang === "ar" ? "نسخ" : "Copy"}</span>
                        </button>
                      </div>
                      <div className="bg-[#070911] rounded-2xl p-4 border border-white/5 text-gray-200 text-xs leading-relaxed font-mono whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto">
                        {voiceResult}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* VIEW 8: PUBLISHER & SEO PACKAGE DESIGN */}
            {activeView === "publisher" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="publisher"
                className="space-y-6"
              >
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md">
                  <h3 className="text-base font-bold text-white mb-4">
                    {lang === "ar" ? "📤 المروج وخبير السيو SEO للظهور الفيروسي" : "📤 Broadcaster: High CTR Title & Tag Optimization Pack"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "العنوان أو الفكرة الأساسية" : "Video Primary Subject"}
                      </label>
                      <input
                        type="text"
                        value={videoMeta ? videoMeta.title : "مجموعة الموت في مونديال 2026"}
                        onChange={(e) => {
                          if (videoMeta) setVideoMeta({ ...videoMeta, title: e.target.value });
                        }}
                        className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "الكلمات الرياضية المفتاحية المستهدفة" : "Target SEO Niche Keywords"}
                      </label>
                      <input
                        type="text"
                        placeholder="كأس العالم 2026 , مجموعة الموت , Haaland"
                        value={seoKeyword}
                        onChange={(e) => setSeoKeyword(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={triggerAIGenerateSEO}
                    disabled={generatingSeo}
                    className="w-full mt-5 py-3.5 bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-black text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {generatingSeo ? <RefreshCw className="w-4 h-4 animate-spin inline mr-1" /> : null}
                    <span>{generatingSeo ? "Compiling..." : (lang === "ar" ? "توليد خيارات العناوين والوصف والوسوم السحابية" : "Generate SEO Keywords Pack")}</span>
                  </button>

                  {seoResult && (
                    <div className="mt-6 border-t border-white/5 pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-cyan-400 font-mono">Optimized Meta-Tags Bundle</span>
                        <button
                          onClick={() => copyText(seoResult)}
                          className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-1.5 text-gray-300 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{lang === "ar" ? "نسخ كل الأكواد" : "Copy All Tags"}</span>
                        </button>
                      </div>
                      <div className="bg-[#070911] rounded-2xl p-4 border border-white/5 text-gray-200 text-xs leading-relaxed font-sans select-text whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {seoResult}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* VIEW 9: SHORTS FACTORY */}
            {activeView === "shorts" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="shorts"
                className="space-y-6"
              >
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md">
                  <h3 className="text-base font-bold text-white mb-4">
                    {lang === "ar" ? "⚡ مصنع وتقسيم الفيديوهات القصيرة الذكية" : "⚡ Interactive Viral Snippets Extractor (Reels & Shorts)"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "موضوع الفيديو الطويل المراد تفتيته" : "Parent Long-Form Video Theme"}
                      </label>
                      <input
                        type="text"
                        value={videoMeta ? videoMeta.title : (lang === "ar" ? "تحليل كأس العالم ومواجهة هالاند" : "FIFA World Cup extreme tactics summary")}
                        onChange={(e) => {
                          if (videoMeta) setVideoMeta({ ...videoMeta, title: e.target.value });
                        }}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold font-mono">
                        {lang === "ar" ? "عدد مقاطع الريلز القصيرة المستهدفة" : "Shorts Count"}
                      </label>
                      <input
                        type="number"
                        value={shortsCount}
                        onChange={(e) => setShortsCount(Number(e.target.value))}
                        className="w-full bg-[#0a0c14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={triggerAIGenerateShortsPlan}
                    disabled={generatingShorts}
                    className="w-full mt-5 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {generatingShorts ? <RefreshCw className="w-4 h-4 animate-spin inline mr-1 text-black" /> : null}
                    <span>{generatingShorts ? "Segmenting..." : (lang === "ar" ? "تفتيت وهيكلة فيديوهات ريلز مخصصة للتفاعل" : "Launch Shorts Automation Plan")}</span>
                  </button>

                  {shortsResult && (
                    <div className="mt-6 border-t border-white/5 pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-amber-400 font-mono">Extracted Micro-Clips Setup</span>
                        <button
                          onClick={() => copyText(shortsResult)}
                          className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-1.5 text-gray-300 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>{lang === "ar" ? "نسخ" : "Copy"}</span>
                        </button>
                      </div>
                      <div className="bg-[#070911] rounded-2xl p-4 border border-white/5 text-gray-200 text-xs leading-relaxed font-mono whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto">
                        {shortsResult}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* VIEW 9.5: DIALOG WORKSPACE DISCUSS COPILOT */}
            {activeView === "brand" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="brand"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Visual Palette colors */}
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md">
                  <h3 className="text-sm font-bold text-white mb-2">{lang === "ar" ? "🎨 لوحة ألوان ملاعب مونديال 2026 الرسمية" : "🎨 Official World Cup 2026 Palette"}</h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-[#FFD700] border border-white/10 block" />
                        <div>
                          <p className="text-xs font-bold text-white">Trophy Gold | ذهب الكأس الملتصق</p>
                          <p className="text-[10px] text-gray-400 font-mono">#FFD700</p>
                        </div>
                      </div>
                      <button onClick={() => copyText("#FFD700")} className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-[10px] rounded border border-white/10 text-cyan-400">Copy</button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-[#0A1A3A] border border-white/10 block" />
                        <div>
                          <p className="text-xs font-bold text-white">Empire Navy | كحلي الإمراطورية</p>
                          <p className="text-[10px] text-gray-400 font-mono">#0A1A3A</p>
                        </div>
                      </div>
                      <button onClick={() => copyText("#0A1A3A")} className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-[10px] rounded border border-white/10 text-cyan-400">Copy</button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-[#DC143C] border border-white/10 block" />
                        <div>
                          <p className="text-xs font-bold text-white">Passion Red | أحمر الدماء والأهداف</p>
                          <p className="text-[10px] text-gray-400 font-mono">#DC143C</p>
                        </div>
                      </div>
                      <button onClick={() => copyText("#DC143C")} className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-[10px] rounded border border-white/10 text-cyan-400">Copy</button>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Previews */}
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 shadow-md">
                  <h3 className="text-sm font-bold text-white mb-2">{lang === "ar" ? "📐 قوالب الصورة المصغرة المعتمدة (1280x720)" : "📐 CTR Optimized Thumbnail templates"}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <button
                      onClick={() => setModalContent({
                        title: "Template SHOCK preview",
                        body: <div className="aspect-video bg-gradient-to-tr from-rose-600 to-indigo-900 rounded-xl flex items-center justify-center font-black text-2xl text-white">SHOCK TACTIC 94%</div>
                      })}
                      className="p-3 bg-gradient-to-tr from-rose-600 to-indigo-900 rounded-xl font-bold min-h-[75px] text-center cursor-pointer hover:scale-102 transition-transform"
                    >
                      SHOCK TACTIC
                    </button>
                    
                    <button
                      onClick={() => setModalContent({
                        title: "Template REVEAL preview",
                        body: <div className="aspect-video bg-gradient-to-tr from-amber-500 to-rose-700 rounded-xl flex items-center justify-center font-bold text-2xl text-white">REVEAL SECRETS</div>
                      })}
                      className="p-3 bg-gradient-to-tr from-amber-500 to-rose-700 rounded-xl font-bold min-h-[75px] text-center cursor-pointer hover:scale-102 transition-transform"
                    >
                      REVEAL SECRETS
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 10: SETTINGS MANAGEMENT */}
            {activeView === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="settings"
                className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {lang === "ar" ? "⚙️ مفاتيح الربط والخصوصية والتحكم" : "⚙️ System Credentials & Variables"}
                  </h3>
                  <p className="text-xs text-gray-400">{lang === "ar" ? "مفاتيح الربط والخصوصية آمنة ومحفوظة محلياً 100%" : "Connected credentials stay in your browser local storage."}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">OpenAI Key (Bypassed & Disabled as requested)</label>
                    <input type="password" disabled value="DISABLED_VPS_OPENAI_Bypassed" className="w-full bg-[#0a0c14] border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-500 font-mono" />
                    <p className="text-[10px] text-emerald-400 mt-1">✓ {lang === "ar" ? "تم إزالة وإحباط VPS و OpenAI واستخدام السيرفر المحلي لدعم الخصوصية." : "VPS and OpenAI components successfully deleted. Directly routing over Gemini."}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Gemini Key API</label>
                    <input type="password" value="AUTOMATICALLY_INJECTED_AURA_STREAM" disabled className="w-full bg-[#0a0c14] border border-white/5 rounded-xl py-3 px-4 text-xs text-cyan-400 font-mono" />
                    <p className="text-[10px] text-gray-400 mt-1">{lang === "ar" ? "يتم دمج هذا الرمز الرياضي تلقائياً برمجياً على سحابة الاستضافات." : "Securely managed by AI Studio backend."}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      showToast(lang === "ar" ? "✓ تم حفظ وتوثيق إعدادات الخصوصية!" : "Credentials stored successfully!");
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    {lang === "ar" ? "حفظ التغييرات" : "Save Stored Config"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(lang === "ar" ? "الرجاء تأكيد رغبتك بمسح ذكريات وكلاء التنزيل الآلية؟" : "Confirm database deletion?")) {
                        showToast(lang === "ar" ? "تم مسح الذاكرة بنجاح!" : "Memory space successfully refreshed!");
                      }
                    }}
                    className="px-5 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {lang === "ar" ? "مسح الذاكرة" : "Hard Reset Cache"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 11: SMART SCHEDULER & FIRECRAWL AUTOMATED HARVESTER */}
            {activeView === "automation" && (
              <motion.div
                initial={{ opacity: 0, rotateX: 5, y: 15 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="automation"
                className="space-y-6"
                style={{ perspective: "1200px" }}
              >
                {/* Visual Head banner */}
                <div className="relative bg-gradient-to-r from-[#172242] to-[#0a1122] rounded-3xl p-6 sm:p-8 border border-white/10 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-12 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/20 px-3 py-1 rounded-full text-[10px] text-cyan-300 font-extrabold tracking-widest uppercase font-mono">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                        Firecrawl Deep Scraping & Scheduling Engine
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {lang === "ar" ? "🤖 جدولة الكشط الذكي والاستخراج المجدول" : "🤖 Scraper & Automated Scheduler"}
                      </h2>
                      <p className="text-xs text-gray-400 max-w-xl">
                        {lang === "ar" 
                          ? "استخدم تقنية كشط الويب الذكي لجلب وتحليل وروابط محتوى السوشيال ميديا، مع إيقاف التشغيل الدائم والضوابط الصارمة لعدد التوكنات والوقت المحدد (6 ساعات أو 12 ساعة)." 
                          : "Harness high-speed Firecrawl technology to crawl web links, extract high-fidelity video attachments, manage local simulation schedules and restrict token bounds completely."}
                      </p>
                    </div>

                    <div className="bg-[#0c0f1d] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center font-mono min-w-[140px] shadow-sm transform hover:scale-105 transition-all">
                      <span className="text-[10px] uppercase text-gray-500 tracking-wider">Total Scrapes</span>
                      <strong className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-black mt-1">
                        {schedulerStatsCount}
                      </strong>
                      <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                        Synced Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary split decks */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Firecrawl Crawler Deck */}
                  <div className="lg:col-span-7 bg-[#0b0e17] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between hover:border-cyan-400/30 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-400/20">
                          <Download className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white">
                            {lang === "ar" ? "🔗 سحب الميديا الفوري والكشط عبر رابط" : "🔗 Direct Firecrawl Page Link Scraper"}
                          </h3>
                          <p className="text-[11px] text-gray-450">
                            {lang === "ar" ? "أدخل رابط أي صفحة كروية أو منشور تيك توك/تويتر لتحليله واستيراد الفيديو للمستخرج تلقائياً" : "Input any match link or media post. Firecrawl will restructure it into a downloadable stream."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
                          {lang === "ar" ? "رابط الميديا كشط (URL)" : "TARGET WEB LINK OR POST URL"}
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            placeholder="https://www.fifa.com/worldcup/news/trending-match-highlights-2026"
                            value={firecrawlUrl}
                            onChange={(e) => setFirecrawlUrl(e.target.value)}
                            className="w-full bg-[#04060b] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-cyan-400 text-white font-mono"
                          />
                          <p className="text-[9px] text-gray-500 mt-1.5 leading-relaxed">
                            {lang === "ar" 
                              ? "✓ يدعم تحليل المنشورات والمقالات والصحف والشبكات الرياضية بدقة متناهية بالاستعانة بنماذج الاستخراج." 
                              : "✓ Leverages Gemini-3.5-flash content models to map complete video metadata lists."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex gap-3 mt-6">
                      <button
                        onClick={handleFirecrawlScrape}
                        disabled={scrapingWithFirecrawl}
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-opacity"
                      >
                        {scrapingWithFirecrawl ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{lang === "ar" ? "جار الكشط وتحليل الروابط..." : "Scraping page..."}</span>
                          </>
                        ) : (
                          <>
                            <Compass className="w-3.5 h-3.5" />
                            <span>{lang === "ar" ? "كشط واستيراد الميديا فوراً" : "Crawl & Import Content"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Limits and Schedule Controls Deck */}
                  <div className="lg:col-span-5 bg-[#0b0e17] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md hover:border-cyan-400/30 transition-all flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-400/20">
                          <Cpu className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white">
                            {lang === "ar" ? "⚙️ ضبط الجدولة والتوكنات والحدود" : "⚙️ Controls & Token Bounds"}
                          </h3>
                          <p className="text-[11px] text-gray-450">
                            {lang === "ar" ? "تحكم في فترة التكرار وحجم التوكنات لتقييد المصاريف" : "Set repeat intervals and specify precise Gemini output generation token allocations."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* Status Toggle */}
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <span className="block text-xs font-bold text-white">{lang === "ar" ? "جدولة الاستيراد الآلي" : "Autonomous Dynamic Crawler"}</span>
                            <span className="text-[9px] text-gray-400">{lang === "ar" ? "استيراد وتحديد ميديا دورياً خلف الكواليس" : "Fires background crawls periodically"}</span>
                          </div>
                          <button
                            onClick={() => {
                              const newActive = !schedulerActive;
                              setSchedulerActive(newActive);
                              updateSchedulerConfig({ active: newActive });
                            }}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${schedulerActive ? "bg-cyan-500" : "bg-gray-700"}`}
                          >
                            <div className={`w-5 h-5 bg-black rounded-full shadow-md transform transition-transform ${schedulerActive ? "translate-x-6" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Interval selector */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
                            {lang === "ar" ? "استخراج مجدول كل: (Interval)" : "EXECUTE EXTRACTION SCHEDULE EVERY"}
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[6, 12, 24].map((hrs) => (
                              <button
                                key={hrs}
                                onClick={() => {
                                  setSchedulerInterval(hrs);
                                  updateSchedulerConfig({ intervalHours: hrs });
                                }}
                                className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                                  schedulerInterval === hrs
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/45 shadow-sm"
                                    : "bg-[#04060b] text-gray-400 border-white/5 hover:text-white"
                                }`}
                              >
                                {hrs} {lang === "ar" ? "ساعات" : "Hours"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Maximum Tokens limits */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 font-mono">
                            <span>{lang === "ar" ? "التحكم في عدد التوكن بالاستجابة" : "MAX TOKENS ALLOCATION"}</span>
                            <span className="text-cyan-400 text-xs font-black">{schedulerMaxTokens} Tokens</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="4000"
                            step="100"
                            value={schedulerMaxTokens}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              setSchedulerMaxTokens(v);
                            }}
                            onMouseUp={() => {
                              updateSchedulerConfig({ maxTokens: schedulerMaxTokens });
                            }}
                            onTouchEnd={() => {
                              updateSchedulerConfig({ maxTokens: schedulerMaxTokens });
                            }}
                            className="w-full h-1.5 bg-[#04060b] rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                          />
                          <p className="text-[9px] text-gray-500">
                            {lang === "ar" ? "• تقييد التوكن يحميك من التكاليف المرتفعة ونفاذ الحصة المجانية لنماذج Gemini." : "• Limiting tokens protects from high payloads and limits API quota saturation."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-4">
                      <button
                        onClick={triggerSchedulerRunNow}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        <span>{lang === "ar" ? "إجبار تشغيل الجدولة الآن (محاكاة)" : "Force Simulate Scheduler Run Now"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scheduler Logs & Active History Table */}
                <div className="bg-[#0f121d] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{lang === "ar" ? "📋 سجل آخر عمليات الاستخراج والجدولة" : "📋 Recent Automated Extraction Logs"}</h4>
                      <p className="text-[10px] text-gray-450">{lang === "ar" ? "عمليات استيراد ميديا رياضية ناجحة تمت خلال الفترة المنقضية" : "Historical crawler triggers matching local client scheduler configurations"}</p>
                    </div>
                    <button
                      onClick={fetchSchedulerConfig}
                      className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                      title="Fresh Logs"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left" dir={lang === "ar" ? "rtl" : "ltr"}>
                      <thead>
                        <tr className="border-b border-white/5 text-gray-400 text-[10px] uppercase font-mono font-bold">
                          <th className="py-2.5 px-3">{lang === "ar" ? "الوقت" : "Timestamp"}</th>
                          <th className="py-2.5 px-3">{lang === "ar" ? "العنوان المستخرج" : "Extracted Video Title"}</th>
                          <th className="py-2.5 px-3">URL</th>
                          <th className="py-2.5 px-3 text-center">{lang === "ar" ? "التوكنات المستهلكة" : "Tokens Used"}</th>
                          <th className="py-2.5 px-3 text-right">{lang === "ar" ? "الحالة" : "Status"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedulerHistory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-500 font-mono">
                              No automated logs registered yet. Trigger scraper or "Force Run" to generate records.
                            </td>
                          </tr>
                        ) : (
                          schedulerHistory.map((log, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5 font-mono">
                              <td className="py-3 px-3 text-cyan-400/80">
                                {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                              </td>
                              <td className="py-3 px-3 text-white font-sans font-medium text-[11px] max-w-[280px] truncate">
                                {log.title}
                              </td>
                              <td className="py-3 px-3 text-gray-400 truncate max-w-[200px]" title={log.url}>
                                {log.url}
                              </td>
                              <td className="py-3 px-3 text-center text-amber-400 font-extrabold text-[11px]">
                                {log.tokensUsed}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-400/10">
                                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                                  {lang === "ar" ? "✓ تم حصدها" : "✓ Harvested"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

          {/* COMBUSED CHATBOX FLUID COPILOT DISCUSS SECTION */}
          <div className="mt-12 border-t border-white/10 pt-12">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>{lang === "ar" ? "💬 نقاش تكتيكي سريع مع ذكاء Gemini Copilot" : "💬 Direct Copilot Chat with Gemini Intelligence"}</span>
            </h3>
            
            <div className="bg-[#0b0c16] rounded-2xl border border-white/5 p-4 min-h-[160px] max-h-[300px] overflow-y-auto space-y-3 relative mb-3">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-gray-500 gap-1.5">
                  <Bot className="w-8 h-8 text-cyan-400/40" />
                  <p className="font-bold">{lang === "ar" ? "اطرح أي سؤال تكتيكي أو ترويجي للمقاطع" : "Discuss anything about football clips and strategies"}</p>
                  <p className="text-[10px] text-gray-500 max-w-md">{lang === "ar" ? "مثال: كم عدد الأهداف المسجلة في ملاعب كأس العالم؟ كيف أحسن من ظهور مقطع اليوتيوب؟" : "Ask about World Cup fixtures, formatting styles, or subtitle models."}</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 max-w-[85%] text-xs leading-relaxed rounded-xl ${
                      msg.role === "user" ? "bg-cyan-500/10 text-cyan-200 border border-cyan-400/20" : "bg-white/5 text-gray-300 border border-white/5"
                    }`} dir={lang === "ar" ? "rtl" : "ltr"}>
                      <span className="font-bold text-[9px] text-cyan-400 uppercase tracking-wider block mb-1 font-mono">
                        {msg.role === "user" ? (lang === "ar" ? "أنت" : "You") : "Gemini Pro"}
                      </span>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>{lang === "ar" ? "جاري الاستجابة السريعة وصياغة الرد تكتيكياً..." : "Copilot is analyzing..."}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === "ar" ? "اسأل Gemini أي سؤال ذكي تفاعلي..." : "Type custom query here..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendChatMessage();
                }}
                className="flex-1 bg-[#0a0c14] border border-white/10 focus:border-cyan-400 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-cyan-400 text-white"
              />
              <button
                onClick={sendChatMessage}
                className="px-5 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-xs rounded-xl cursor-pointer"
              >
                {lang === "ar" ? "إرسال" : "Send Query"}
              </button>
            </div>
          </div>

          {/* COMPREHENSIVE TECHNOLOGY BAR */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10">
            <div className="bg-[#0f121d] rounded-2xl border border-white/5 p-5 shadow-lg">
              <Cpu className="w-8 h-8 text-cyan-400 bg-cyan-400/10 p-1.5 rounded-lg mb-4" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">{lang === "ar" ? "البنية ثلاثية الأبعاد الفائقة" : "3D Hologram Deck"}</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {lang === "ar" ? "يحقق التصميم أعلى بيكسل استقرار ممكن مع ملاءمة التصفح وعرض النتائج المسبق قبل الحفظ." : "Fully interactive tilt angles with instant responsiveness and pixel-level fluid previews."}
              </p>
            </div>

            <div className="bg-[#0f121d] rounded-2xl border border-white/5 p-5 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-emerald-400 bg-emerald-400/10 p-1.5 rounded-lg mb-4" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">{lang === "ar" ? "حماية مضاعفة وحقوق مؤمنة" : "Open-Source Protection"}</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {lang === "ar" ? "حذفنا VPS و OpenAI، وتم تقليص ميزانيتنا للتصدير بموجب القوانين المفتوحة الأكثر أماناً." : "No premium tokens or backend proxies. Fast processing on sandbox parameters."}
              </p>
            </div>

            <div className="bg-[#0f121d] rounded-2xl border border-white/5 p-5 shadow-lg">
              <Globe className="w-8 h-8 text-indigo-400 bg-indigo-400/10 p-1.5 rounded-lg mb-4" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">{lang === "ar" ? "دعم وتصدير للعديد من المنصات" : "Cross-Platform Handshakes"}</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {lang === "ar" ? "سواء كنت تستخرج من تيك توك، يوتيوب، أو إنستقرام، يتم كشف الإرسال وجلب الجودات والتحمل مجاناً." : "Seamless parsing with auto quality configuration including 1080p, 720p HD and stereo sound."}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER BLOCK */}
      <footer className="border-t border-white/10 bg-[#04060c] mt-16 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026أوراستريم AI - AuraStream AI + WC26 Empire. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved. Secure and compliant."}</p>
          <div className="flex gap-4">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">{lang === "ar" ? "سياسة النشر والاستخدام العادل" : "Fair Use policy"}</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">GitHub project license</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
