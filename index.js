#! /usr/bin/env node
(async function main() {
    if (process.argv.length <= 3) {
        console.error("\nUsage:\nbatman dc 235\n");
        return;
    }
    const publication =
        process.argv[2].toLowerCase() === "dc"
            ? "Detective_Comics_Vol_1"
            : process.argv[2].toLowerCase() === "bm"
              ? "Batman_Vol_1"
              : (function () {
                    throw new Error("Publication ID must be DC or BM");
                })();

    const number = parseInt(process.argv[3]);
    const issue = await getIssue(publication, number);
    console.log(`Title: ${issue.title}`);
    console.log(`${issue.month} ${issue.year}`);
})();

async function getIssue(publication, number) {
    const res = await (
        await fetch(
            `https://dc.fandom.com/api.php?action=parse&format=json&prop=categories&page=${publication}_${number}`,
        )
    ).json();

    const dateRegex =
        /^((?:19|20)\d\d),_(January|February|March|April|May|June|July|August|September|October|November|December)$/i;

    let issue = { title: res.parse.title };
    res.parse.categories.every((item) => {
        const matches = dateRegex.exec(item["*"]);
        if (matches) {
            issue.year = parseInt(matches[1]);
            issue.month = matches[2];
            return false;
        }
        return true;
    });
    return issue;
}
