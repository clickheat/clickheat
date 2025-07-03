
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface AddLinksStepProps {
  onNext: (links: Link[]) => void;
}

const AddLinksStep = ({ onNext }: AddLinksStepProps) => {
  const [links, setLinks] = useState<Link[]>([
    { id: "1", title: "", url: "" }
  ]);

  const addLink = () => {
    setLinks([...links, { 
      id: Date.now().toString(), 
      title: "", 
      url: "" 
    }]);
  };

  const removeLink = (id: string) => {
    if (links.length > 1) {
      setLinks(links.filter(link => link.id !== id));
    }
  };

  const updateLink = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const hasValidLinks = links.some(link => link.title && link.url);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Add Your First Links
        </h2>
        <p className="text-lg text-muted-foreground">
          Start with your most important links. You can always add more later.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {links.map((link, index) => (
          <Card key={link.id} className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg mt-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={`title-${link.id}`}>Link Title</Label>
                    <Input
                      id={`title-${link.id}`}
                      placeholder="e.g., My YouTube Channel"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`url-${link.id}`}>URL</Label>
                    <Input
                      id={`url-${link.id}`}
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    />
                  </div>
                </div>

                {links.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(link.id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addLink}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Link
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => onNext(links.filter(link => link.title && link.url))}
          disabled={!hasValidLinks}
          size="lg"
          className="px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default AddLinksStep;
