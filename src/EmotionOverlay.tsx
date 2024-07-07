import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis } from "recharts";
import { useStore } from "./store";
import { Loader2 } from "lucide-react";
import { Progress } from '@/components/ui/progress';

interface EmotionOverlayProps {
  chatData: string[];
}

const EmotionOverlay: React.FC<EmotionOverlayProps> = ({ chatData }) => {
  const { 
    currentEmotions,
    emotionHistory,
    stats,
    isLoading,
    error,
    analyzeChat,
    clearHistory,
    exportData,
    getStats
  } = useStore();

  useEffect(() => {
    analyzeChat(chatData);
    getStats();
  }, [chatData, analyzeChat, getStats]);

  const COLORS = {
    happy: "#FFD700",
    sad: "#1E90FF",
    angry: "#FF4500",
    surprised: "#9400D3",
    neutral: "#808080"
  };

  const emotionLabels = {
    happy: "Szczęśliwy",
    sad: "Smutny",
    angry: "Zły",
    surprised: "Zaskoczony",
    neutral: "Neutralny"
  };

  if (error) {
    return (
      <Card className="w-[600px] p-4 bg-opacity-80 backdrop-blur-sm">
        <CardContent className="text-red-500">
          Błąd: {error}
        </CardContent>
      </Card>
    );
  }

  const pieData = currentEmotions ? 
    Object.entries(currentEmotions)
      .filter(([key]) => key !== 'timestamp' && key !== 'negativeRatio' && key !== 'id')
      .map(([key, value]) => ({
        name: emotionLabels[key as keyof typeof emotionLabels],
        value: value as number
      })) : [];

  if (!currentEmotions) {
    return null;
  }

  const totalEmotions = 
    currentEmotions.happy + 
    currentEmotions.sad + 
    currentEmotions.angry + 
    currentEmotions.surprised + 
    currentEmotions.neutral;

  const calculatePercentage = (value: number) => 
    ((value / totalEmotions) * 100).toFixed(1);

  return (
    <div className="relative">
      <AnimatePresence>
        {(currentEmotions?.negativeRatio ?? 0) > 0.5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 20px rgba(255, 0, 0, 0.3)",
                "0 0 40px rgba(255, 0, 0, 0.5)",
                "0 0 20px rgba(255, 0, 0, 0.3)"
              ]
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-lg bg-red-500/10 -z-10"
          />
        )}
      </AnimatePresence>
      <Card className="w-[600px] p-4 bg-opacity-80 backdrop-blur-sm">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <motion.h2 
              className="text-xl font-bold"
              animate={{
                color: (currentEmotions?.negativeRatio ?? 0) > 0.5 ? "#ff4444" : "#000000"
              }}
              transition={{ duration: 0.5 }}
            >
              Emocje na Czacie
            </motion.h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => clearHistory()}
                disabled={isLoading}
              >
                Wyczyść
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportData()}
                disabled={isLoading}
              >
                Eksportuj
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[250px]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-sm space-y-1">
                  <p>Średni poziom negatywnych: {(stats.averageNegative * 100).toFixed(1)}%</p>
                  <p>Maksymalny poziom: {(stats.maxNegative * 100).toFixed(1)}%</p>
                  <p>Liczba wiadomości: {stats.totalMessages}</p>
                  <p>Dominująca emocja: {emotionLabels[stats.dominantEmotion as keyof typeof emotionLabels]}</p>
                </div>
                <div>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[Object.keys(emotionLabels)[index] as keyof typeof COLORS]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>

              <div className="h-[200px]">
                <LineChart width={550} height={200} data={emotionHistory}>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip 
                    labelFormatter={(value: number) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negativeRatio" 
                    stroke="#ff4444" 
                    name="Poziom Negatywnych Emocji"
                  />
                </LineChart>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Emocje w czacie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Szczęście</span>
                        <span>{calculatePercentage(currentEmotions.happy)}%</span>
                      </div>
                      <Progress value={Number(calculatePercentage(currentEmotions.happy))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Smutek</span>
                        <span>{calculatePercentage(currentEmotions.sad)}%</span>
                      </div>
                      <Progress value={Number(calculatePercentage(currentEmotions.sad))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Złość</span>
                        <span>{calculatePercentage(currentEmotions.angry)}%</span>
                      </div>
                      <Progress value={Number(calculatePercentage(currentEmotions.angry))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Zaskoczenie</span>
                        <span>{calculatePercentage(currentEmotions.surprised)}%</span>
                      </div>
                      <Progress value={Number(calculatePercentage(currentEmotions.surprised))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Neutralne</span>
                        <span>{calculatePercentage(currentEmotions.neutral)}%</span>
                      </div>
                      <Progress value={Number(calculatePercentage(currentEmotions.neutral))} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statystyki emotek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Unikalne emotki:</span>
                        <span className="font-bold">{currentEmotions.uniqueEmoteCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wszystkie emotki:</span>
                        <span className="font-bold">{currentEmotions.totalEmoteCount}</span>
                      </div>
                      {currentEmotions.mostUsedEmote && (
                        <div className="space-y-2">
                          <div className="font-semibold">Najpopularniejsza emotka:</div>
                          <div className="flex items-center gap-2">
                            <img 
                              src={currentEmotions.mostUsedEmote.url} 
                              alt={currentEmotions.mostUsedEmote.emoteName}
                              className="w-8 h-8"
                            />
                            <span>{currentEmotions.mostUsedEmote.emoteName}</span>
                            <span className="text-muted-foreground">
                              ({currentEmotions.mostUsedEmote.count} razy)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ogólne statystyki</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Dominująca emocja:</span>
                        <span className="font-bold capitalize">{stats.dominantEmotion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Średni negatywny wskaźnik:</span>
                        <span className="font-bold">{(stats.averageNegative * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maksymalny negatywny wskaźnik:</span>
                        <span className="font-bold">{(stats.maxNegative * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Łączna liczba wiadomości:</span>
                        <span className="font-bold">{stats.totalMessages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Łączna liczba emotek:</span>
                        <span className="font-bold">{stats.totalEmotes}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionOverlay;
