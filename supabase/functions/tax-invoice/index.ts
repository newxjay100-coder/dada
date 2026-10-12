// Supabase Edge Function: tax-invoice
// Server-side tax invoice preparation and provider adapter proxy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId, companyName, businessNumber, representativeName, email } = await req.json();

    if (!orderId || !businessNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalAmount = Number(order.final_payment_amount);
    const supplyAmount = Math.round(totalAmount / 1.1);
    const taxAmount = totalAmount - supplyAmount;

    // Record document in tax_documents table
    const { data: doc, error: insertErr } = await supabase
      .from("tax_documents")
      .insert({
        order_id: orderId,
        document_type: "tax_invoice",
        company_name: companyName,
        business_registration_number: businessNumber,
        representative_name: representativeName,
        supply_amount: supplyAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        issue_status: "requested",
        issue_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (insertErr) {
      throw insertErr;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tax invoice request registered",
        document: doc,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
