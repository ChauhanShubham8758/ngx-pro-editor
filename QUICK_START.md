# Quick Start Guide - ngx-pro-editor Development

## 🚀 Quick Commands

### Build & Publish
```bash
# Build the library
npm run build:lib

# Create a local package for testing
npm run pack

# Publish to npm (after building)
npm run publish:lib
```

### Version Management
```bash
# Patch version (1.0.0 -> 1.0.1)
npm run version:patch

# Minor version (1.0.0 -> 1.1.0)
npm run version:minor

# Major version (1.0.0 -> 2.0.0)
npm run version:major
```

## 📁 Project Structure

```
ngx-pro-editor-workspace/
├── projects/
│   └── ngx-pro-editor/              # Library source
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   │   ├── color-picker/
│       │   │   │   ├── content/
│       │   │   │   ├── statusbar/
│       │   │   │   └── toolbar/
│       │   │   ├── models/
│       │   │   │   └── editor.models.ts
│       │   │   ├── services/
│       │   │   │   └── editor.service.ts
│       │   │   └── ngx-pro-editor.component.ts
│       │   └── public-api.ts        # Public exports
│       ├── package.json             # Package metadata
│       ├── README.md                # Package documentation
│       ├── LICENSE                  # MIT License
│       ├── CHANGELOG.md             # Version history
│       ├── ng-package.json          # Build config
│       └── tsconfig.lib.json        # TypeScript config
├── dist/                            # Build output (generated)
│   └── ngx-pro-editor/
├── package.json                     # Workspace config
├── angular.json                     # Angular workspace config
└── PUBLISHING_GUIDE.md              # This guide
```

## 🔧 Development Workflow

### 1. Make Changes
Edit files in `projects/ngx-pro-editor/src/lib/`

### 2. Build
```bash
npm run build:lib
```

### 3. Test Locally
```bash
cd dist/ngx-pro-editor
npm pack
# Install the .tgz file in a test project
```

### 4. Update Version
```bash
npm run version:patch  # or minor/major
```

### 5. Publish
```bash
npm run publish:lib
```

## 📦 What Gets Published

The build process creates:
- Compiled JavaScript (ES2022)
- TypeScript definitions (.d.ts)
- Metadata files
- README.md
- LICENSE
- package.json

**NOT included** (via .npmignore):
- Source TypeScript files
- Test files
- Config files

## 🎯 Key Files to Update

### Before Publishing
1. **package.json** - Version, description, keywords
2. **README.md** - Documentation, examples
3. **CHANGELOG.md** - Version history

### For Features
1. **Components** - Add/modify in `src/lib/components/`
2. **Services** - Add/modify in `src/lib/services/`
3. **Models** - Add/modify in `src/lib/models/`
4. **public-api.ts** - Export new public APIs

## 🧪 Testing Before Publish

### Local Testing
```bash
# Build
npm run build:lib

# Create package
cd dist/ngx-pro-editor
npm pack

# In a test Angular project
npm install /path/to/ngx-pro-editor-1.0.0.tgz
```

### Verify Build
```bash
cd dist/ngx-pro-editor
dir  # Check files are present
type package.json  # Verify metadata
```

## 📝 Checklist Before Publishing

- [ ] Code changes committed
- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] README.md accurate
- [ ] Build succeeds: `npm run build:lib`
- [ ] No TypeScript errors
- [ ] Package size reasonable
- [ ] Tested locally
- [ ] Logged into npm: `npm whoami`

## 🌐 After Publishing

1. **Verify on npm**: https://www.npmjs.com/package/ngx-pro-editor
2. **Test installation**: `npm install ngx-pro-editor`
3. **Update GitHub** (if repo exists)
4. **Announce** on social media/communities

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build:lib
```

### Can't Publish
```bash
# Check login
npm whoami

# Re-login
npm logout
npm login
```

### Wrong Version Published
```bash
# Unpublish (within 72 hours)
npm unpublish ngx-pro-editor@1.0.0

# Or deprecate
npm deprecate ngx-pro-editor@1.0.0 "Use 1.0.1 instead"
```

## 📚 Resources

- [Angular Library Guide](https://angular.io/guide/creating-libraries)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

---

**Happy coding! 🎉**
