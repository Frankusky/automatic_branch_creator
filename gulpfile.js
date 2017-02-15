var gulp = require("gulp");
var git = require("gulp-git");

function makeMagicHereToGetTicketName() {
	var newBranchName = "dev";
	git.checkout(newBranchName, {
		args: "-b",
		quiet: true
	}, function (err) {
		if (err) throw err
	});
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
gulp.task("gen-branch", fetchAndPull);

gulp.task("default", function () {
	console.log("Default task");
})