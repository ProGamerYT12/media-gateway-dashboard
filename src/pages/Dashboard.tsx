
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Upload, Image, Video, List } from "lucide-react";

interface UploadedItem {
  id: string;
  type: "image" | "video" | "note";
  content: string;
  username: string;
  timestamp: string;
}

const Dashboard = () => {
  const [note, setNote] = useState("");
  const [uploads, setUploads] = useState<UploadedItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      window.location.href = "/";
      return;
    }
    setCurrentUser(JSON.parse(userStr));

    const savedUploads = localStorage.getItem("uploads");
    if (savedUploads) {
      setUploads(JSON.parse(savedUploads));
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newUpload: UploadedItem = {
          id: Date.now().toString(),
          type,
          content: event.target?.result as string,
          username: currentUser.username,
          timestamp: new Date().toISOString(),
        };
        
        const updatedUploads = [...uploads, newUpload];
        setUploads(updatedUploads);
        localStorage.setItem("uploads", JSON.stringify(updatedUploads));
        
        toast({
          title: "Erfolgreich hochgeladen",
          description: `${type === "image" ? "Bild" : "Video"} wurde hochgeladen.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      const newNote: UploadedItem = {
        id: Date.now().toString(),
        type: "note",
        content: note,
        username: currentUser.username,
        timestamp: new Date().toISOString(),
      };
      
      const updatedUploads = [...uploads, newNote];
      setUploads(updatedUploads);
      localStorage.setItem("uploads", JSON.stringify(updatedUploads));
      setNote("");
      
      toast({
        title: "Notiz gespeichert",
        description: "Ihre Notiz wurde erfolgreich gespeichert.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            {currentUser?.isAdmin && (
              <Button variant="outline" onClick={() => window.location.href = "/admin"}>
                Admin Dashboard
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Abmelden
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-4 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Image className="h-5 w-5" />
              Bild hochladen
            </h2>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image")}
            />
          </Card>

          <Card className="p-4 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video hochladen
            </h2>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, "video")}
            />
          </Card>

          <Card className="p-4 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <List className="h-5 w-5" />
              Notiz erstellen
            </h2>
            <form onSubmit={handleNoteSubmit}>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ihre Notiz..."
                className="mb-2"
              />
              <Button type="submit" className="w-full">
                Speichern
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ihre Uploads</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploads
              .filter((item) => item.username === currentUser?.username)
              .map((item) => (
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
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
