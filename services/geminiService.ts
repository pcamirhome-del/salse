
import { GoogleGenAI, Type } from "@google/genai";
import { Order, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getPredictiveInsights = async (orders: Order[], products: Product[]) => {
  if (!process.env.API_KEY) return "توقعات الذكاء الاصطناعي غير متاحة حالياً (مفتاح API مفقود).";

  const dataSummary = {
    totalOrders: orders.length,
    recentSales: orders.slice(-10).map(o => ({ date: o.timestamp, total: o.totalValue })),
    inventory: products.map(p => ({ name: p.name, stock: p.stock })),
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بناءً على بيانات المبيعات والمخزون التالية: ${JSON.stringify(dataSummary)}. 
      قدم 3 رؤى تنبؤية مختصرة للعمل. ركز على تحذيرات المخزون أو اتجاهات المبيعات. 
      اجعل كل رؤية أقل من 15 كلمة. أرسل النتيجة كقائمة نقطية باللغة العربية.`,
      config: {
        systemInstruction: "أنت محلل أعمال خبير تقدم توقعات مبيعات موجزة ودقيقة تعتمد على البيانات باللغة العربية.",
        temperature: 0.7,
      },
    });

    return response.text || "تعذر توليد التوقعات في الوقت الحالي.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "خطأ في الاتصال بمحلل الذكاء الاصطناعي.";
  }
};
