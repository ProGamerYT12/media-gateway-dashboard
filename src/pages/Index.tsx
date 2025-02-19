
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { User, Lock } from "lucide-react";

interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulierte Login-Logik (nur für Demo-Zwecke)
    if (username && password) {
      const user = {
        username,
        password,
        isAdmin: username === "admin",
      };
      
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast({
        title: "Erfolgreich angemeldet",
        description: `Willkommen zurück, ${username}!`,
      });
      
      // Weiterleitung zum Dashboard
      window.location.href = "/dashboard";
    } else {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Anmeldung</h1>
          <p className="text-gray-500">Bitte melden Sie sich an, um fortzufahren</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Anmelden
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Demo Zugangsdaten:</p>
          <p>Benutzer: user / Passwort: password</p>
          <p>Admin: admin / Passwort: admin</p>
        </div>
      </Card>
    </div>
  );
};

export default Index;
