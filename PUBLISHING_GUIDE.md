# Publishing Guide for ngx-pro-editor

This guide will help you publish your `ngx-pro-editor` package to npm.

## Prerequisites

1. **npm Account**: You already have an account with username `shubhamchauhanrspl`
2. **Node.js**: Ensure Node.js 14+ is installed
3. **Angular CLI**: Installed globally

## Step-by-Step Publishing Process

### 1. Login to npm

Open your terminal and login to npm:

```bash
npm login
```

Enter your credentials:
- Username: `shubhamchauhanrspl`
- Password: [your password]
- Email: [your email]
- OTP (if 2FA is enabled): [your OTP]

### 2. Install Dependencies

Navigate to your workspace and install dependencies:

```bash
cd "c:\Angular Demo\ngx-pro-editor-workspace"
npm install
```

### 3. Build the Library

Build the library for production:

```bash
npm run build:lib
```

This will create a production-ready build in `dist/ngx-pro-editor/`

### 4. Verify the Build

Check the build output:

```bash
cd dist/ngx-pro-editor
dir
```

You should see:
- `package.json`
- `README.md`
- `LICENSE`
- `*.d.ts` files (TypeScript definitions)
- `*.js` files (Compiled JavaScript)
- `*.metadata.json` files

### 5. Test Locally (Optional but Recommended)

Before publishing, test the package locally:

```bash
# In dist/ngx-pro-editor directory
npm pack
```

This creates a `.tgz` file. You can install this in another Angular project:

```bash
npm install path/to/ngx-pro-editor-1.0.0.tgz
```

### 6. Publish to npm

From the workspace root:

```bash
npm run publish:lib
```

Or manually:

```bash
cd dist/ngx-pro-editor
npm publish --access public
```

**Note**: Use `--access public` because scoped packages are private by default.

### 7. Verify Publication

After publishing, verify your package:

1. Visit: https://www.npmjs.com/package/ngx-pro-editor
2. Check package details, README, and version

### 8. Test Installation

Test installing your published package:

```bash
npm install ngx-pro-editor
```

## Version Management

### Update Version

Before publishing updates, increment the version:

```bash
# Patch version (1.0.0 -> 1.0.1) - for bug fixes
npm run version:patch

# Minor version (1.0.0 -> 1.1.0) - for new features
npm run version:minor

# Major version (1.0.0 -> 2.0.0) - for breaking changes
npm run version:major
```

Then rebuild and publish:

```bash
npm run publish:lib
```

## Common Issues & Solutions

### Issue 1: "You do not have permission to publish"

**Solution**: Make sure you're logged in with the correct account:
```bash
npm whoami
npm logout
npm login
```

### Issue 2: "Package name already exists"

**Solution**: The package name `ngx-pro-editor` must be unique. If taken, choose another name in `package.json`.

### Issue 3: "Version already published"

**Solution**: Increment the version number:
```bash
npm run version:patch
```

### Issue 4: Build errors

**Solution**: 
- Ensure all dependencies are installed: `npm install`
- Check Angular version compatibility
- Clear cache: `npm cache clean --force`

## Package Maintenance

### Update README

Edit: `projects/ngx-pro-editor/README.md`

### Update Changelog

Edit: `projects/ngx-pro-editor/CHANGELOG.md`

### Update Package Info

Edit: `projects/ngx-pro-editor/package.json`

## Publishing Checklist

Before each publish, verify:

- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] README.md is accurate
- [ ] All tests pass (if you have tests)
- [ ] Build succeeds without errors
- [ ] Package size is reasonable
- [ ] Dependencies are correct
- [ ] License file is present
- [ ] .npmignore is configured correctly

## Useful Commands

```bash
# Check current npm user
npm whoami

# View package info
npm view ngx-pro-editor

# View all versions
npm view ngx-pro-editor versions

# Unpublish a version (within 72 hours)
npm unpublish ngx-pro-editor@1.0.0

# Deprecate a version
npm deprecate ngx-pro-editor@1.0.0 "Use version 1.0.1 instead"

# Check package size
npm pack --dry-run
```

## Post-Publication

After publishing:

1. **Create GitHub Repository**:
   - Create repo: https://github.com/shubhamchauhanrspl/ngx-pro-editor
   - Push your code
   - Add topics/tags for discoverability

2. **Add Badges to README**:
   - npm version badge
   - License badge
   - Downloads badge
   - Build status (if CI/CD is set up)

3. **Promote Your Package**:
   - Share on Twitter/LinkedIn
   - Post on Angular communities
   - Write a blog post
   - Create demo/documentation site

4. **Monitor**:
   - Watch for issues on GitHub
   - Respond to npm package questions
   - Track download statistics

## Support

If you encounter issues:
- npm documentation: https://docs.npmjs.com/
- Angular library guide: https://angular.io/guide/creating-libraries
- Stack Overflow: Tag questions with `angular` and `npm`

---

**Good luck with your npm package! 🚀**
