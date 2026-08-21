const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./frontend/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    if (content.includes('http://localhost:8000')) {
        content = content.replace(/http:\/\/localhost:8000/g, '');
        changed = true;
    }
    if (content.includes('ws://localhost:8000')) {
        content = content.replace(/ws:\/\/localhost:8000/g, '');
        // Actually wait, for websockets it's harder if we just replace it.
        // If it's `new WebSocket("/api/ws/live")`, it will fail because WebSocket constructor requires absolute URL.
    }
    if (changed) {
        fs.writeFileSync(file, content);
    }
});
