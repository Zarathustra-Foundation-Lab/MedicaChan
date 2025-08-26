"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegistrationDataStore } from "../hooks/use-registration-data";
import NavButton from "./nav-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
});

export function FormMedicalHistory({
  currentStep,
  prevStep,
  nextStep,
}: {
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
}) {
  const { data, updateData } = useRegistrationDataStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allergies: data.allergies,
      chronicDiseases: data.chronicDiseases,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateData({
      allergies: values.allergies,
      chronicDiseases: values.chronicDiseases,
    });
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Allergies
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any allergies you have (e.g., Peanuts, Shellfish, Pollen)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chronicDiseases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Chronic Diseases
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any chronic conditions you have (e.g., Diabetes, Hypertension, Asthma)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Alert variant="warning">
          <Lock />
          <AlertDescription className="font-semibold">
            Your medical information is private by default and only shared if
            you choose to publish it.
          </AlertDescription>
        </Alert>
        <NavButton currentStep={currentStep} prevStep={prevStep} />
      </form>
    </Form>
  );
}
