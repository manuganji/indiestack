"use client";
import { Fragment, useEffect, useState } from "react";
import { verifyToken } from "../../actions";
import { useRouter } from "next/navigation";
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

import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SIGN_IN_PATH } from "@/constants";

const formSchema = z.object({
  email: z.string().email().nonempty().default(""),
});

export default function VerifyEmail({
  params: { token },
  searchParams: { redirectUrl },
}: {
  params: { token: string };
  searchParams: { redirectUrl?: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{
    reconfirm?: boolean;
    success?: boolean;
    error?: string;
  }>({ reconfirm: false, success: false });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
    progressive: true,
  });

  useEffect(() => {
    verifyToken(token).then((res) => {
      console.log("res", res);
      setStatus(res);
      if ("error" in res) {
        form.setError("root", {
          message: res.error,
        });
      }
    });
  }, [token, form]);

  useEffect(() => {
    console.log("status", status);
    if (status?.success) {
      // @ts-ignore
      router.push(redirectUrl || "/");
    }
  }, [status?.success, redirectUrl, router]);

  async function onSubmit(data: { email: string }) {
    const res = await verifyToken(token, data.email);
    console.log("res", res);
    setStatus(res);
  }

  return (
    <Card className="mx-auto max-w-md my-20 p-4">
      <CardHeader>
        <CardTitle>Verify and Sign In</CardTitle>
        <CardDescription>
          {status.reconfirm &&
            `Looks like you've opened the link in a new browser. Please re-confirm
        your email address.`}
          {status.success &&
            `Thanks for signing up. We are excited to see what you'll build.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.reconfirm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="someone@example.com" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
            <FormMessage />
          </Form>
        )}
        {"error" in status && (
          <Fragment>
            <h2>{status.error}</h2>
            <br />
            <Button type="button">
              <Link href={SIGN_IN_PATH}>Sign In</Link>
            </Button>
          </Fragment>
        )}
        {status?.success && <h2>Success</h2>}
      </CardContent>
    </Card>
  );
}
