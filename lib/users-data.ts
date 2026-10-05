/** SHA-256("1234") — 목업용 공통 비밀번호 */
const DEFAULT_PW_HASH =
  "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

export type UserInfo = {
  id: string;
  name: string;
  /** SHA-256 해시 (비밀번호: 1234) */
  passwordHash: string;
};

/** 목업 사용자 목록 */
export const SAMPLE_USERS: UserInfo[] = [
  { id: "admin", name: "조세범", passwordHash: DEFAULT_PW_HASH },
  { id: "kim01", name: "김철수", passwordHash: DEFAULT_PW_HASH },
  { id: "park02", name: "박영희", passwordHash: DEFAULT_PW_HASH },
  { id: "lee03", name: "이민준", passwordHash: DEFAULT_PW_HASH },
  { id: "choi04", name: "최수아", passwordHash: DEFAULT_PW_HASH },
  { id: "jung05", name: "정민아", passwordHash: DEFAULT_PW_HASH },
  { id: "kang06", name: "강도윤", passwordHash: DEFAULT_PW_HASH },
  { id: "yoon07", name: "윤서진", passwordHash: DEFAULT_PW_HASH },
  { id: "jang08", name: "장태양", passwordHash: DEFAULT_PW_HASH },
  { id: "shin09", name: "신예린", passwordHash: DEFAULT_PW_HASH },
];