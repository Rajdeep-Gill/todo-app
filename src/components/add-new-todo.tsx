import { useContext, useState } from "react";
import { ToDoContext } from "@/App";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toast } from "./ui/toast";
import { toast } from "@/hooks/use-toast";
import { createId } from "@paralleldrive/cuid2";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title should be at least 3 characters long",
  }).max(24, {
    message: "Title should be at most 24 characters long",
  }),
  color: z.string().min(1, {
    message: "Please select a color",
  })
});

export const AddNewTodo = () => {
  const { setTodos } = useContext(ToDoContext);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      color: "",
    }
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setTodos((previous) => [
      ...previous,
      {
        title: data.title,
        color: data.color,
        id: createId(),
      },
    ]);
    setOpen(false);
    const description = `Created a new todo tracker: ${data.title} with color ${data.color}`;
    toast({
      title: "Added new todo",
      description,
    });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Todo Tracker</DialogTitle>
          <DialogDescription>
            Pick a title and color for your new todo tracker.
          </DialogDescription>
        </DialogHeader>
          <div className="flex flex-col ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormDescription>
                        The title of the todo tracker
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            {["red", "blue", "green", "yellow"].map(
                              (color) => (
                                <SelectItem key={color} value={color}>
                                  {color[0].toUpperCase() + color.slice(1)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The color of the todo tracker
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  variant="default"
                >
                  Add Todo
                </Button>
              </form>
            </Form>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export function DialogDemo() {}
