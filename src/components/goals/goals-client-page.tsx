'use client';

import { useState } from 'react';
import { Plus, Target, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
};

const defaultGoals: Goal[] = [
  { id: '1', name: 'Emergency fund', target: 15000, current: 9200, deadline: '2026-12-31' },
  { id: '2', name: 'Home down payment', target: 50000, current: 18500, deadline: '2028-06-30' },
];

export function GoalsClientPage() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') return defaultGoals;
    try {
      const saved = localStorage.getItem('fisight-goals');
      return saved ? JSON.parse(saved) : defaultGoals;
    } catch {
      return defaultGoals;
    }
  });
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const persist = (next: Goal[]) => {
    setGoals(next);
    localStorage.setItem('fisight-goals', JSON.stringify(next));
  };

  const addGoal = () => {
    if (!name.trim() || !target) return;
    persist([
      ...goals,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        target: Number(target),
        current: 0,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      },
    ]);
    setName('');
    setTarget('');
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        title="Financial Goals"
        description="Plan milestones and track progress toward your financial future."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Plus className="h-5 w-5" />
            Add a goal
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="goal-name">Goal name</Label>
            <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vacation fund" />
          </div>
          <div className="w-full space-y-2 sm:w-40">
            <Label htmlFor="goal-target">Target ($)</Label>
            <Input id="goal-target" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="5000" />
          </div>
          <Button onClick={addGoal} className="gap-2">
            <Target className="h-4 w-4" />
            Add
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <Card key={goal.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="font-headline">{goal.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Due {goal.deadline}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => persist(goals.filter((g) => g.id !== goal.id))}
                  aria-label="Delete goal"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>${goal.current.toLocaleString()} saved</span>
                  <span className="text-muted-foreground">${goal.target.toLocaleString()} target</span>
                </div>
                <Progress value={pct} />
                <p className="text-xs text-muted-foreground">{pct}% complete</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
