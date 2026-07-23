const d = require('./to_deploy.cjs');
const fs = require('fs');
if (!fs.existsSync('_df')) fs.mkdirSync('_df');
d.files.forEach((f, i) => {
  const entry = { file: f.file, data: f.data };
  fs.writeFileSync('_df/entry' + i + '.json', JSON.stringify(entry), 'utf8');
  console.log(i, f.file, JSON.stringify(entry).length);
});
fs.writeFileSync(
  '_df/meta.json',
  JSON.stringify({
    target: d.target,
    name: d.name,
    teamId: d.teamId,
    projectSettings: d.projectSettings,
  })
);
console.log('meta ok');
