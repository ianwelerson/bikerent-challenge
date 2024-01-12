export default {
  "*.{vue,js,cjs,mjs,ts}": "npm run lint:staged",
  "*.{vue,ts}": () => "npm run type-check"
}
