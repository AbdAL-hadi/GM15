# مراجعة وإصلاح وتهيئة البيانات — GM15

19 نوفمبر 2026. استُكمل المشروع الحالي مع الحفاظ على React وVite والتصميم والمسارات.

## المشاكل والإصلاحات

- autoFocus لحقل البحث كان يحدث بينما dialog مخفي، فلم يتركز الحقل عند الفتح. أصبح Dialog يركز عنصر data-dialog-autofocus بعد showModal.
- Tab المتكرر في حوار المفضلة خرج بالتركيز خارج الحوار في Edge headless. أضيف تدوير صريح للأول والأخير مع Shift+Tab وتنظيف listener؛ بقي Escape واسترجاع التركيز.
- الرش الثاني أثناء فتح الغطاء كان يلغي المؤقت ويرش فورًا، لأن capOpen يصبح true قبل انتهاء الحركة. أصبح الفتح يحدد موعد انتهاء، والتكرار ينتظر المدة المتبقية. الإغلاق وReset والمغادرة تلغي الانتظار.
- سحب mesh الغطاء أو البخاخ كان قابلًا للوصول إلى onClick. أضيف تتبع pointer واحد وعتبة حركة في capture، وحارس مشترك يمنع تفعيل mesh بعد السحب حتى لو عاد المؤشر لنقطة البداية. السحب الرأسي لا يلتقط pointer أفقيًا.
- resetKey كان غير مستخدم. يقرأه BottleModel داخل useFrame ويعيد زاوية العبوة وميلها والغطاء مباشرة ويوقف ضغط البخاخ. Reset يحرر pointer capture ويلغي الإيماءة والمؤقت ويصفر الرذاذ والنوتة والاستكشاف.
- صور المنتج كشفت نصوصًا مساعدة صغيرة وملصقًا باهتًا وغطاء معدنيًا داكنًا. كبرت نصوص الموبايل المساعدة ووُضّح الملصق وترتيب رسمه وخففت معدنية الغطاء، دون إعادة تصميم الشاشة.
- كانت الواجهات تستورد مصفوفة المنتجات مباشرة. أصبحت تقرأ snapshot واحدة تُحمّل قبل تركيب Store، لحماية بيانات التخزين من الحذف المبكر أثناء انتظار الكتالوج.

## الملفات المهمة

- src/data/catalog.ts: عقد CatalogSource.load(signal) ومصدر demo قابل للاستبدال، مع إبقاء الأنواع والبيانات الأصلية.
- src/state/Catalog.tsx: تحميل وإلغاء الطلب عند unmount، loading/error/empty/retry، وuseCatalog.
- App وصفحات Home/Shop/Product/Layering وShell/Cart/Store: توصيل snapshot بدل استيراد المصفوفات مباشرة من الواجهات.
- cart.ts وpair.ts: استقبال الكتالوج المحمل لحساب السعر والتوفر؛ افتراضات demo باقية للاستخدام المحلي والاختبارات، والتطبيق يمرر البيانات المحملة صراحة.
- BottleScene.tsx وProduct.tsx: الإيماءات وReset وتسلسل الرش. UI.tsx وShell.tsx: الحوارات والتركيز. styles.css: وضوح النصوص.
- scripts/qa-browser.mjs وqa-scene.mjs: فحوص قابلة للإعادة. verification/catalog-harness.html fixture على Vite dev ولا يدخل حزمة الإنتاج.
- catalog.test.ts: إلغاء المصدر واستقلال snapshots واستخدام أسعار وتوفر كتالوج بديل في السلة والتنسيق.

## نتائج الفحوص الفعلية

