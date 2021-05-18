const gh = require("./gh.js");
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("No name passed.");
    process.exit(1);
}

if (args[1].split("-").length < 3) {
    console.error("Invalid name format");
    process.exit(1);
}

const inst = new gh(args[0], args[1]);
inst.push();