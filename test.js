const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });

(async () => {
const aa = await db.push('track', "949153367609987124");
console.log(aa)}
)()