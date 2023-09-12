"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SIGN_IN_PATH } from "@/constants";
import Link from "next/link";
import { signUpAction } from "../actions";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signUpSchema = z.object({
  email: z.string().email().nonempty(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export default function SignUp({ searchParams }: {
  searchParams: {
    email: string;
    firstName: string;
    lastName: string;
  }
}) {
  console.log(searchParams);
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: searchParams,
    mode: "onTouched",
    progressive: true,
  });

  return (
    <Card className="mx-auto mt-20">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          No password to remember.{" "}
          <Link
            className="text-gray-700 hover:text-gray-600 font-bold"
            href={SIGN_IN_PATH}
          >
            Sign In
          </Link>{" "}
          instead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            method="POST"
            className="gap-2 flex flex-col"
            onSubmit={form.handleSubmit((data) => {
              signUpAction(data);
            })}
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="someone@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex gap-2 text-xs">
        <span className="text-sm">By clicking Sign Up, you agree to our </span>
        <Link className=" text-xs underline" href="/privacy">
          Privacy Policy
        </Link>
        &amp;
        <Link className=" text-xs underline" href="/terms-conditions">
          Terms
        </Link>
      </CardFooter>
    </Card>
  );
}
