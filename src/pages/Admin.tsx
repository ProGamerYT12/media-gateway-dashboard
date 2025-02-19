
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Settings, Trash } from "lucide-react";

interface UploadedItem {
  id: string;
  type: "image" | "video" | "note";
  content: string;
  username: string;
  timestamp: string;
}

const Admin = () => {
  const [uploads, setUploads] = useState<UploadedItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      window.location.href = "/";
      return;
    }
    
    const user = JSON.parse(userStr);
    if (!user.isAdmin) {
      window.location.href = "/dashboard";
      return;
    }
    
    setCurrentUser(user);
    
    const savedUploads = localStorage.getItem("uploads");
    if (savedUploads) {
      setUploads(JSON.parse(savedUploads));
    }
  }, []);

  const handleDeleteUpload = (id: string) => {
    const updatedUploads = uploads.filter((item) => item.id !== id);
    setUploads(updatedUploads);
    localStorage.setItem("uploads", JSON.stringify(updatedUploads));
    
    toast({
      title: "Element gelöscht",
      description: "Das Element wurde erfolgreich gelöscht.",
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && newPassword) {
      toast({
        title: "Passwort geändert",
        description: `Das Passwort für ${username} wurde geändert.`,
      });
      setUsername("");
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
            Zurück zum Dashboard
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Passwort ändern
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Neues Passwort"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit">Passwort ändern</Button>
          </form>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Alle Uploads</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploads.map((item) => (
              <Card key={item.id} className="p-4">
                {item.type === "image" && (
                  <img src={item.content} alt="Upload" className="w-full h-48 object-cover rounded" />
                )}
                {item.type === "video" && (
                  <video src={item.content} controls className="w-full h-48 object-cover rounded" />
                )}
                {item.type === "note" && (
                  <p className="text-gray-600">{item.content}</p>
                )}
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Von: {item.username}</p>
                    <p>{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteUpload(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
