import { useState } from "react";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";

interface GenTitleProps {
  content: string;
  setTitle: (title: string) => void;
}

export default function GenTitle({ content, setTitle }: GenTitleProps) {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const buttonHandler = async () => {
    if (content.trim() === "" || content.trim() === "<p></p>") {
      toast.error("Write some content before generating a title.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiBaseUrl}/gemini`, {
        type: "title",
        text: content,
      });

      if (!res.data?.result) {
        console.error("AI did not respond properly");
        toast.error("AI did not respond");
        return;
      }

      setTitle(res.data.result.trim());
      toast.success("Title has been generated");
    } catch (err) {
      console.error(err);
      toast.error("Internal error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" disabled={loading} onClick={buttonHandler}>
      {loading ? "Generating..." : "Generate"}
    </Button>
  );
}
