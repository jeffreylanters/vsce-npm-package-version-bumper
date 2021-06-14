<div align="center">

# NPM Package Version Bumper

<br/>
<br/>

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)](https://github.com/jeffreylanters/vsce-npm-package-version-bumper/blob/master/LICENSE.md)
[![VSM](https://img.shields.io/visual-studio-marketplace/v/jeffreylanters.npm-package-version-bumper?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=jeffreylanters.npm-package-version-bumper)
[![build](https://img.shields.io/github/checks-status/jeffreylanters/vsce-npm-package-version-bumper/master?label=build&style=for-the-badge)](https://github.com/jeffreylanters/vsce-npm-package-version-bumper/actions)
<br/>
[![stars](https://img.shields.io/github/stars/jeffreylanters/vsce-npm-package-version-bumper.svg?style=for-the-badge&color=fe8523)](https://github.com/jeffreylanters/vsce-npm-package-version-bumper/stargazers)
[![downloads](https://img.shields.io/visual-studio-marketplace/d/jeffreylanters.npm-package-version-bumper?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=jeffreylanters.npm-package-version-bumper)
[![size](https://img.shields.io/visual-studio-marketplace/stars/jeffreylanters.npm-package-version-bumper?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=jeffreylanters.npm-package-version-bumper&ssr=false#review-details)

A simple Visual Studio Code plugin allowing to bump Node package versions with ease from the menu bar updating your package configuration and creating a Git tag.

**&Lt;**
[**Documentation**](#documentation) &middot;
[**Marketplace**](https://marketplace.visualstudio.com/items?itemName=jeffreylanters.npm-package-version-bumper) &middot;
[**Buy me a Coffee**](https://github.com/sponsors/jeffreylanters) &middot;
[**Discussion Board**](https://github.com/jeffreylanters/vsce-npm-package-version-bumper/discussions)
**&Gt;**

<br/><br/>

[![npm](https://img.shields.io/badge/fund_this_project-sponsor-E12C9A.svg?style=for-the-badge)](https://github.com/sponsors/jeffreylanters)

Hi! My name is Jeffrey Lanters, thanks for checking out my modules! I’m a developer and designer in a broad field of games and apps, love to teach about game development, and help others by contributing in the world of open source software. If you're using this module for production, please consider donating to support the project. Thank you!

**&Lt;**
**Made with &hearts; by Jeffrey Lanters**
**&Gt;**

<br/><br/>

</div>

# Installation

Install the NPM Package Version Bumper Extension for Visual Studio Code by running the following command, or follow one of the instructions below.

```
$ code --install-extension jeffreylanters.npm-package-version-bumper
```

- Search for NPM Package Version Bumper in the Extensions tab
- [Download or Install directly from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jeffreylanters.npm-package-version-bumper)
- [Download the VSIX file from the Releases to install manually](https://github.com/jeffreylanters/vsce-npm-package-version-bumper/releases)

# Documentation

Use this package to bump the version and write the new data back to package.json, package-lock.json, and, if present, npm-shrinkwrap.json. Click the Bump button in the bottom left corner on your Status bar and select one of the bump-types.

The newversion argument will be a valid semver string, a valid second argument to semver.inc (one of patch, minor, major, prepatch, preminor, premajor or prerelease). In the second case, the existing version will be incremented by 1 in the specified field.

![preview](https://raw.githubusercontent.com/jeffreylanters/vsce-npm-package-version-bumper/master/resources/package/preview.png)
