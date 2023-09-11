// "use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SIGN_IN_PATH } from "@/constants";
import Link from "next/link";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";

export default function SignUp({}: {}) {
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
        {/* <Form>
          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" />
                </FormControl>
                <FormDescription>
                  Email to receive the magic link
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Get a Magic Link</Button>
        </Form> */}
        <form action={""} className="gap-2 flex flex-col">
          <div className="flex flex-col gap-2">
            <label>First Name</label>
            <Input type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <label>Last Name</label>
            <Input type="text" />
          </div>
          <p>Get a magic link to your email</p>
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <Input type="email" />
            <Button type="submit" variant="default">Get a Magic Link</Button>
          </div>
          <div className="flex flex-col gap-2">
            <label>Username</label>
            <Input type="username" />
            <Button type="submit" variant="default">Apple ID</Button>
            <Button type="submit" variant="default">Google ID</Button>
            <Button type="submit" variant="default">Microsoft ID</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>

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
