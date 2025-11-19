"use client"

import { ContactCard } from "@/components/ui/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactCardDemo() {
  return (
    <main className="relative flex size-full min-h-screen w-full items-center justify-center p-4 bg-purple-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <ContactCard
          title="Get in touch"
          description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day."
          contactInfo={[
            {
              icon: MailIcon,
              label: 'Email',
              value: 'contact@21st.dev',
            },
            {
              icon: PhoneIcon,
              label: 'Phone',
              value: '+92 312 1234567',
            },
            {
              icon: MapPinIcon,
              label: 'Address',
              value: 'Faisalabad, Pakistan',
              className: 'col-span-2',
            }
          ]}
        >
          <form action="" className="w-full space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-name">Name</Label>
              <Input id="demo-name" type="text" placeholder="Your name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-email">Email</Label>
              <Input id="demo-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-phone">Phone</Label>
              <Input id="demo-phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-message">Message</Label>
              <Textarea id="demo-message" placeholder="Your message here..." />
            </div>
            <Button className="w-full" type="button">
              Submit
            </Button>
          </form>
        </ContactCard>
      </div>
    </main>
  );
}