- npm.cmd ci --cache .npm-cache --no-audit --no-fund: تثبيت نظيف على Windows من lock، 268 حزمة. أضيفت بعده أدوات Playwright كاعتماديات تطوير (3 حزم)، مع تحديث lock.
- Typecheck وLint: exit0. الاختبارات 17/17 في3 ملفات، exit0. السجلات verification/typecheck-results.txt وlint-results.txt وtest-results.txt.
- Production build: exit0. المشهد ~966KB خام/~270KB gzip؛ تحذير chunk مستمر، ويبقى المشهد محملًا عند الحاجة.
- معاينة الإنتاج 127.0.0.1:4180؛ HTTP لعشرة روابط و30 أصلًا، verification/http-check.json.
- Playwright مع Edge headless وسياقات معزولة عند390×844 و768×1024 و1440×1024. النتائج النهائية browser-results.json وscene-results.json. لا استعمال لجلسة المستخدم الشخصية.
- نُفّذت تفاعلات بحث وفلاتر وأحجام وأسعار وسلة وتخزين ومفضلة وحوارات وFocus وSlider، ومشهد WebGL وتكرار وReset وfallback. حدود كل assertion في REQUIREMENTS_CHECKLIST.
- موارد GPU بعد30رشّة بقيت90 buffers و10 textures و12 programs. هذا فحص قصير لثبات الموارد، وليس إثباتًا لعدم تسرب جميع أنواع الذاكرة.
- أول فحص كشف خلل التركيز؛ verification/browser-before-focus-fix.json سجل تاريخي قبل الإصلاح.

## الصور والفحص البصري

داخل verification/screenshots توجد home/product/journey/layering بالأحجام390 و768 و1440، وscene-rotated وscene-reset.

- [الرئيسية1440](verification/screenshots/home-1440.png)
- [المنتج1440](verification/screenshots/product-1440.png)
- [المنتج موبايل390](verification/screenshots/product-390.png)
- [الرحلة768](verification/screenshots/journey-768.png)
- [التنسيق390](verification/screenshots/layering-390.png)
- [التدوير](verification/screenshots/scene-rotated.png) و[Reset](verification/screenshots/scene-reset.png)

فُحصت الصور المعروضة وأعيد تصوير المنتج بعد تحسين وضوحه. لم يظهر قص أو تداخل رئيسي في الصور المفحوصة. قياس overflow آلي مستقل عن الحكم البصري. تُوقف CSS animations عند التصوير لتجنب التقاط النص أثناء fade عابر، مع انتظار استقرار WebGL.

## طريقة ربط API لاحقًا

CatalogSource.load(signal) يرجع { products, layerings } بنفس الأنواع الحالية. استبدل demoCatalogSource بمصدر ينفذ fetch مع signal، يفحص response.ok ويتحقق من بنية JSON، ثم مرره إلى CatalogProvider. لا تحتاج الصفحات لتغيير استيراداتها. مصدر demo يستنسخ البيانات الأصلية ولا يعدلها.

حالات loading/error/empty/retry موجودة. Store لا يركب قبل نجاح التحميل؛ بعدها يستعمل كتالوجًا موحدًا وIDs مستقرة ومفاتيح التخزين الحالية. تغيير معرفات المنتجات أو سياسة المخزون يحتاج ترحيلًا مقصودًا. API الحقيقي غير مربوط بهذه المرحلة، والتحقق النهائي من السعر والمخزون عند الطلب مسؤولية Backend لاحقًا.

## المتبقي غير المتحقق

هاتف فعلي وSafari/Firefox وقارئات الشاشة ودقة مدد Reduced Motion وتطابق كل إطار في حركة الغطاء والرش غير مثبتة. لا profiling طويل للذاكرة أو FPS أو آلاف دورات التنقل. سحب البخاخ نُفّذ لكن عدم توليد رشّة غير مقصودة تدعمه جزئيًا مراجعة الحارس المشترك المثبت للغطاء، دون عداد رش بصري مستقل. ليست كل تركيبات Back/Forward والروابط الخارجية مختبرة. الأسعار والمخزون والمراحل والعبوة تبقى تجريبية وتحتاج اعتماد العلامة.

أُعيدت مقارنة البنود التسعة بالعمل والفحوص؛ بقيت البنود الجزئية جزئية ولم يعتبر وجود الكود وحده دليل نجاح تفاعلي.
