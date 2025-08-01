import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Activity, CalendarIcon, Filter } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const Dashboard = () => {
  const [todayEarnings] = useState(247.50);
  const [todayExpenses] = useState(45.20);
  const [weeklyTarget] = useState(1500);
  const [weeklyProgress] = useState(980);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  });

  const progressPercentage = (weeklyProgress / weeklyTarget) * 100;
  const netIncome = todayEarnings - todayExpenses;

  // Chart data
  const weeklyData = [
    { day: 'Mon', earnings: 180, expenses: 45 },
    { day: 'Tue', earnings: 220, expenses: 38 },
    { day: 'Wed', earnings: 290, expenses: 52 },
    { day: 'Thu', earnings: 170, expenses: 28 },
    { day: 'Fri', earnings: 248, expenses: 45 },
    { day: 'Sat', earnings: 165, expenses: 31 },
    { day: 'Sun', earnings: 195, expenses: 42 }
  ];

  const dailyHoursData = [
    { hour: '6-8', earnings: 45 },
    { hour: '8-10', earnings: 62 },
    { hour: '10-12', earnings: 38 },
    { hour: '12-14', earnings: 55 },
    { hour: '14-16', earnings: 72 },
    { hour: '16-18', earnings: 85 },
    { hour: '18-20', earnings: 68 },
    { hour: '20-22', earnings: 42 }
  ];

  const expenseBreakdown = [
    { name: 'Fuel', value: 156, color: '#8B5CF6' },
    { name: 'Maintenance', value: 45, color: '#EC4899' },
    { name: 'Insurance', value: 33, color: '#10B981' },
    { name: 'Other', value: 20, color: '#F59E0B' }
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="opacity-90">Track your performance insights</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Summary */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Today's Summary</h2>
              <p className="text-white/70 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <span className="text-white/80 text-sm font-medium">Net Income</span>
              </div>
              <p className="text-2xl font-bold text-white">${netIncome.toFixed(2)}</p>
              <p className="text-success text-xs">+12% vs yesterday</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">Trips</span>
              </div>
              <p className="text-2xl font-bold text-white">14</p>
              <p className="text-white/60 text-xs">8.5 hours active</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Earnings</p>
              <p className="text-lg font-semibold text-white">${todayEarnings.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Per Trip</p>
              <p className="text-lg font-semibold text-white">${(todayEarnings / 14).toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Distance</p>
              <p className="text-lg font-semibold text-white">127 mi</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Date Filter */}
        <GradientCard>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Filter by Date Range</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </GradientCard>
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

        {/* Weekly Earnings vs Expenses Chart */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Weekly Overview</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px -2px rgba(139, 92, 246, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EC4899"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GradientCard>

        {/* Daily Hours Performance */}
        <GradientCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Peak Hours Today</h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyHoursData}>
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px -2px rgba(139, 92, 246, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="earnings" 
                    fill="#8B5CF6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GradientCard>

        {/* Stats Cards and Expense Breakdown */}
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

        {/* Expense Breakdown Chart */}
        <GradientCard>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Expense Breakdown</h3>
            
            <div className="flex items-center">
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex-1 ml-4 space-y-2">
                {expenseBreakdown.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">${item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GradientCard>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default Dashboard;