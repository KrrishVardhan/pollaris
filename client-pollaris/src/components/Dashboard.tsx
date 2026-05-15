import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { CreatePoll } from "./CreatePoll";
import { PollPage } from "./PollPage";

type Poll = {
    id: string;
    title: string;
    description: string;
    isAnonymous: boolean;
    createdAt: string;
};

type DashboardData = {
    totalPolls: number;
    totalResponses: number;
    activePolls: number;
    polls: Poll[];
};

const stats = (data: DashboardData) => [
    { label: "Total Polls", value: data.totalPolls },
    { label: "Responses", value: data.totalResponses },
    { label: "Active Polls", value: data.activePolls },
];

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

function PollCard({ poll, onClick }: { poll: Poll; onClick: () => void }) {
    return (
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{poll.title}</CardTitle>
                    <Badge variant={poll.isAnonymous ? "secondary" : "default"}>
                        {poll.isAnonymous ? "Anonymous" : "Identified"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{poll.description}</p>
                <Separator />
                <p className="text-xs text-muted-foreground">
                    Created {new Date(poll.createdAt).toLocaleDateString()}
                </p>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
                        <CardContent><Skeleton className="h-8 w-12" /></CardContent>
                    </Card>
                ))}
            </div>
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2"><Skeleton className="h-5 w-48" /></CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

type View = "dashboard" | "create" | { pollId: string };

export function Dashboard({ logout }: { logout: () => void }) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<View>("dashboard");

    async function getDashboard() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://192.168.1.8:5000/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { getDashboard(); }, []);

    if (loading) return <DashboardSkeleton />;

    if (view === "create") {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <Button variant="ghost" onClick={() => setView("dashboard")}>
                    <ArrowLeft /> Back
                </Button>
                <CreatePoll onSuccess={() => { setView("dashboard"); getDashboard(); }} />
            </div>
        );
    }

    if (typeof view === "object" && "pollId" in view) {
        return <PollPage pollId={view.pollId} onBack={() => setView("dashboard")} />;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button variant="outline" onClick={logout}>Logout</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {data && stats(data).map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </div>

            {/* Polls */}
            <div className="space-y-4">
                {data?.polls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} onClick={() => setView({ pollId: poll.id })} />
                ))}
            </div>

            <Button onClick={() => setView("create")}>
                <PlusCircle /> Create Poll
            </Button>
        </div>
    );
}