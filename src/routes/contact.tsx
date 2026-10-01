import { Container } from "@/components/container";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export const ContactPage = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <div className="w-full pb-24">
      <Container className="py-16 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            Contact <span className="text-emerald-500">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a question or want to work with us? Reach out and we'll respond
            as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-emerald-100">
                <Mail className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-muted-foreground text-sm">chirag.2023ug1097@iiitranchi.ac.in</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-sky-100">
                <Phone className="text-sky-600 w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="text-muted-foreground text-sm">+91 73793 89425</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <MapPin className="text-purple-600 w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Address</p>
                <p className="text-muted-foreground text-sm">
                  123 AI Street, Tech City, 12345
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input required placeholder="First name" />
              <Input required placeholder="Last name" />
            </div>
            <Input required type="email" placeholder="Email address" />
            <Input required placeholder="Subject" />
            <Textarea required placeholder="Your message…" className="min-h-[120px]" />
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};
