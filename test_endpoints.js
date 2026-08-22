const http = require('http');

const testEndpoint = (path, method = 'GET', body = null) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data.substring(0, 100) + (data.length > 100 ? '...' : '') });
      });
    });
    req.on('error', (e) => resolve({ status: 'ERROR', error: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function run() {
  console.log("Testing /api/incidents...");
  console.log(await testEndpoint('/api/incidents'));
  
  console.log("Testing /api/reports...");
  console.log(await testEndpoint('/api/reports'));
  
  console.log("Testing /api/report (Mock SOS Submission)...");
  console.log(await testEndpoint('/api/report', 'POST', { hazard: "FLOOD", victim_status: { trapped: true, headcount: 3 } }));
}
run();
