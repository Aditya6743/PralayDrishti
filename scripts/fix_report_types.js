const fs = require('fs');
let p = 'frontend/src/app/report/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/useState<any>\(null\)/g, 'useState<Record<string, unknown> | null>(null)');
c = c.replace(/\(window as any\)/g, '(window as unknown as Record<string, unknown>)');
c = c.replace(/event: any/g, 'event: Event & { results: SpeechRecognitionResultList }');

fs.writeFileSync(p, c);
console.log("Fixed report types");
