import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

interface ConfigState {
  apiKey: string;
  enableDarkMode: boolean;
  updateInterval: number;
  showEmoteStats: boolean;
  minimumEmotions: number;
}

function Config() {
  const [config, setConfig] = useState<ConfigState>({
    apiKey: "",
    enableDarkMode: true,
    updateInterval: 5,
    showEmoteStats: true,
    minimumEmotions: 3
  });

  useEffect(() => {
    // Inicjalizacja rozszerzenia Twitch
    Twitch.ext.onAuthorized((auth: { token: string }) => {
      console.log("Autoryzacja udana!", auth.token);
    });

    // Załaduj zapisaną konfigurację
    Twitch.ext.configuration.onChanged(() => {
      try {
        const savedConfig = JSON.parse(Twitch.ext.configuration.broadcaster?.content || "{}");
        setConfig(prev => ({ ...prev, ...savedConfig }));
      } catch (error) {
        console.error("Błąd podczas ładowania konfiguracji:", error);
      }
    });
  }, []);

  const handleSave = () => {
    Twitch.ext.configuration.set("broadcaster", "1", JSON.stringify(config));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ConfigState) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSwitchChange = (checked: boolean, key: keyof ConfigState) => {
    setConfig(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <motion.div 
      className="min-h-screen bg-background p-8 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="celestial-card w-[600px] relative overflow-hidden">
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
            <Settings2 className="w-6 h-6 text-primary" />
            Konfiguracja EmoScan
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Klucz API</Label>
              <Input
                id="apiKey"
                type="password"
                value={config.apiKey}
                onChange={(e) => handleInputChange(e, 'apiKey')}
                className="celestial-card"
                placeholder="Wprowadź klucz API..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tryb Ciemny</Label>
                <p className="text-sm text-muted-foreground">
                  Włącz ciemny motyw interfejsu
                </p>
              </div>
              <Switch
                checked={config.enableDarkMode}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'enableDarkMode')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateInterval">Interwał Aktualizacji (sekundy)</Label>
              <Input
                id="updateInterval"
                type="number"
                min={1}
                max={60}
                value={config.updateInterval}
                onChange={(e) => handleInputChange(e, 'updateInterval')}
                className="celestial-card"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Statystyki Emotek</Label>
                <p className="text-sm text-muted-foreground">
                  Pokazuj statystyki używanych emotek
                </p>
              </div>
              <Switch
                checked={config.showEmoteStats}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'showEmoteStats')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumEmotions">Minimalna Liczba Emocji</Label>
              <Input
                id="minimumEmotions"
                type="number"
                min={1}
                max={10}
                value={config.minimumEmotions}
                onChange={(e) => handleInputChange(e, 'minimumEmotions')}
                className="celestial-card"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="celestial-card hover:bg-accent/10 gap-2"
            >
              <Save className="w-4 h-4" />
              Zapisz Konfigurację
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Config;
