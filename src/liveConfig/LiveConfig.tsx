import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface LiveConfigState {
  apiKey: string;
  enableDarkMode: boolean;
  updateInterval: number;
  showEmoteStats: boolean;
  minimumEmotions: number;
}

function LiveConfig() {
  const [config, setConfig] = useState<LiveConfigState | null>(null);

  useEffect(() => {
    // Inicjalizacja rozszerzenia Twitch
    Twitch.ext.onAuthorized((auth: { token: string }) => {
      console.log("Autoryzacja live config udana!", auth.token);
    });

    // Załaduj konfigurację
    loadConfig();

    // Nasłuchuj zmian konfiguracji
    Twitch.ext.configuration.onChanged(() => {
      loadConfig();
    });
  }, []);

  const loadConfig = () => {
    try {
      const savedConfig = JSON.parse(Twitch.ext.configuration.broadcaster?.content || "{}");
      setConfig(savedConfig);
    } catch (error) {
      console.error("Błąd podczas ładowania konfiguracji:", error);
    }
  };

  if (!config) {
    return (
      <Card className="celestial-card m-4">
        <CardContent>
          <p className="text-muted-foreground">Ładowanie konfiguracji...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="celestial-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        </div>

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Settings2 className="w-4 h-4 text-primary" />
            Aktywna Konfiguracja
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Tryb Ciemny</p>
                <p className="text-sm text-muted-foreground">
                  {config.enableDarkMode ? "Włączony" : "Wyłączony"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Interwał Aktualizacji</p>
                <p className="text-sm text-muted-foreground">
                  {config.updateInterval} sekund
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Statystyki Emotek</p>
                <p className="text-sm text-muted-foreground">
                  {config.showEmoteStats ? "Włączone" : "Wyłączone"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Minimalna Liczba Emocji</p>
                <p className="text-sm text-muted-foreground">
                  {config.minimumEmotions}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={loadConfig}
                variant="outline"
                size="sm"
                className="celestial-card hover:bg-accent/10 gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Odśwież
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default LiveConfig;
