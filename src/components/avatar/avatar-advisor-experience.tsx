'use client';

import Link from 'next/link';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
import { FinancialAvatar } from './financial-avatar';
import { AvatarVisualPanel } from './avatar-visual-panel';
import { useAvatarAdvisor } from '@/hooks/use-avatar-advisor';
import { useProfile, isProfileComplete } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type AvatarAdvisorExperienceProps = {
  immersive?: boolean;
};

export function AvatarAdvisorExperience({ immersive = false }: AvatarAdvisorExperienceProps) {
  const { profile } = useProfile();
  const profileReady = isProfileComplete(profile);
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isThinking,
    avatarState,
    mouthOpen,
    visuals,
    voiceEnabled,
    setVoiceEnabled,
    voiceSupported,
    isListening,
    isSpeaking,
    startVoiceInput,
    stopVoiceInput,
    stopSpeaking,
  } = useAvatarAdvisor();

  return (
    <div className="space-y-4">
      {!profileReady && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Add your real income, expenses, and assets in{' '}
            <Link href="/profile" className="font-medium underline">
              Profile
            </Link>
            . Sophia uses your data—not demo numbers.
          </AlertDescription>
        </Alert>
      )}

      <div
        className={cn(
          'grid gap-6',
          'grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr]',
          immersive && 'xl:grid-cols-[360px_1fr]'
        )}
      >
        <div
          className={cn(
            'relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 shadow-xl',
            immersive
              ? 'border-slate-700/50 bg-slate-950'
              : 'border-border bg-card'
          )}
        >
          {immersive && (
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.2), transparent)',
              }}
            />
          )}

          <div className="relative z-10 flex w-full flex-col items-center">
            <Badge
              variant="outline"
              className={cn('mb-4', immersive && 'border-emerald-500/40 text-emerald-400')}
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Live consultation
            </Badge>

            <FinancialAvatar state={avatarState} mouthOpen={mouthOpen} />

            <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={isListening ? 'default' : 'outline'}
                className="gap-2"
                disabled={!voiceSupported}
                onClick={isListening ? stopVoiceInput : startVoiceInput}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Stop mic' : 'Voice input'}
              </Button>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <Switch id="voice-out" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                <Label htmlFor="voice-out" className="cursor-pointer text-xs">
                  {voiceEnabled ? (
                    <span className="flex items-center gap-1">
                      <Volume2 className="h-4 w-4" /> Speech on
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <VolumeX className="h-4 w-4" /> Speech off
                    </span>
                  )}
                </Label>
              </div>
              {isSpeaking && (
                <Button type="button" size="sm" variant="secondary" onClick={stopSpeaking}>
                  Stop speaking
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-h-[400px] flex-col gap-4">
          <AvatarVisualPanel visuals={visuals} />

          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
            <ScrollArea className="flex-1 p-4" style={{ maxHeight: immersive ? 300 : 220 }}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'max-w-[92%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'ml-auto bg-primary text-primary-foreground'
                        : 'border bg-muted/50'
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {isThinking && (
                  <p className="text-sm text-muted-foreground">Analyzing your profile…</p>
                )}
              </div>
            </ScrollArea>

            <form
              className="flex gap-2 border-t bg-muted/20 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  profileReady
                    ? 'Ask using your profile data…'
                    : 'Complete profile first, then ask a finance question'
                }
                disabled={isThinking}
              />
              <Button type="submit" disabled={isThinking || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

