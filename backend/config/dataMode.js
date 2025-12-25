module.exports = {
    mode: 'UNKNOWN', // MONGO | JSON
    setMode(newMode) {
        this.mode = newMode;
        console.log(`\n[DATA MODE] Using ${newMode} as data source\n`);
    }
};
