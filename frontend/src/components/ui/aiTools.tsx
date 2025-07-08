import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

interface AiToolsProps {
  editor: any; 
}

export function AiTools({ editor }: AiToolsProps) {
  
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(false);

  const getSelectedText = () => {
    if (!editor || !editor.isFocused) return ""; 
     
    const { from, to } = editor.view.state.selection;

    if (from === to) return ""; 

    return editor.state.doc.textBetween(from, to, "\n");
  };

  const replaceSelectedText = (newText: string) => {
    const { state } = editor;
    const { from, to } = state.selection;

    editor.commands.insertContentAt({ from, to }, newText);
  };

  async function handleAi(type: "paraphrase" | "grammar" | "shorten" | "extend" ) {
    if (!editor) return toast.error('editor is not ready yet')
    
    const text = getSelectedText();
    if (!text.trim()) {
      toast.error('Select some text to use the AI tools');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}/gemini`, { type, text });
      if (res.data?.result) {
        replaceSelectedText(res.data.result.trim());
        toast.success("Selected text has been edited");
      } else {
        toast.error("No response from AI");
      }
    } catch (err) {
      console.error(err);
      toast.error("Internal error");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="flex sm:flex-none flex-wrap gap-2 mb-3">
    <Button 
      type="button" 
      disabled={loading} 
      className="sm:flex-none flex-1 min-w-[120px]" 
      onClick={() => handleAi("paraphrase")}
    >
      Paraphrase
    </Button>
    <Button 
      type="button" 
      disabled={loading} 
      className="sm:flex-none flex-1 min-w-[120px]" 
      onClick={() => handleAi("grammar")}
    >
      Improve Grammar
    </Button>
    <Button 
      type="button" 
      disabled={loading} 
      className="sm:flex-none flex-1 min-w-[120px]" 
      onClick={() => handleAi("shorten")}
    >
      Shorten
    </Button>
    <Button 
      type="button" 
      disabled={loading} 
      className="sm:flex-none flex-1 min-w-[120px]" 
      onClick={() => handleAi("extend")}
    >
      Extend
    </Button>
  </div>
);

}
