import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { Progress } from '@/components/ui/progress';

export function Mobile() {
  const { emotions, emotionHistory, error, setEmotions, addToHistory } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate getting emotions data
      const newEmotions = {
        happy: Math.random(),
        sad: Math.random(),
        angry: Math.random(),
        surprised: Math.random(),
        neutral: Math.random()
      };
      setEmotions(newEmotions);
      addToHistory(newEmotions.happy);
      setLoading(false);
    }, 2000);

    return () => clearInterval(interval);
  }, [setEmotions, addToHistory]);

  if (!emotions) {
    return null;
  }

  return (
    <div className="container p-4">
      <Card className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 z-0"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold">Emotion Analysis</CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="animate-spin text-primary" />
              <span className="ml-2">Analyzing emotions...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">
              {error}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {Object.entries({
                  happy: emotions?.happy || 0,
                  sad: emotions?.sad || 0,
                  angry: emotions?.angry || 0,
                  surprised: emotions?.surprised || 0,
                  neutral: emotions?.neutral || 0
                }).map(([emotion, value]) => (
                  <motion.div 
                    key={emotion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-1"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{emotion}</span>
                      <span>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={value * 100} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Happiness Trend</h3>
                <LineChart data={emotionHistory} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 