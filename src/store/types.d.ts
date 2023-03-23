type Language = "cn" | "en";

interface Expample {
  name: string;
  title: { cn: string; en: string };
  description?: {
    cn: string;
    en: string;
  };
  url?: string;
}
