var gulp = require("gulp");
var git = require("gulp-git");

function checkoutToNewBranch(newBranchName) {
	git.checkout(newBranchName, {
		args: "-b",
		quiet: true
	}, function (err) {
		if (err) throw err
	});
}

function makeMagicHereToGetTicketName() {
	var request = require('request'),
		username = "awtesting@armyspy.com",
		password = "awt3sting",
		url = "http://awtesting.atlassian.net/rest/api/2/search?jql=issue=ODAP-1",
		auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
	request({
			url: url,
			headers: {
				"Authorization": auth
			}
		},
		function (error, response, body) {
			if (error) throw error;
			var title = JSON.parse(body).issues[0].fields.summary;
			var project = JSON.parse(body).issues[0].key;
			checkoutToNewBranch(project + title);
		}
	);
}

function checkoutToMaster() {
	git.checkout("master", function (err) {
		if (err) throw err;
		checkBranchName();
	});
}

function checkBranchName() {
	git.revParse({
		args: '--abbrev-ref HEAD',
		quiet: true
	}, function (err, branch) {
		if (err) throw err;
		console.log("branch name: ", branch);
		if (branch.toLowerCase() === "master") {
			fetchAndPull()
		} else {
			checkoutToMaster()
		}
	})
}

function fetchAndPull() {
	git.fetch('', '', {
		args: '--all',
		quiet: true
	}, function (err) {
		if (err) throw err;
		git.pull("origin", "", {
			quiet: true
		}, function (error) {
			makeMagicHereToGetTicketName();
		})
	});
}
gulp.task("gen-branch", checkBranchName);

gulp.task("default", function () {
	console.log("Default task");
})
