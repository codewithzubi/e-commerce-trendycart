import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SetupChatbotPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖 Chatbot Setup Guide</h1>
        <p className="text-muted-foreground">Follow these 3 simple steps to enable the AI chatbot</p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <Card className="border-2 border-violet-300 dark:border-violet-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">1</span>
              Get Your Groq API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Groq offers a fast OpenAI-compatible API. Add your Groq key to enable the chatbot.</p>
            
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to: <a href="https://console.groq.com/keys" target="_blank" className="text-violet-600 underline inline-flex items-center gap-1">
                console.groq.com/keys <ExternalLink className="h-3 w-3" />
              </a></li>
              <li>Sign in or create a Groq account</li>
              <li>
                Click <strong>Create API key</strong>
              </li>
              <li>Copy the key (starts with <code className="bg-muted px-1 rounded">gsk_</code>)</li>
            </ol>

            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded text-amber-800 dark:text-amber-200 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Keep your API key private - never share it publicly</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="border-2 border-pink-300 dark:border-pink-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold">2</span>
              Add to .env File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Open your <code className="bg-muted px-1 rounded">.env</code> file and replace the placeholder:</p>
            
            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
              <p className="text-red-500 line-through">GROQ_API_KEY=&quot;gsk_your-groq-api-key-here&quot;</p>
              <p className="text-green-600">
                GROQ_API_KEY=&quot;<span className="text-violet-600">gsk_your-actual-key-here</span>&quot;
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              <strong>How to edit:</strong>
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Open <code className="bg-muted px-1 rounded">.env</code> in any text editor</li>
              <li>Find the line starting with <code className="bg-muted px-1 rounded">GROQ_API_KEY</code></li>
              <li>Replace the value with your actual API key</li>
              <li>Save the file</li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="border-2 border-green-300 dark:border-green-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">3</span>
              Restart Dev Server
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Stop the current dev server (Ctrl+C) and restart:</p>
            
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <p className="text-green-600">npm run dev</p>
            </div>

            <p className="text-sm text-muted-foreground">Then test the chatbot by clicking the chat icon in the bottom-right corner</p>
          </CardContent>
        </Card>

        {/* Verification */}
        <Card className="border-2 border-blue-300 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              Verify Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Check if your API key is properly configured:</p>
            <div className="flex gap-3">
              <a href="/api/chat/debug" target="_blank">
                <Button variant="outline">
                  Check API Status
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
              <Link href="/">
                <Button className="bg-gradient-to-r from-violet-600 to-pink-600">
                  Go to Home Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
