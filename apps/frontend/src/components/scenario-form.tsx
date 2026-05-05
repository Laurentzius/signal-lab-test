"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const scenarioFormSchema = z.object({
  type: z.enum(["success", "validation_error", "system_error", "slow_request", "teapot"]),
  name: z.string().trim().optional(),
});

type ScenarioFormData = z.infer<typeof scenarioFormSchema>;

interface ScenarioRunResponse {
  id: string;
  status: string;
}

const SCENARIO_TYPES = [
  { value: "success", label: "Success" },
  { value: "validation_error", label: "Validation Error" },
  { value: "system_error", label: "System Error" },
  { value: "slow_request", label: "Slow Request" },
  { value: "teapot", label: "Teapot (bonus)" },
];

export function ScenarioForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<ScenarioFormData>({
      defaultValues: { type: "success" },
      resolver: zodResolver(scenarioFormSchema),
    });

  const selectedType = watch("type");

  const mutation = useMutation({
    mutationFn: (data: ScenarioFormData) =>
      apiFetch<ScenarioRunResponse>("/api/scenarios/run", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      toast({
        title: "Scenario completed",
        description: `Run ${data.id} finished with status: ${data.status}`,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Scenario failed",
        description: error.message,
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="type">Scenario Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setValue("type", value as ScenarioFormData["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scenario type" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="e.g., test-run-1"
              {...register("name")}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              "Run Scenario"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
