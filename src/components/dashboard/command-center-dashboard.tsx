'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';
import type { UserProfile } from '@/lib/user-profile';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  PieChart,
  BarChart3,
  Activity,
  Target,
  Grip,
  Plus,
  Settings,
  Maximize2
} from 'lucide-react';
import { WelcomeBanner } from '@/components/shared/welcome-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'list' | 'progress';
  size: 'small' | 'medium' | 'large';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  content: React.ReactNode;
}

function buildWidgets(profile: UserProfile): Widget[] {
  const snap = getFinancialSnapshot(profile);
  const monthlyRemaining = Math.max(0, snap.monthlyIncome - snap.monthlyExpenses);
  const emergencyTarget = profile.monthlyExpenses * 6;
  const emergencyPct = emergencyTarget > 0
    ? Math.min(100, Math.round((snap.totalAssets / emergencyTarget) * 100))
    : 0;
  const debtPaydownPct = snap.totalDebt > 0
    ? Math.min(100, Math.round((snap.totalAssets / (snap.totalAssets + snap.totalDebt)) * 100))
    : 0;

  return [
  {
    id: 'net-worth',
    title: 'Net Worth',
    type: 'metric',
    size: 'large',
    icon: DollarSign,
    color: 'text-green-600',
    content: (
      <div className="space-y-4">
        <div className="text-3xl font-bold text-green-600">${snap.netWorth.toLocaleString()}</div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-green-600">Savings rate {snap.savingsRate}%</span>
        </div>
        <div className="flex h-20 items-end justify-between gap-1 rounded-lg bg-muted/40 p-3">
          {snap.assetItems.length === 0 ? (
            <p className="w-full text-center text-xs text-muted-foreground">No assets entered</p>
          ) : (
            snap.assetItems.map((item, i) => {
              const max = Math.max(...snap.assetItems.map((a) => a.amount), 1);
              return (
                <div
                  key={i}
                  className="min-w-[8px] flex-1 rounded-sm bg-green-500"
                  style={{ height: `${Math.max(8, (item.amount / max) * 100)}%` }}
                  title={`${item.name}: $${item.amount.toLocaleString()}`}
                />
              );
            })
          )}
        </div>
      </div>
    ),
  },
  {
    id: 'monthly-spending',
    title: 'Monthly Spending',
    type: 'chart',
    size: 'medium',
    icon: CreditCard,
    color: 'text-blue-600',
    content: (
      <div className="space-y-4">
        <div className="text-2xl font-bold text-blue-600">${profile.monthlyExpenses.toLocaleString()}</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly income</span>
            <span>${Math.round(snap.monthlyIncome).toLocaleString()}</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, snap.monthlyIncome > 0 ? (profile.monthlyExpenses / snap.monthlyIncome) * 100 : 0)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining</span>
            <span>${monthlyRemaining.toLocaleString()}</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${snap.monthlyIncome > 0 ? (monthlyRemaining / snap.monthlyIncome) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'investments',
    title: 'Investment Portfolio',
    type: 'chart',
    size: 'medium',
    icon: BarChart3,
    color: 'text-purple-600',
    content: (
      <div className="space-y-4">
        <div className="text-2xl font-bold text-purple-600">${snap.totalAssets.toLocaleString()}</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Assets</div>
            <div className="text-lg font-semibold">${snap.totalAssets.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Debt</div>
            <div className="text-lg font-semibold">${snap.totalDebt.toLocaleString()}</div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-purple-500 rounded-lg"
            style={{ width: `${snap.totalAssets + snap.totalDebt > 0 ? (snap.totalAssets / (snap.totalAssets + snap.totalDebt)) * 100 : 50}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    id: 'goals',
    title: 'Financial Goals',
    type: 'progress',
    size: 'small',
    icon: Target,
    color: 'text-orange-600',
    content: (
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Emergency fund (6 mo)</span>
            <span>{emergencyPct}%</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${emergencyPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Asset vs debt</span>
            <span>{debtPaydownPct}%</span>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${debtPaydownPct}%` }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'recent-transactions',
    title: 'Recent Transactions',
    type: 'list',
    size: 'medium',
    icon: Activity,
    color: 'text-slate-600',
    content: (
      <div className="space-y-3">
        {[...snap.assetItems, ...snap.liabilityItems.map((l) => ({ name: l.name, amount: -l.amount }))]
          .slice(0, 4)
          .map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">From profile</div>
            </div>
            <div className={cn(
              "text-sm font-semibold",
              item.amount >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {item.amount >= 0 ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
            </div>
          </div>
        ))}
        {snap.assetItems.length === 0 && snap.liabilityItems.length === 0 && (
          <p className="text-xs text-muted-foreground">Add assets in Profile to populate this list.</p>
        )}
      </div>
    ),
  },
  {
    id: 'budget-overview',
    title: 'Budget Overview',
    type: 'chart',
    size: 'small',
    icon: PieChart,
    color: 'text-indigo-600',
    content: (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-lg font-bold text-indigo-600">${monthlyRemaining.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Remaining this month</div>
        </div>
        <div className="w-16 h-16 mx-auto relative">
          <div className="w-full h-full rounded-full bg-indigo-100">
            <div className="w-full h-full rounded-full bg-indigo-500 transform rotate-45" 
                 style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)' }} />
          </div>
        </div>
      </div>
    ),
  },
];
}

export function CommandCenterDashboard() {
  const { profile } = useProfile();
  const [widgets, setWidgets] = useState(() => buildWidgets(profile));

  useEffect(() => {
    setWidgets((prev) => {
      const rebuilt = buildWidgets(profile);
      const order = prev.map((w) => w.id);
      return order.map((id) => rebuilt.find((w) => w.id === id) ?? rebuilt[0]).filter(Boolean) as Widget[];
    });
  }, [profile]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const order = Array.from(widgetOrder);
    const [reorderedItem] = order.splice(result.source.index, 1);
    order.splice(result.destination.index, 0, reorderedItem);
    setWidgetOrder(order);
  };

  const getGridCols = (size: string) => {
    switch (size) {
      case 'small': return 'md:col-span-1';
      case 'medium': return 'md:col-span-2';
      case 'large': return 'md:col-span-3';
      default: return 'md:col-span-1';
    }
  };

  return (
    <div className="space-y-6" data-tour="dashboard">
      {/* Welcome Banner for New Users */}
      <WelcomeBanner />

      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Financial Command Center
          </h1>
          <p className="text-muted-foreground">
            Drag and drop widgets to customize your dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isCustomizing ? "Done" : "Customize"}
          </Button>
          
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Widget Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-fr"
            >
              {widgets.map((widget, index) => (
                <Draggable 
                  key={widget.id} 
                  draggableId={widget.id} 
                  index={index}
                  isDragDisabled={!isCustomizing}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "group relative",
                        getGridCols(widget.size),
                        snapshot.isDragging && "z-50 rotate-3 scale-105"
                      )}
                    >
                      <Card className={cn(
                        "h-full transition-all duration-200",
                        isCustomizing && "ring-2 ring-primary/20",
                        snapshot.isDragging && "shadow-2xl ring-2 ring-primary/50"
                      )}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <widget.icon className={cn("w-5 h-5", widget.color)} />
                              <CardTitle className="text-base">{widget.title}</CardTitle>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {isCustomizing && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing"
                                >
                                  <Grip className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          {widget.content}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '$156,890', change: '+5.2%', positive: true },
          { label: 'Monthly Income', value: '$7,200', change: '+2.1%', positive: true },
          { label: 'Monthly Expenses', value: '$4,650', change: '-1.8%', positive: true },
          { label: 'Savings Rate', value: '35.4%', change: '+0.9%', positive: true },
        ].map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className={cn(
                "text-xs flex items-center gap-1",
                stat.positive ? "text-green-600" : "text-red-600"
              )}>
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
