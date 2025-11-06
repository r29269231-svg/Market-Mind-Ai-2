# token_server.py
import os
from flask import Flask, request
from livekit import api
from dotenv import load_dotenv

load_dotenv(".env.local")

app = Flask(__name__)

@app.route("/get-token")
def get_token():
    identity = request.args.get("identity", "guest")  # optional frontend name
    room_name = request.args.get("room", "mock_room")  # must match the one your agent joins

    token = (
        api.AccessToken(os.getenv("LIVEKIT_API_KEY"), os.getenv("LIVEKIT_API_SECRET"))
        .with_identity(identity)
        .with_grants(
            api.VideoGrants(
                room_join=True,
                room=room_name,
            )
        )
    )

    return token.to_jwt()

if __name__ == "__main__":
    app.run(port=8000)
