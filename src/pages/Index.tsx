
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { User, Lock, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Überprüfe die Ratenbegrenzung (18 Sekunden zwischen Versuchen)
    const now = Date.now();
    if (isRegister && now - lastAttemptTime < 18000) {
      toast({
        variant: "destructive",
        title: "Zu viele Versuche",
        description: "Bitte warten Sie 18 Sekunden, bevor Sie es erneut versuchen.",
      });
      return;
    }

    setIsLoading(true);
    if (isRegister) {
      setLastAttemptTime(now);
    }

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (error) {
          if (error.message.includes("rate_limit")) {
            throw new Error("Bitte warten Sie 18 Sekunden, bevor Sie es erneut versuchen.");
          }
          throw error;
        }

        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte überprüfen Sie Ihre E-Mails für die Bestätigung.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen zurück!",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            {isRegister ? "Registrierung" : "Anmeldung"}
          </h1>
          <p className="text-gray-500">
            {isRegister
              ? "Erstellen Sie ein neues Konto"
              : "Bitte melden Sie sich an, um fortzufahren"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Benutzername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Laden..."
              : isRegister
              ? "Registrieren"
              : "Anmelden"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Bereits registriert? Zur Anmeldung"
              : "Noch kein Konto? Registrieren"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
