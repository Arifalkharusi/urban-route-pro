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
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Income Targets</h1>
            <p className="opacity-90 text-sm sm:text-base mt-1">Set and track your earning goals</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Today's Overview */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white">Target Overview</h2>
            <Button 
              size="sm" 
              variant="ghost"
              className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 px-2 sm:px-3 text-xs sm:text-sm"
              onClick={() => openEditDialog()}
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              New
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Active</p>
              <p className="text-lg sm:text-xl font-bold text-white">{targets.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Completed</p>
              <p className="text-lg sm:text-xl font-bold text-success">
                {targets.filter(t => getProgressPercentage(t.current, t.amount) >= 100).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">In Progress</p>
              <p className="text-lg sm:text-xl font-bold text-warning">
                {targets.filter(t => getProgressPercentage(t.current, t.amount) < 100).length}
              </p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
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
          <div className="space-y-3 sm:space-y-4">
            {targets.map((target) => {
              const progressPercentage = getProgressPercentage(target.current, target.amount);
              const isCompleted = progressPercentage >= 100;
              const remaining = target.amount - target.current;

              return (
                <GradientCard key={target.id} className="hover:shadow-elegant transition-all duration-300 animate-fade-in">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? "bg-gradient-to-br from-success to-success/80 text-white" 
                            : "bg-gradient-to-br from-primary to-primary/80 text-white"
                        }`}>
                          {getPeriodIcon(target.period)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg capitalize truncate">{target.period} Goal</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {getRemainingTime(target.period, target.startDate)}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(target)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted/50 rounded-xl flex-shrink-0"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Amount Display */}
                    <div className="flex items-end justify-between mb-2 sm:mb-3">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Current Progress</p>
                        <p className="text-2xl sm:text-3xl font-bold text-foreground">${target.current.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-muted-foreground">Target</p>
                        <p className="text-lg sm:text-xl font-semibold text-muted-foreground">${target.amount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 sm:space-y-3">
                      <Progress 
                        value={progressPercentage} 
                        className="h-3 sm:h-4 bg-muted/30"
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-primary'}`} />
                          <span className="text-xs sm:text-sm font-medium">{progressPercentage.toFixed(1)}% complete</span>
                        </div>
                        {!isCompleted && (
                          <span className="text-xs sm:text-sm text-muted-foreground">${remaining.toFixed(2)} remaining</span>
                        )}
                        {isCompleted && (
                          <span className="text-xs sm:text-sm text-success font-medium flex items-center gap-1">
                            🎉 Achieved!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border/50">
                      {target.period === "daily" && (
                        <>
                          <div className="bg-muted/30 rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-xs text-muted-foreground">Today's Rate</p>
                            <p className="font-bold text-sm sm:text-lg">${(target.current).toFixed(2)}/day</p>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-xs text-muted-foreground">Completion</p>
                            <p className="font-bold text-sm sm:text-lg">{progressPercentage.toFixed(0)}%</p>
                          </div>
                        </>
                      )}
                      
                      {target.period === "weekly" && (
                        <>
                          <div className="bg-muted/30 rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-xs text-muted-foreground">Daily Average</p>
                            <p className="font-bold text-sm sm:text-lg">${(target.current / 7).toFixed(2)}</p>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-xs text-muted-foreground">Daily Needed</p>
                            <p className="font-bold text-sm sm:text-lg">
                              ${remaining > 0 ? (remaining / Math.max(1, Math.ceil((new Date(target.startDate.getTime() + 7 * 24 * 60 * 60 * 1000).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))).toFixed(2) : "0.00"}
                            </p>
                          </div>
                        </>
                      )}
                      
                      {target.period === "monthly" && (
                        <>
                          <div className="bg-muted/30 rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-xs text-muted-foreground">Weekly Average</p>
                            <p className="font-bold text-sm sm:text-lg">${(target.current / 4).toFixed(2)}</p>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-xs text-muted-foreground">Daily Average</p>
                            <p className="font-bold text-sm sm:text-lg">${(target.current / 30).toFixed(2)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </GradientCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 rounded-2xl w-[calc(100vw-2rem)] sm:w-full max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {editingTarget ? "Edit Target" : "Set New Target"}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {editingTarget 
                ? "Update your income target"
                : "Set a new income goal to track your progress"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="target-amount" className="text-sm font-medium">Target Amount ($)</Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTarget.amount}
                onChange={(e) => setNewTarget({...newTarget, amount: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="target-period" className="text-sm font-medium">Time Period</Label>
              <Select 
                value={newTarget.period} 
                onValueChange={(value: "daily" | "weekly" | "monthly") => 
                  setNewTarget({...newTarget, period: value})
                }
              >
                <SelectTrigger className="rounded-xl h-12 text-base">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="daily" className="text-base py-3">Daily</SelectItem>
                  <SelectItem value="weekly" className="text-base py-3">Weekly</SelectItem>
                  <SelectItem value="monthly" className="text-base py-3">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSaveTarget}
              className="w-full bg-gradient-primary hover:opacity-90 rounded-xl h-12 text-base font-medium mt-6"
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