import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, LogIn } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const session = await auth();

  // Check database connection
  let dbStatus = "unknown";
  let adminExists = false;
  let userCount = 0;
  try {
    userCount = await prisma.user.count();
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true, email: true, name: true, role: true },
    });
    adminExists = !!adminUser;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "error";
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 Admin Access Diagnostic</h1>
        <p className="text-muted-foreground">Use this page to diagnose why /admin is not loading</p>
      </div>

      <div className="space-y-6">
        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">1. Database Connection</CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus === "connected" ? (
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Database is connected and working</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Database connection failed</span>
              </div>
            )}
            {dbStatus === "connected" && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {userCount} user(s) in the database
              </p>
            )}
          </CardContent>
        </Card>

        {/* Admin User Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">2. Admin User in Database</CardTitle>
          </CardHeader>
          <CardContent>
            {adminExists ? (
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Admin user exists in database</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">No admin user found in database</span>
              </div>
            )}
            {!adminExists && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">You need to seed the database</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Run this command in your terminal:
                    </p>
                    <code className="block mt-2 p-2 bg-white dark:bg-gray-900 rounded text-sm font-mono">
                      npm run db:seed
                    </code>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">3. Your Login Session</CardTitle>
          </CardHeader>
          <CardContent>
            {session ? (
              <div>
                <div className="flex items-center gap-3 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">You are logged in</span>
                </div>
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{session.user?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{session.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <Badge variant={session.user?.role === "ADMIN" ? "success" : "secondary"}>
                      {session.user?.role || "No role assigned"}
                    </Badge>
                  </div>
                </div>

                {session.user?.role === "ADMIN" ? (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">✅ You have admin access!</p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          <Link href="/admin" className="underline font-medium">
                            Click here to go to /admin
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900 dark:text-red-100">❌ You're not logged in as admin</p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          Your role is <strong>"{session.user?.role || "USER"}"</strong>, but admin access requires <strong>"ADMIN"</strong> role.
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                          <strong>Login with admin credentials:</strong>
                        </p>
                        <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded text-sm font-mono space-y-1">
                          <p>Email: <span className="text-green-600">admin@trendycart.com</span></p>
                          <p>Password: <span className="text-green-600">admin123</span></p>
                        </div>
                        <Link href="/login?callbackUrl=/admin" className="mt-3 inline-block">
                          <Button>
                            <LogIn className="h-4 w-4 mr-2" />
                            Login as Admin
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">You are NOT logged in</span>
                </div>
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="font-medium text-red-900 dark:text-red-100">❌ Not authenticated</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    You need to login before accessing the admin panel.
                  </p>
                  <Link href="/login?callbackUrl=/admin" className="mt-3 inline-block">
                    <Button>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login as Admin
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/login?callbackUrl=/admin">
                <Button className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login as Admin (admin@trendycart.com)
                </Button>
              </Link>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium mb-2">If database needs seeding:</p>
                <code className="block p-2 bg-background rounded text-sm font-mono">
                  npm run db:seed
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
