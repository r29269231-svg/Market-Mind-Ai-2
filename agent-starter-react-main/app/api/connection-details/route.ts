import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Prevent caching
export const revalidate = 0;

// Load environment variables
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

export async function POST(req: Request) {
  try {
    if (!LIVEKIT_URL) throw new Error('LIVEKIT_URL is not defined');
    if (!API_KEY) throw new Error('LIVEKIT_API_KEY is not defined');
    if (!API_SECRET) throw new Error('LIVEKIT_API_SECRET is not defined');

    // Parse optional data from frontend
    const body = await req.json().catch(() => ({}));
    const agentName: string | undefined = body?.room_config?.agents?.[0]?.agent_name;

    // Create random room and participant
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10000)}`;

    // Create the participant token
    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      agentName
    );

    // Send connection details back to frontend
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantName,
      participantToken,
    };

    const headers = new Headers({ 'Cache-Control': 'no-store' });
    return NextResponse.json(data, { headers });
  } catch (err: any) {
    console.error('Error creating LiveKit token:', err);
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}

async function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  if (!API_KEY || !API_SECRET) throw new Error('Missing LiveKit credentials');

  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };

  at.addGrant(grant);

  if (agentName) {
    at.roomConfig = new RoomConfiguration({
      agents: [{ agentName }],
    });
  }

  return at.toJwt();
}
