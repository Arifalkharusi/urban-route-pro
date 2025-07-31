import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Plus, TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

const Dashboard = () => {
  const [todayEarnings] = useState(247.50);
  const [todayExpenses] = useState(45.20);
  const [weeklyTarget] = useState(1500);
  const [weeklyProgress] = useState(980);

  const progressPercentage = (weeklyProgress / weeklyTarget) * 100;
  const netIncome = todayEarnings - todayExpenses;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Good morning!</h1>
            <p className="opacity-90">Let's make today productive</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Summary */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Today's Performance</h2>
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/80 text-sm">Earnings</p>
              <p className="text-xl font-bold text-white">${todayEarnings.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm">Expenses</p>
              <p className="text-xl font-bold text-white">${todayExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm">Net</p>
              <p className="text-xl font-bold text-success">${netIncome.toFixed(2)}</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="h-14 bg-success hover:bg-success/90 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Earning
          </Button>
          <Button 
            variant="outline" 
            className="h-14 border-2 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </Button>
        </div>

        {/* Weekly Target Progress */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Weekly Target</h3>
              <Target className="w-5 h-5 text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">${weeklyProgress} / ${weeklyTarget}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {progressPercentage.toFixed(1)}% complete • ${weeklyTarget - weeklyProgress} to go
              </p>
            </div>
          </div>
        </GradientCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <GradientCard className="bg-gradient-secondary">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">This Week</span>
              </div>
              <p className="text-2xl font-bold">${weeklyProgress}</p>
              <p className="text-sm text-muted-foreground">+12% vs last week</p>
            </div>
          </GradientCard>

          <GradientCard className="bg-gradient-secondary">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <p className="text-2xl font-bold">$234</p>
              <p className="text-sm text-muted-foreground">-8% vs last week</p>
            </div>
          </GradientCard>
        </div>

        {/* Recent Activity */}
        <GradientCard>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            
            <div className="space-y-3">
              {[
                { type: "earning", amount: 25.50, description: "Airport trip", time: "2 hours ago" },
                { type: "expense", amount: 12.80, description: "Gas station", time: "4 hours ago" },
                { type: "earning", amount: 18.25, description: "City center", time: "5 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "earning" 
                        ? "bg-success/20 text-success" 
                        : "bg-warning/20 text-warning"
                    }`}>
                      {activity.type === "earning" ? "+" : "-"}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    activity.type === "earning" ? "text-success" : "text-warning"
                  }`}>
                    ${activity.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GradientCard>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default Dashboard;