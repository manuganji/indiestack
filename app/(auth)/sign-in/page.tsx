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
              <label htmlFor="username" className="text-sm">
                Username / Email
              </label>
              <Input id="username" placeholder="Username/Email" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
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
