# ahoy

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Netlify Deployment

### Certificate Issues
If you encounter "certificate has expired" errors during deployment:

1. **Node.js Version**: The project uses Node.js 16 (specified in `.nvmrc`) - compatible with Vue CLI 4.4.0
2. **Build Configuration**: See `netlify.toml` for build settings
3. **Environment Variables**: In Netlify dashboard, add:
   - `NODE_VERSION`: `16`
   - `NPM_VERSION`: `8`

### Build Command
```bash
npm run build
```

### Publish Directory
```
dist
```
