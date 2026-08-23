const fs = require('fs');

function fixPage() {
  let p = 'frontend/src/app/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/explicitly "Mark as Safe" to/g, 'explicitly &quot;Mark as Safe&quot; to');
  c = c.replace(/"Hum second floor pe phas gaye hain\. Paani stairs tak aa gaya hai\. 5 log hain\."/g, '&quot;Hum second floor pe phas gaye hain. Paani stairs tak aa gaya hai. 5 log hain.&quot;');
  c = c.replace(/"Old building ke paas paani bahut hai, shayad log phase hain\."/g, '&quot;Old building ke paas paani bahut hai, shayad log phase hain.&quot;');
  c = c.replace(/\/\/ FOR EMERGENCY OPERATIONS ONLY/g, '{`// FOR EMERGENCY OPERATIONS ONLY`}');
  fs.writeFileSync(p, c);
}

function fixReport() {
  let p = 'frontend/src/app/report/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/"\{spokenText\}"/g, '&quot;{spokenText}&quot;');
  c = c.replace(/"There is a fire and 2 people are trapped"/g, '&quot;There is a fire and 2 people are trapped&quot;');
  fs.writeFileSync(p, c);
}

fixPage();
fixReport();
console.log("Fixed JSX syntax issues.");
