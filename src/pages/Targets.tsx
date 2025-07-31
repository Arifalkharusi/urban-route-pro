import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Target, Edit3, TrendingUp, Calendar, Clock } from "lucide-react";

interface TargetData {
  id: string;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  current: number;
  startDate: Date;
}

const Targets = () => {
  const [targets, setTargets] = useState<TargetData[]>([
    {
      id: "1",
      amount: 1500,
      period: "weekly",
      current: 980,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      amount: 250,
      period: "daily",
      current: 247.50,
      startDate: new Date()
    },
    {
      id: "3",
      amount: 6000,
      period: "monthly",
      current: 4250,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetData | null>(null);
  const [newTarget, setNewTarget] = useState({
    amount: "",
    period: "weekly" as "daily" | "weekly" | "monthly"
  });

  const handleSaveTarget = () => {
    if (!newTarget.amount) return;

    const targetData: TargetData = {
      id: editingTarget?.id || Date.now().toString(),
      amount: parseFloat(newTarget.amount),
      period: newTarget.period,
      current: editingTarget?.current || 0,
      startDate: editingTarget?.startDate || new Date()
    };

    if (editingTarget) {
      setTargets(targets.map(t => t.id === editingTarget.id ? targetData : t));
    } else {
      setTargets([...targets, targetData]);
    }

    setNewTarget({ amount: "", period: "weekly" });
    setEditingTarget(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (target?: TargetData) => {
    if (target) {
      setEditingTarget(target);
      setNewTarget({
        amount: target.amount.toString(),
        period: target.period
      });
    } else {
      setEditingTarget(null);
      setNewTarget({ amount: "", period: "weekly" });
    }
    setIsDialogOpen(true);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingTime = (period: string, startDate: Date) => {
    const now = new Date();
    let endDate: Date;

    switch (period) {
      case "daily":
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        break;
      case "weekly":
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "monthly":
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      default:
        return "Unknown";
    }

    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case "daily":
        return <Clock className="w-4 h-4" />;
      case "weekly":
        return <Calendar className="w-4 h-4" />;
      case "monthly":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Income Targets</h1>
            <p className="opacity-90">Set and track your goals</p>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={() => openEditDialog()}
          >
            <Target className="w-4 h-4 mr-2" />
            New Target
          </Button>
        </div>

        {/* Summary Card */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">Active Targets</p>
            <p className="text-2xl font-bold text-white">{targets.length}</p>
          </div>
        </GradientCard>
      </div>

      <div className="p-6 space-y-4">
        {targets.length === 0 ? (
          <GradientCard className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No targets set</h3>
            <p className="text-muted-foreground mb-4">Create your first income target to start tracking progress</p>
            <Button 
              className="bg-gradient-primary hover:opacity-90 rounded-xl"
              onClick={() => openEditDialog()}
            >
              <Target className="w-4 h-4 mr-2" />
              Set Your First Target
            </Button>
          </GradientCard>
        ) : (
          <div className="space-y-4">
            {targets.map((target) => {
              const progressPercentage = getProgressPercentage(target.current, target.amount);
              const isCompleted = progressPercentage >= 100;
              const remaining = target.amount - target.current;

              return (
                <GradientCard key={target.id} className="hover:shadow-soft transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? "bg-success/20 text-success" 
                            : "bg-primary/20 text-primary"
                        }`}>
                          {getPeriodIcon(target.period)}
                        </div>
                        <div>
                          <h3 className="font-semibold capitalize">{target.period} Target</h3>
                          <p className="text-sm text-muted-foreground">
                            {getRemainingTime(target.period, target.startDate)}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(target)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${target.current.toFixed(2)}</span>
                        <span className="text-muted-foreground">${target.amount.toFixed(2)}</span>
                      </div>
                      
                      <Progress 
                        value={progressPercentage} 
                        className="h-3"
                      />
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progressPercentage.toFixed(1)}% complete</span>
                        {!isCompleted && (
                          <span>${remaining.toFixed(2)} to go</span>
                        )}
                        {isCompleted && (
                          <span className="text-success font-medium">🎉 Target achieved!</span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    {target.period === "weekly" && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Daily Average</p>
                          <p className="font-semibold">${(target.current / 7).toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Needed Daily</p>
                          <p className="font-semibold">
                            ${remaining > 0 ? (remaining / Math.max(1, Math.ceil((new Date(target.startDate.getTime() + 7 * 24 * 60 * 60 * 1000).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))).toFixed(2) : "0.00"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </GradientCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTarget ? "Edit Target" : "Set New Target"}
            </DialogTitle>
            <DialogDescription>
              {editingTarget 
                ? "Update your income target"
                : "Set a new income goal to track your progress"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount ($)</Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTarget.amount}
                onChange={(e) => setNewTarget({...newTarget, amount: e.target.value})}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-period">Time Period</Label>
              <Select 
                value={newTarget.period} 
                onValueChange={(value: "daily" | "weekly" | "monthly") => 
                  setNewTarget({...newTarget, period: value})
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSaveTarget}
              className="w-full bg-gradient-primary hover:opacity-90 rounded-xl"
              disabled={!newTarget.amount}
            >
              {editingTarget ? "Update Target" : "Create Target"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
};

export default Targets;