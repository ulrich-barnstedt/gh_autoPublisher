const {spawnSync} = require("child_process");
const config = require("./config.json");
const fs = require("fs");

module.exports = class {
    constructor (wd, name) {
        this.wd = wd; //working dir
        this.name = name;
    }

    push () {
        console.log(`Syncing ${config.orgPrefix}${this.name} at ${this.wd} ...`);

        if (this._repoHere()) {
            this._push();
            return;
        } else {
            this._copy();
            this._initGit();
            this._ghCreate();
            this._push();
        }

        console.log("Sync finished successfully.");
    }

    _spawnGit (args) {
        console.warn(spawnSync(config.paths.git, args, {cwd : this.wd}).stderr.toString());
        //spawnSync(config.paths.git, args, {cwd : this.wd});
    }

    _spawnGH (args) {
        console.warn(spawnSync(config.paths.ghCli, args, {cwd : this.wd}).stderr.toString());
        //spawnSync(config.paths.ghCli, args, {cwd : this.wd});
    }

    _copy () {
        console.log("Copying files ...");

        for (let file of config.copy) {
            fs.writeFileSync(this.wd + "/" + file, fs.readFileSync(config.copyPrefix + file));

            console.log("\tCopied " + file);
        }
    }

    _initGit () {
        console.log("Initializing local git ...");

        this._spawnGit(["init"]);
    }

    _ghCreate () {
        console.log("Initializing github repo ...");

        this._spawnGH(["repo", "create", config.orgPrefix + this.name, "--public", "-y"]);
    }

    _push () {
        console.log("Committing and pushing to remote ...");

        this._spawnGit(["add", "."]);
        this._spawnGit(["commit", "-am", config.commitMessage]);
        this._spawnGit(["push", "origin", "master"]);
    }

    _repoHere () {
        return fs.existsSync(this.wd + "/.git");
    }
}