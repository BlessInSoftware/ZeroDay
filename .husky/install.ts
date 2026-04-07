if (process.env.NODE_ENV === 'production' || process.env.CI) {
  process.exit(0);
}

const { default: husky } = await import('husky');

console.log(husky());

export {};
