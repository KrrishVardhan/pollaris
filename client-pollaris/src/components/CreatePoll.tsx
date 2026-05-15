import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, X } from "lucide-react";
const API_BASE =
import.meta.env.VITE_API_URL;

interface Option {
    optionText: string;
}

interface Question {
    questionText: string;
    isRequired: boolean;
    orderIndex: number;
    options: Option[];
}

interface Props {
    onSuccess: () => void;
}

function newQuestion(orderIndex: number): Question {
    return { questionText: "", isRequired: true, orderIndex, options: [{ optionText: "" }, { optionText: "" }] };
}

export function CreatePoll({ onSuccess }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([newQuestion(1)]);

    // --- Question helpers ---
    function addQuestion() {
        setQuestions((prev) => [...prev, newQuestion(prev.length + 1)]);
    }

    function removeQuestion(qi: number) {
        setQuestions((prev) =>
            prev.filter((_, i) => i !== qi).map((q, i) => ({ ...q, orderIndex: i + 1 }))
        );
    }

    function updateQuestion(qi: number, text: string) {
        setQuestions((prev) => prev.map((q, i) => i === qi ? { ...q, questionText: text } : q));
    }

    function toggleRequired(qi: number) {
        setQuestions((prev) => prev.map((q, i) => i === qi ? { ...q, isRequired: !q.isRequired } : q));
    }

    // --- Option helpers ---
    function addOption(qi: number) {
        setQuestions((prev) => prev.map((q, i) =>
            i === qi ? { ...q, options: [...q.options, { optionText: "" }] } : q
        ));
    }

    function removeOption(qi: number, oi: number) {
        setQuestions((prev) => prev.map((q, i) =>
            i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q
        ));
    }

    function updateOption(qi: number, oi: number, text: string) {
        setQuestions((prev) => prev.map((q, i) =>
            i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? { optionText: text } : o) } : q
        ));
    }

    // --- Submit ---
    async function createPoll() {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/polls/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, isAnonymous, questions }),
        });
        const data = await res.json();
        if (res.ok) {
            onSuccess();
        } else {
            console.error("Failed to create poll:", data);
        }
    }

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Create Poll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Poll details */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="What's this poll about?" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Add some context..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="anonymous">Anonymous responses</Label>
                        <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    </div>
                </div>

                <Separator />

                {/* Questions */}
                <div className="space-y-4">
                    <Label>Questions</Label>
                    {questions.map((q, qi) => (
                        <Card key={qi}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground font-medium w-6">Q{qi + 1}</span>
                                    <Input
                                        placeholder="e.g. What is your favourite framework?"
                                        value={q.questionText}
                                        onChange={(e) => updateQuestion(qi, e.target.value)}
                                        className="flex-1"
                                    />
                                    {questions.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeQuestion(qi)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {/* Options */}
                                {q.options.map((opt, oi) => (
                                    <div key={oi} className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground w-4">{oi + 1}.</span>
                                        <Input
                                            placeholder={`Option ${oi + 1}`}
                                            value={opt.optionText}
                                            onChange={(e) => updateOption(qi, oi, e.target.value)}
                                            className="flex-1"
                                        />
                                        {q.options.length > 2 && (
                                            <Button variant="ghost" size="icon" onClick={() => removeOption(qi, oi)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center justify-between pt-1">
                                    <Button variant="ghost" size="sm" onClick={() => addOption(qi)}>
                                        <PlusCircle className="w-4 h-4" /> Add option
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor={`required-${qi}`} className="text-xs text-muted-foreground">Required</Label>
                                        <Switch id={`required-${qi}`} checked={q.isRequired} onCheckedChange={() => toggleRequired(qi)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button variant="outline" className="w-full" onClick={addQuestion}>
                        <PlusCircle /> Add Question
                    </Button>
                </div>

                <Button className="w-full" onClick={createPoll}>
                    Create Poll
                </Button>

            </CardContent>
        </Card>
    );
}