import { SAMPLE_USERS } from "./users-data";

/** 문자열을 SHA-256으로 해싱하여 hex 문자열 반환 */
export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** ID/PW 검증 (사용자 목록에서 ID 검색 후 SHA-256 해시 비교) */
export async function verifyLogin(
  id: string,
  pw: string
): Promise<{ id: string; name: string } | null> {
  const user = SAMPLE_USERS.find((u) => u.id === id);
  if (!user) return null;
  const hash = await sha256(pw);
  if (hash !== user.passwordHash) return null;
  return { id: user.id, name: user.name };
}