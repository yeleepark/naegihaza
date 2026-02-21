'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Participant, DiceRollConfig } from '@/types/dice';
import { SEGMENT_COLORS } from '@/utils/dice';
import DiceScene from './DiceScene';

type GameRollingProps = {
  participants: Participant[];
  currentRollingIndex: number;
  rollConfig?: DiceRollConfig;
  isRolling: boolean;
  onRollNext: () => void;
  onRollComplete: (value1: number, value2: number) => void;
  onShowResult: () => void;
};

export default function GameRolling({
  participants,
  currentRollingIndex,
  rollConfig,
  isRolling,
  onRollNext,
  onRollComplete,
  onShowResult,
}: GameRollingProps) {
  const allRolled = participants.every((p) => p.totalValue !== undefined);
  const currentParticipant = participants[currentRollingIndex];
  const rolledParticipants = participants
    .filter((p) => p.totalValue !== undefined)
    .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0)); // Sort by score descending

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Current Dice Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h2 className="font-game text-2xl font-black text-black mb-2">
                주사위 굴리기
              </h2>
              {!allRolled && currentParticipant && (
                <p className="font-game text-xl text-black">
                  {currentParticipant.name}님 차례!
                </p>
              )}
              {allRolled && (
                <p className="font-game text-xl text-black">
                  모두 완료! 결과를 확인하세요
                </p>
              )}
            </div>

            {/* Current Dice Display */}
            {currentParticipant && (
              <div
                className="p-8 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6"
                style={{
                  backgroundColor:
                    SEGMENT_COLORS[currentParticipant.id % SEGMENT_COLORS.length],
                }}
              >
                <div className="bg-white rounded-lg p-4 border-2 border-black w-[250px] h-[200px]">
                  <DiceScene
                    rollConfig={
                      isRolling &&
                      rollConfig?.participantId === currentParticipant.id
                        ? rollConfig
                        : undefined
                    }
                    onRollComplete={onRollComplete}
                    currentValue1={currentParticipant.diceValue1}
                    currentValue2={currentParticipant.diceValue2}
                    isActive={true}
                  />
                </div>
              </div>
            )}

            {/* Control Button */}
            {!allRolled ? (
              <Button
                onClick={onRollNext}
                variant="primary"
                className="w-full max-w-xs lowercase"
                disabled={isRolling}
              >
                {isRolling ? '굴리는 중...' : '주사위 굴리기'}
              </Button>
            ) : (
              <Button
                onClick={onShowResult}
                variant="primary"
                className="w-full max-w-xs lowercase"
              >
                결과 보기
              </Button>
            )}
          </div>

          {/* Results List */}
          <div className="lg:w-80 flex flex-col">
            <h3 className="font-game text-lg font-black text-black mb-3">
              굴린 결과
            </h3>
            <div className="flex-1 bg-white rounded-lg border-4 border-black p-4 max-h-[400px] overflow-y-auto">
              {rolledParticipants.length === 0 ? (
                <p className="font-game text-sm text-black/50 text-center">
                  아직 아무도 굴리지 않았습니다
                </p>
              ) : (
                <div className="space-y-2">
                  {rolledParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-lg border-2 border-black"
                      style={{
                        backgroundColor:
                          SEGMENT_COLORS[participant.id % SEGMENT_COLORS.length],
                      }}
                    >
                      <span className="font-game font-bold text-black truncate flex-1">
                        {participant.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎲🎲</span>
                        <span className="font-game text-sm font-black text-black whitespace-nowrap">
                          {participant.diceValue1} + {participant.diceValue2} = {participant.totalValue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="font-game text-sm text-black/70 mt-2 text-center">
              {rolledParticipants.length} / {participants.length}명 완료
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
