#! /usr/bin/env node
(async function main() {
	if (process.argv.length <= 3) {
		console.error(
			"\nUsage:\nbatman {dc number} {batman number} {how_many}\n",
		);
		return;
	}
	const dc_no = parseInt(process.argv[2]);
	const batman_no = parseInt(process.argv[3]);
	const count_to = parseInt(process.argv[4]);
	let issues = [];

	for (let i = dc_no; i < dc_no + count_to / 2; i++) {
		const dc = await getIssue("Detective_Comics_Vol_1", i);
		issues.push({ ...dc, string: `DetCom ${i} - ${dc.year} ${dc.month}` });
	}

	for (let i = batman_no; i < batman_no + count_to / 2; i++) {
		const batman = await getIssue("Batman_Vol_1", i);
		issues.push({
			...batman,
			string: `Batman ${i} - ${batman.year} ${batman.month}`,
		});
	}

	issues.sort((a, b) => {
		return (
			new Date(`${a.month} 1, ${a.year}`) -
			new Date(`${b.month} 1, ${b.year}`)
		);
	});

	const output = issues.map((i) => i.string);
	output.forEach((line) => console.log(line));
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
