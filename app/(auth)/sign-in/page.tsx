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
import { SIGN_UP_PATH } from "@/constants";
import Link from "next/link";

export default async function SignIn({}: {}) {
  return (
    <Card className="mx-auto mt-20">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          No password to remember.
          <Link
            className="text-gray-700 hover:text-gray-600 font-bold"
            href={SIGN_UP_PATH}
          >
            Sign Up
          </Link>{" "}
          instead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <Input id="email" placeholder="Email" type="email" />
              <Button type="submit" variant="default">
                Get a magic link
              </Button>
            </div>
            <label htmlFor="username" className="text-sm">
              Username
            </label>
            <Input type="username" />
            <Button type="submit" variant="default">
              Apple ID
            </Button>
            <Button type="submit" variant="default">
              Google ID
            </Button>
            <Button type="submit" variant="default">
              Microsoft ID
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2 text-xs">
        <span className="text-sm">By clicking Sign In, you agree to our </span>
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
