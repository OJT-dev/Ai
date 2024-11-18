// This is a wrapper around the HeyGen SDK to handle module compatibility
let StreamingAvatar: any = null;

export interface StreamingAvatarConfig {
  token: string;
}

export interface AvatarConfig {
  avatar_id: string;
  voice_id: string;
  quality: 'low' | 'medium' | 'high';
  language: string;
  voice: {
    stability: number;
    similarity: number;
    style: number;
    speed: number;
  };
}

export interface VoiceChatConfig {
  useSilencePrompt?: boolean;
  language?: string;
  token?: string;
  wsConfig?: {
    reconnect?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    params?: {
      token?: string;
      silence_response?: boolean;
      stt_language?: string;
    };
  };
}

export interface SpeakOptions {
  text: string;
  voice_id?: string;
}

export const StreamingEvents = {
  AVATAR_START_TALKING: 'avatar_start_talking',
  AVATAR_STOP_TALKING: 'avatar_stop_talking',
  STREAM_READY: 'stream_ready',
  STREAM_DISCONNECTED: 'stream_disconnected',
  ERROR: 'error'
} as const;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function initializeStreamingAvatar(config: StreamingAvatarConfig) {
  if (!StreamingAvatar) {
    try {
      console.log('Loading StreamingAvatar module...');
      const module = await import('@heygen/streaming-avatar');
      StreamingAvatar = module.default;
      console.log('StreamingAvatar module loaded successfully');
    } catch (error) {
      console.error('Error loading StreamingAvatar:', error);
      throw new Error('Failed to load StreamingAvatar module');
    }
  }

  try {
    console.log('Initializing StreamingAvatar with token...');
    const instance = new StreamingAvatar({
      token: config.token,
      debug: true // Enable debug mode for more detailed logs
    });

    // Add error event listener
    instance.on('error', (error: any) => {
      console.error('StreamingAvatar error:', error);
    });

    // Add stream ready event listener with detailed logging
    instance.on('stream_ready', (event: any) => {
      console.log('Stream ready event:', {
        hasVideo: !!event.video,
        videoType: event.video?.tagName,
        videoSize: event.video ? `${event.video.videoWidth}x${event.video.videoHeight}` : 'N/A',
        videoProps: event.video ? Object.keys(event.video) : []
      });

      // Ensure video element has proper attributes
      if (event.video instanceof HTMLVideoElement) {
        event.video.playsInline = true;
        event.video.autoplay = true;
        event.video.muted = true;
        event.video.className = 'w-full h-full object-cover';
        
        // Force play the video
        event.video.play().catch((err: any) => {
          console.error('Error playing video:', err);
        });
      }
    });

    // Add custom methods for better error handling and retries
    const originalCreateStartAvatar = instance.createStartAvatar.bind(instance);
    instance.createStartAvatar = async (config: AvatarConfig) => {
      console.log('Creating avatar with config:', JSON.stringify(config, null, 2));
      try {
        const result = await originalCreateStartAvatar({
          ...config,
          // Ensure proper initialization parameters
          init_wait: true,
          auto_start: true
        });
        console.log('Avatar created successfully');
        return result;
      } catch (error) {
        console.error('Error creating avatar:', error);
        throw error;
      }
    };

    const originalStartVoiceChat = instance.startVoiceChat.bind(instance);
    instance.startVoiceChat = async (config: VoiceChatConfig) => {
      console.log('Starting voice chat with config:', JSON.stringify(config, null, 2));
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          // Wait for WebSocket to be ready
          await delay(2000);

          const result = await originalStartVoiceChat({
            ...config,
            // Add WebSocket configuration
            wsConfig: {
              reconnect: true,
              maxRetries: 3,
              retryDelay: 1000,
              // Add additional WebSocket parameters
              params: {
                token: config.token,
                silence_response: true,
                stt_language: config.language || 'en-US'
              }
            }
          });

          console.log('Voice chat started successfully');
          return result;
        } catch (error) {
          attempts++;
          console.error(`Error starting voice chat (attempt ${attempts}/${maxAttempts}):`, error);
          
          if (attempts === maxAttempts) {
            throw error;
          }
          
          await delay(2000);
        }
      }
    };

    const originalSpeak = instance.speak.bind(instance);
    instance.speak = async (options: SpeakOptions) => {
      console.log('Speaking with options:', JSON.stringify(options, null, 2));
      try {
        const result = await originalSpeak(options);
        console.log('Speak command executed successfully');
        return result;
      } catch (error) {
        console.error('Error speaking:', error);
        throw error;
      }
    };

    return instance;
  } catch (error) {
    console.error('Error initializing StreamingAvatar:', error);
    throw error;
  }
}
