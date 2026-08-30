import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");
const siteConfig = fs.readFileSync(path.join(root, "src/lib/siteConfig.js"), "utf8");

test("Website email is configured to the new Gmail address", () => {
  assert.match(siteConfig, /Ladynest1@gmail\.com/);
  assert.doesNotMatch(siteConfig, /info@ladynest\.store/);
});

test("SMTP configuration uses Gmail and environment variables", () => {
  assert.match(envExample, /SMTP_HOST=.*smtp\.gmail\.com/);
  assert.match(envExample, /SMTP_PORT=587/);
  assert.match(envExample, /SMTP_USER=.*Ladynest1@gmail\.com/);
  assert.match(envExample, /SMTP_FROM=.*Ladynest1@gmail\.com/);
  assert.match(envExample, /ORDER_NOTIFICATION_EMAIL=.*Ladynest1@gmail\.com/);
  assert.match(envExample, /CONTACT_NOTIFICATION_EMAIL=.*Ladynest1@gmail\.com/);
  assert.match(envExample, /SMTP_PASSWORD=/);
  assert.doesNotMatch(envExample, /SMTP_PASSWORD=.*Ladynest1@gmail\.com/);
});
