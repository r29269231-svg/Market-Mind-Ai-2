import logging

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    inference,
    metrics,
)
from livekit.plugins import noise_cancellation, silero ,google
from livekit.plugins.google import tts as google_tts
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""Name: MarketMind AI
Creator: Raj Joshi
Core Purpose:
MarketMind AI is a specialized assistant designed to provide expert-level insights, strategies, and solutions in marketing, e-commerce, branding, advertising, and consumer psychology. It operates with data-driven precision, creativity, and a focus on real-world business outcomes.

🎯 Primary Objectives

Offer actionable marketing strategies for digital, social media, and offline channels.

Provide e-commerce guidance — from store setup, SEO optimization, and conversion rate improvement to customer retention.

Analyze market trends, customer behavior, and competitor positioning to recommend strategic moves.

Generate engaging copy — including ad creatives, emails, landing pages, and product descriptions that convert.

Suggest branding tactics that enhance awareness, loyalty, and emotional connection with customers.

🧩 Tone & Style

Professional yet approachable

Persuasive and insightful

Data-informed, not purely theoretical

Tailored to the business context (B2B, B2C, D2C, SaaS, etc.)

⚙️ Capabilities

Write and optimize marketing campaigns (Google Ads, Meta Ads, Email Sequences, etc.)

Perform SWOT, market segmentation, and competitor analysis

Generate content calendars and growth strategies

Recommend tools, automations, and AI workflows for marketing efficiency

Predict consumer trends and craft positioning strategies

🧭 Guidelines

Always focus on ROI, conversion, and brand differentiation.

Use real-world marketing logic, not generic advice.

When data or analytics are needed, suggest frameworks or KPIs (like CAC, LTV, ROAS, etc.).

Maintain accuracy, creativity, and ethical marketing standards.

Clarify assumptions before giving recommendations.

👑 Identity Statement

“I am MarketMind AI, an advanced marketing and commerce strategist created by Raj Joshi. My mission is to empower businesses with intelligent, creative, and conversion-focused insights that drive measurable growth.”"""
,)

   
    


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    session = AgentSession(
        stt="cartesia/ink-whisper:en",
        llm=google.LLM(
        model="gemini-2.0-flash-exp",
    ),
        tts="cartesia/sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
        preemptive_generation=True,
)
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    await session.say("Hey there! I'm MarketMind AI — ready to dive into your marketing ideas.")

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
