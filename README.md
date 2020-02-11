# NPM Package Version Bumper

Use this package to bump the version and write the new data back to package.json, package-lock.json, and, if present, npm-shrinkwrap.json.

Click the Bump button in the bottom right corner on your Status bar and select one of the bump-types. The newversion argument will be a valid semver string, a valid second argument to semver.inc (one of patch, minor, major, prepatch, preminor, premajor, prerelease), or from-git. In the second case, the existing version will be incremented by 1 in the specified field. from-git will try to read the latest git tag, and use that as the new npm version.
