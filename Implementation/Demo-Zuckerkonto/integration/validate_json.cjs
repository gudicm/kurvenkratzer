const fs = require('fs');
try {
    const content = fs.readFileSync('tmp/prenudge.postman_collection.json', 'utf8');
    JSON.parse(content);
    console.log("JSON is valid");
} catch (e) {
    console.error("JSON Error:", e.message);
}
