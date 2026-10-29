const https = require('https');
const fs = require('fs');
const path = require('path');

const projectId = 'santostark15';
const collections = ['hero_info', 'about_info', 'skills', 'projects', 'work', 'education', 'certificates', 'interests', 'studio_projects'];

function parseValue(field) {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return parseInt(field.integerValue, 10);
  if ('doubleValue' in field) return parseFloat(field.doubleValue);
  if ('booleanValue' in field) return field.booleanValue;
  if ('timestampValue' in field) return field.timestampValue;
  if ('arrayValue' in field) {
    const values = field.arrayValue.values || [];
    return values.map(parseValue);
  }
  if ('mapValue' in field) {
    const obj = {};
    const fields = field.mapValue.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      obj[k] = parseValue(v);
    }
    return obj;
  }
  return null;
}

function fetchCollection(col) {
  return new Promise((resolve) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${col}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const docs = (json.documents || []).map(d => {
            const id = d.name.split('/').pop();
            const fields = {};
            if (d.fields) {
              for (const [k, v] of Object.entries(d.fields)) {
                fields[k] = parseValue(v);
              }
            }
            return { id, ...fields };
          });
          resolve({ col, docs });
        } catch (e) {
          console.error(`Error parsing ${col}:`, e.message);
          resolve({ col, docs: [] });
        }
      });
    }).on('error', err => {
      console.error(`Network error ${col}:`, err.message);
      resolve({ col, docs: [] });
    });
  });
}

async function run() {
  const results = {};
  for (const col of collections) {
    const { docs } = await fetchCollection(col);
    results[col] = docs;
    console.log(`Fetched ${col}: ${docs.length} documents`);
  }
  const outPath = path.join(__dirname, 'firestore_snapshot.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Saved snapshot to ${outPath}`);
}

run();
