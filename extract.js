const fs = require("fs");
const p = require("./min_deploy.json");
for (let i = 0; i < p.files.length; i++) {
  fs.writeFileSync(`_dp/data_${i}.txt`, p.files[i].data);
  console.log(i, p.files[i].file, p.files[i].data.length);
}
