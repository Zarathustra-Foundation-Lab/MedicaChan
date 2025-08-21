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
import { Input } from "@/components/ui/input";
import { useRegistrationDataStore } from "../hooks/use-registration-data";
import NavButton from "./nav-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

const formSchema = z.object({
  height: z.string().min(1, {
    message: "Height is required",
  }),
  weight: z.string().min(1, {
    message: "Weight is required",
  }),
});

export function FormPhysicalInfo({
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
      height: data.height,
      weight: data.weight,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateData({
      height: values.height,
      weight: values.weight,
    });
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="175" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Alert variant="warning">
          <CircleAlert />
          <AlertDescription className="font-semibold">
            This information helps provide personalized health insights and
            recommendations.
          </AlertDescription>
        </Alert>
        <NavButton currentStep={currentStep} prevStep={prevStep} />
      </form>
    </Form>
  );
}
