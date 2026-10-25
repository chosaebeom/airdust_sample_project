
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SAMPLE_DEVICES } from "@/lib/sensing-data";

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // API 키가 없을 때 로컬 응답 
    if (!apiKey) {
      const overDevices = SAMPLE_DEVICES.filter((d) => d.status === "over_threshold");
      const commErrors = SAMPLE_DEVICES.filter((d) => d.status === "comm_error");
      const normals = SAMPLE_DEVICES.filter((d) => d.status === "normal");

      if (message.includes("임계치") || message.includes("초과") || message.includes("위험")) {
        return NextResponse.json({
          reply: `현재 임계치 초과 장비는 총 ${overDevices.length}대입니다.\n대상: ${
            overDevices.map((d) => d.name || d.id).join(", ") || "없음"
          }`,
          targetDeviceId: overDevices[0]?.id ?? null,
        });
      }

      if (message.includes("통신") || message.includes("이상") || message.includes("오류")) {
        return NextResponse.json({
          reply: `현재 통신 이상 장비는 총 ${commErrors.length}대입니다.\n대상: ${
            commErrors.map((d) => d.name || d.id).join(", ") || "없음"
          }`,
          targetDeviceId: commErrors[0]?.id ?? null,
        });
      }

      return NextResponse.json({
        reply: `[현재 용인시 관제 요약]\n• 전체 장비: ${SAMPLE_DEVICES.length}대\n• 정상: ${normals.length}대\n• 임계치 초과: ${overDevices.length}대\n• 통신 이상: ${commErrors.length}대\n\n("임계치 초과 장비 알려줘"처럼 질문해 보세요!)`,
        targetDeviceId: null,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `
너는 경기도 용인시 실시간 센서 관제 대시보드의 AI 어시스턴트야.
반드시 아래 제공된 [실시간 센서 목업 데이터]만을 근거로 한국어로 간결하고 친절하게 답변해.

[실시간 센서 목업 데이터]
${JSON.stringify(SAMPLE_DEVICES, null, 2)}

[상태 코드 기준]
- normal: 정상
- over_threshold: 임계치초과
- comm_error: 통신이상

[응답 규칙]
반드시 아래 JSON 형식으로만 응답해:
{
  "reply": "사용자에게 보여줄 답변 텍스트 (줄바꿈 포함 가능)",
  "targetDeviceId": "질문과 가장 관련 깊은 특정 장비 1개의 id (해당하거나 특정할 수 없으면 null)"
}
    `;

    // 최근 대화 내역(단기 기억) 6개까지만 포함
    const recentHistory = history
      .slice(-6)
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "사용자" : "AI"}: ${m.content}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${recentHistory ? `[이전 대화]\n${recentHistory}\n\n` : ""}사용자 질문: ${message}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json", // JSON 응답 강제
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    return NextResponse.json({
      reply: parsed.reply || "데이터를 분석했지만 답변을 생성하지 못했습니다.",
      targetDeviceId: parsed.targetDeviceId || null,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", targetDeviceId: null },
      { status: 500 }
    );
  }
}