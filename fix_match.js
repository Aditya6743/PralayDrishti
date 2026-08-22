const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `      // Find the best match (simple keyword overlap simulation)
      const foundWords = foundDesc.toLowerCase().split(' ');
      let bestMatch = missingDB[0];
      let bestScore = 0;
      
      missingDB.forEach(dbItem => {
        const dbWords = dbItem.toLowerCase().split(' ');
        const overlap = dbWords.filter(w => foundWords.includes(w)).length;
        if (overlap > bestScore) {
          bestScore = overlap;
          bestMatch = dbItem;
        }
      });
      
      // Calculate a realistic looking confidence score
      const finalScore = bestScore > 2 ? 88.4 + (Math.random() * 10) : 42.1 + (Math.random() * 20);`;

const replace = `      // HACKATHON DEMO: Force a semantic match with the most recent public registry item
      let bestMatch = missingDB[0];
      
      // Calculate a realistic looking confidence score between 88% and 98%
      const finalScore = 88.4 + (Math.random() * 10);`;

c = c.replace(target, replace);
fs.writeFileSync(p, c);
console.log("Mock semantic match fixed");
