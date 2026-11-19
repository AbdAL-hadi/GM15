# أدلة التحقق

- `http-check.json`: ناتج فعلي للسكربت على معاينة Production. 10 روابط HTTP200 و30 ملف بناء متاح. التوقيت داخل JSON هو UTC؛ تاريخ الجلسة المحلي في فلسطين 17 نوفمبر 2026.
- الفحوص المنفذة: TypeScript exit0، ESLint exit0، Vitest عدد15 ناجحًا، Vite build exit0.
- لا صور شاشة هنا: حارس أداة التحكم أوقف الوصول إلى Edge، ولم تُجرَ مراجعة بصرية أو تفاعلية.
- لا تدّعي نتائج HTTP أو Node تنفيذ JavaScript داخل متصفح أو اختبار WebGL/اللمس/Console.

لإعادة الفحص، شغّل `npm run preview -- --port 4173 --strictPort` ثم `node scripts/verify-build.mjs http://127.0.0.1:4173`.
