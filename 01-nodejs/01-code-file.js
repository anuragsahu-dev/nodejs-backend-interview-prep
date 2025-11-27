import crypto from "node:crypto";

const start = Date.now();

// source code 1

crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 1 Done`);
});
crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 2 Done`);
});
crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 3 Done`);
});
crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 4 Done`);
});

crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 1 Done`);
});
crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 2 Done`);
});
crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 3 Done`);
});
crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 4 Done`);
});
crypto.pbkdf2("password5", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 5 Done`);
});