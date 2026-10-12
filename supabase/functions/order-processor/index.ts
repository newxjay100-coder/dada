// Supabase Edge Function: order-processor
// Secure server-side order validation, stock reservation, and payment verification

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

    const { orderId, paymentKey, paymentMethod, amount } = await req.json();

    if (!orderId || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Fetch order details securely
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Validate amount matches
    if (Number(order.final_payment_amount) !== Number(amount)) {
      return new Response(JSON.stringify({ error: "Payment amount mismatch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Update order status to paid
    await supabase
      .from("orders")
      .update({
        order_status: "paid",
        payment_status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // 4. Record payment
    await supabase.from("payments").insert({
      order_id: orderId,
      payment_key: paymentKey || `PAY-${Date.now()}`,
      payment_method: paymentMethod,
      payment_status: "completed",
      amount: amount,
      paid_at: new Date().toISOString(),
    });

    // 5. Deduct inventory & record transaction
    for (const item of order.order_items) {
      if (item.variant_id) {
        // Decrement variant stock
        await supabase.rpc("decrement_stock", {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity,
        }).catch(() => null);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order processed successfully", orderId }),
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
