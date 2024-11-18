declare module '@heygen/streaming-avatar' {
  export enum AvatarQuality {
    Low = 'low',
    Medium = 'medium',
    High = 'high'
  }

  export enum StreamingEvents {
    AVATAR_START_TALKING = 'avatar_start_talking',
    AVATAR_STOP_TALKING = 'avatar_stop_talking',
    STREAM_READY = 'stream_ready',
    STREAM_DISCONNECTED = 'stream_disconnected'
  }

  export enum VoiceEmotion {
    NEUTRAL = 'neutral',
    HAPPY = 'happy',
    SAD = 'sad',
    ANGRY = 'angry',
    EXCITED = 'excited'
  }

  export interface VoiceSettings {
    voiceId: string;
    rate?: number;
    emotion?: VoiceEmotion;
  }

  export interface AvatarConfig {
    quality: AvatarQuality;
    avatarName: string;
    knowledgeId?: string;
    knowledgeBase?: string;
    voice: VoiceSettings;
    language: string;
  }

  export interface VoiceChatConfig {
    useSilencePrompt?: boolean;
  }

  export interface SpeakOptions {
    text: string;
    task_type?: string;
    taskMode?: string;
  }

  export default class StreamingAvatar {
    constructor(config: { token: string });
    
    on(event: StreamingEvents, callback: (event: any) => void): void;
    
    createStartAvatar(config: AvatarConfig): Promise<any>;
    
    startVoiceChat(config: VoiceChatConfig): Promise<void>;
    
    speak(options: SpeakOptions): Promise<void>;
    
    closeVoiceChat(): Promise<void>;
    
    stopAvatar(): Promise<void>;
    
    interrupt(): Promise<void>;
    
    startListening(): void;
    
    stopListening(): void;
  }
}
