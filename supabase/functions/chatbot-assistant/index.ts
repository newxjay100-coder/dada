// Supabase Edge Function: chatbot-assistant
// AI-ready customer support chatbot without exposing API keys to client

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, category } = await req.json();
    const aiApiKey = Deno.env.get("AI_API_KEY"); // Stored safely in Supabase Edge Secrets

    let reply = "";
    let quickActions: string[] = [];

    // Fallback rule engine when AI API Key is not yet configured in Supabase Secrets
    if (!aiApiKey) {
      if (message.includes("주문") || message.includes("조회")) {
        reply = "고객님의 주문 내역은 [마이페이지 > 나의 주문 내역]에서 실시간으로 확인하실 수 있습니다. 특정 주문번호 조회가 필요하시면 번호를 입력해 주세요.";
        quickActions = ["주문 배송조회", "주문 취소요청", "1:1 문의"];
      } else if (message.includes("배송")) {
        reply = "DASSOBA의 기본 배송은 결제 완료 후 1~3 영업일 내 출고됩니다. 50,000원 이상 구매 시 무료 배송 혜택이 적용됩니다.";
        quickActions = ["배송 현황", "배송지 변경", "반품/교환"];
      } else if (message.includes("반품") || message.includes("교환") || message.includes("환불")) {
        reply = "상품 수령 후 7일 이내 [마이페이지 > 반품/교환 내역]에서 간편하게 접수하실 수 있습니다. 단순 변심 반품 시 왕복 택배비가 발생할 수 있습니다.";
        quickActions = ["반품 접수", "교환 접수", "환불 정책 안내"];
      } else if (message.includes("포인트") || message.includes("쿠폰")) {
        reply = "신규 가입 시 5,000원 웰컴 쿠폰과 일반 리뷰 500P, 포토 리뷰 1,000P가 적립됩니다. 쿠폰함과 포인트 내역은 마이페이지에서 확인 가능합니다.";
        quickActions = ["쿠폰함 가기", "포인트 내역", "회원 혜택 보기"];
      } else {
        reply = "안녕하세요! 다써바(DASSOBA) 컨시어지 봇입니다. 주문, 배송, 반품, 상품 문의 등 원하시는 내용을 아래 버튼에서 선택하시거나 직접 입력해 주세요.";
        quickActions = ["주문조회", "배송조회", "반품/교환", "포인트/쿠폰", "상담원 연결"];
      }

      return new Response(JSON.stringify({ reply, quickActions, mode: "smart_rules" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If AI_API_KEY is configured in Supabase secrets, proxy to LLM API safely
    // Example: call Gemini / OpenAI API using server-side key
    return new Response(JSON.stringify({ reply: "AI 응답 연동 대기 중입니다.", quickActions: [] }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
