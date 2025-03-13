import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useStore } from "./store";
import { Loader2, Sparkles, Download, Trash2 } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { motion } from "framer-motion";

interface EmotionOverlayProps {
  chatData: string[];
}

type EmotionType = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';

const EmotionOverlay: React.FC<EmotionOverlayProps> = ({ chatData }) => {
  const { 
    currentEmotions,
    emotionHistory,
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

  const COLORS: Record<EmotionType, string> = {
    happy: "#FFD700",
    sad: "#1E90FF",
    angry: "#FF4500",
    surprised: "#9400D3",
    neutral: "#808080"
  };

  const emotionLabels: Record<EmotionType, string> = {
    happy: "Szczęśliwy",
    sad: "Smutny",
    angry: "Zły",
    surprised: "Zaskoczony",
    neutral: "Neutralny"
  };

  if (error) {
    return (
      <Card className="celestial-card w-[600px] p-4">
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentEmotions) {
    return null;
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="celestial-card w-[600px] relative overflow-hidden backdrop-blur-lg border-opacity-30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Sparkles className="w-6 h-6 text-primary" />
            EmoScan
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analiza emocji w czasie rzeczywistym
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 flex-1">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin text-primary" />
                  <span className="text-muted-foreground">Analizuję emocje czatu...</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col space-y-3">
                    {Object.entries({
                      happy: currentEmotions?.happy || 0,
                      sad: currentEmotions?.sad || 0,
                      angry: currentEmotions?.angry || 0,
                      surprised: currentEmotions?.surprised || 0,
                      neutral: currentEmotions?.neutral || 0
                    }).map(([emotion, value]) => (
                      <motion.div 
                        key={emotion}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-24 text-sm font-medium">
                          {emotionLabels[emotion as EmotionType]}
                        </div>
                        <div className="flex-1">
                          <Progress
                            value={value * 100}
                            className="celestial-glow h-2"
                            style={{
                              '--progress-background': `linear-gradient(to right, ${COLORS[emotion as EmotionType]}, ${COLORS.neutral})`
                            } as React.CSSProperties}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
                          {(value * 100).toFixed(1)}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="celestial-card hover:bg-accent/10 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Wyczyść
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="celestial-card hover:bg-accent/10 gap-2"
              >
                <Download className="w-4 h-4" />
                Eksport
              </Button>
            </div>
          </div>

          {emotionHistory.length > 1 && (
            <motion.div 
              className="mt-6 celestial-card p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Historia Emocji
              </h3>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/10 pointer-events-none" />
                <LineChart width={500} height={200} data={emotionHistory}>
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    stroke="#666"
                  />
                  <YAxis 
                    stroke="#666"
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  {(Object.keys(COLORS) as EmotionType[]).map((emotion) => (
                    <Line
                      key={emotion}
                      type="monotone"
                      dataKey={emotion}
                      stroke={COLORS[emotion]}
                      name={emotionLabels[emotion]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmotionOverlay;
