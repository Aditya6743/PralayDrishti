const fs = require('fs');
fs.renameSync('frontend/api/index.py', 'frontend/api/[...catchall].py');
