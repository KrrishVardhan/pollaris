import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Dynamically point to whatever host the frontend is on, always port 5000
const API_BASE =
import.meta.env.VITE_API_URL;

type Option = {
    id: string;
    optionText: string;
};

type Question = {
    id: string;
    questionText: string;
    isRequired: boolean;
    orderIndex: number;
    options: Option[];
};

type Poll = {
    id: string;
    title: string;
    description: string;
    isAnonymous: boolean;
    isPublished: boolean;
    expiresAt: string | null;
    createdAt: string;
    questions: Question[];
};

interface Props {
    pollId: string;
    onBack: () => void;
}

function PollSkeleton() {
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader><Skeleton className="h-5 w-64" /></CardHeader>
                        <CardContent className="space-y-2">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-4 w-40" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function PollPage({ pollId, onBack }: Props) {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchPoll() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/polls/${pollId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const result = await res.json();
                setPoll(result.data);
            } catch (err) {
                console.error("Poll fetch error:", err);
                toast.error("Failed to load poll.");
            } finally {
                setLoading(false);
            }
        }
        fetchPoll();
    }, [pollId]);

    async function copyPollLink() {

        const url =
            `${window.location.origin}/polls/${pollId}`;

        try {

            await navigator
                .clipboard
                .writeText(
                    url
                );

        } catch {

            const textArea =
                document.createElement(
                    "textarea"
                );

            textArea.value =
                url;

            document.body.appendChild(
                textArea
            );

            textArea.select();

            document.execCommand(
                "copy"
            );

            document.body.removeChild(
                textArea
            );

        }

        setCopied(true);

        toast.success(
            "Poll link copied!"
        );

        setTimeout(
            () => setCopied(false),
            2000
        );

    }

    function handleAnswer(questionId: string, optionId: string) {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }

    async function submitPoll() {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            // Payload matches what the backend expects
            const answers_payload = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
                questionId,
                selectedOptionId,
            }));

            const res = await fetch(`${API_BASE}/polls/${pollId}/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ answers: answers_payload }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Response submitted!");
                setSubmitted(true);
            } else {
                toast.error(data.message ?? "Submission failed. Please try again.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const allRequiredAnswered = poll?.questions
        .filter((q) => q.isRequired)
        .every((q) => answers[q.id]);

    if (loading) return <PollSkeleton />;

    if (!poll) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-4 text-center">
                <h2 className="text-2xl font-bold">Poll not found</h2>
                <p className="text-muted-foreground">This poll may have expired or doesn't exist.</p>
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft /> Go back
                </Button>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-4 text-center">
                <div className="text-5xl">🎉</div>
                <h2 className="text-2xl font-bold">Response submitted!</h2>
                <p className="text-muted-foreground">
                    Thanks for participating
                </p>
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft /> Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft /> Back
                </Button>
                <Button variant="outline" size="sm" onClick={copyPollLink}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy link"}
                </Button>
            </div>

            {/* Poll header */}
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h1 className="text-2xl font-bold">{poll.title}</h1>
                    <Badge variant={poll.isAnonymous ? "secondary" : "default"}>
                        {poll.isAnonymous ? "Anonymous" : "Identified"}
                    </Badge>
                </div>
                {poll.description && (
                    <p className="text-muted-foreground">{poll.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Created {new Date(poll.createdAt).toLocaleDateString()}
                </p>
                {poll.expiresAt && (
                    <p className="text-xs text-destructive">
                        Expires {new Date(poll.expiresAt).toLocaleDateString()}
                    </p>
                )}
            </div>

            <Separator />

            {/* Questions */}
            <div className="space-y-4">
                {poll.questions.map((q, qi) => (
                    <Card key={q.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="text-muted-foreground font-normal">Q{qi + 1}.</span>
                                {q.questionText}
                                {q.isRequired && <span className="text-destructive text-sm">*</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={answers[q.id] ?? ""}
                                onValueChange={(val) => handleAnswer(q.id, val)}
                                className="space-y-2"
                            >
                                {q.options.map((opt) => (
                                    <div key={opt.id} className="flex items-center gap-2">
                                        <RadioGroupItem value={opt.id} id={opt.id} />
                                        <Label htmlFor={opt.id} className="cursor-pointer">
                                            {opt.optionText}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button
                className="w-full"
                disabled={!allRequiredAnswered || submitting}
                onClick={submitPoll}
            >
                {submitting ? "Submitting..." : "Submit"}
            </Button>
        </div>
    );
}