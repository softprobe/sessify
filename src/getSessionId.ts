import { v4 as uuidv4 } from "uuid";

export const getSessionId = (source: string) => {
  // TODO: 这里source需要考虑安全性
  const sessionId = [
    "session",
    new Date().getTime(),
    source,
    uuidv4(), // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  ]
    .join("-")
    .replace(" ", "");
  console.log("✅ Transaction id created", sessionId);
  return sessionId;
};
