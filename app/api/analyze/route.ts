import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { cv, jobSpec } = await req.json();

  if (!cv?.trim() || !jobSpec?.trim()) {
    return NextResponse.json(
      { error: "Both CV and job spec are required" },
      { status: 400 }
    );
  }

  const prompt = `You are a brutally honest careers coach helping someone decide whether to apply for a job.

Analyse this CV against this job spec and return a JSON object with this exact structure:

{
  "matchPercent": <number 0-100>,
  "summary": "<one sentence honest take>",
  "requirements": [
    {
      "text": "<the requirement from the spec>",
      "type": "skill" | "vibe",
      "status": "match" | "reword" | "gap",
      "note": "<explanation — for reword: what to change in the CV; for gap: is this a dealbreaker?>"
    }
  ],
  "easyWins": ["<specific reword suggestion>"],
  "genuineGaps": ["<thing they actually don't have>"]
}

Rules:
- "skill" = concrete, verifiable thing (technology, qualification, years of experience, specific methodology)
- "vibe" = subjective fluff ("passionate", "self-starter", "team player", "dynamic", "proactive") — these are almost always fine to claim
- "match" = CV clearly demonstrates this
- "reword" = candidate likely has it but their CV doesn't use the spec's language
- "gap" = genuinely missing

Be specific in notes. Don't waffle. Return ONLY valid JSON, no markdown.

CV:
${cv}

JOB SPEC:
${jobSpec}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const result = JSON.parse(content.text);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Analysis failed. Check your API key and try again." },
      { status: 500 }
    );
  }
}
