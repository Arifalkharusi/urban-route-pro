import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Plus, Fuel, Wrench, Receipt, Car, Calculator, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: "manual" | "mileage";
  miles?: number;
  costPerMile?: number;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      amount: 45.20,
      category: "Fuel",
      description: "Gas station fill-up",
      date: new Date(),
      type: "manual"
    },
    {
      id: "2",
      amount: 24.50,
      category: "Mileage",
      description: "Business miles",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "mileage",
      miles: 45,
      costPerMile: 0.545
    }
  ]);

  const [customCategories, setCustomCategories] = useState<string[]>(["Parking", "Tolls"]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenseType, setExpenseType] = useState<"manual" | "mileage">("manual");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    customCategory: "",
    description: "",
    miles: "",
    costPerMile: "0.545" // Standard IRS rate
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const defaultCategories = ["Fuel", "Maintenance", "Insurance", "Other"];
  const allCategories = [...defaultCategories, ...customCategories];

  // Filter expenses by date range
  const filteredExpenses = expenses.filter(expense => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const expenseDate = new Date(expense.date);
    return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
  });

  const totalToday = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = () => {
    if (expenseType === "manual" && newExpense.amount && newExpense.category) {
      let selectedCategory = newExpense.category;
      
      // Handle custom category
      if (newExpense.category === "custom" && newExpense.customCategory) {
        selectedCategory = newExpense.customCategory;
        if (!customCategories.includes(newExpense.customCategory)) {
          setCustomCategories([...customCategories, newExpense.customCategory]);
        }
      }

      const expense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(newExpense.amount),
        category: selectedCategory,
        description: newExpense.description || "Manual expense",
        date: selectedDate,
        type: "manual"
      };
      setExpenses([expense, ...expenses]);
    } else if (expenseType === "mileage" && newExpense.miles && newExpense.costPerMile) {
      const calculatedAmount = parseFloat(newExpense.miles) * parseFloat(newExpense.costPerMile);
      const expense: Expense = {
        id: Date.now().toString(),
        amount: calculatedAmount,
        category: "Mileage",
        description: newExpense.description || "Business mileage",
        date: selectedDate,
        type: "mileage",
        miles: parseFloat(newExpense.miles),
        costPerMile: parseFloat(newExpense.costPerMile)
      };
      setExpenses([expense, ...expenses]);
    }
    
    setNewExpense({ 
      amount: "", 
      category: "", 
      customCategory: "",
      description: "", 
      miles: "", 
      costPerMile: "0.545" 
    });
    setSelectedDate(new Date());
    setIsDialogOpen(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fuel":
        return <Fuel className="w-4 h-4" />;
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "mileage":
        return <Car className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Expenses</h1>
            <p className="opacity-90 text-sm sm:text-base mt-1">Track your business expenses</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Expense Overview */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white">Expense Overview</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Record a business expense or calculate mileage
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={expenseType} onValueChange={(value) => setExpenseType(value as "manual" | "mileage")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="mileage">Mileage</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg">
                          {allCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                          <SelectItem value="custom">Add Custom Category</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newExpense.category === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor="customCategory">Custom Category Name</Label>
                        <Input
                          id="customCategory"
                          value={newExpense.customCategory}
                          onChange={(e) => setNewExpense({...newExpense, customCategory: e.target.value})}
                          placeholder="e.g., Car Wash, Phone Bill"
                          className="rounded-xl"
                        />
                      </div>
                    )}

                     <div className="space-y-2">
                       <Label htmlFor="date">Date</Label>
                       <Popover>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             className={cn(
                               "w-full justify-start text-left font-normal rounded-xl",
                               !selectedDate && "text-muted-foreground"
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                             mode="single"
                             selected={selectedDate}
                             onSelect={(date) => date && setSelectedDate(date)}
                             initialFocus
                             className="p-3 pointer-events-auto"
                           />
                         </PopoverContent>
                       </Popover>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="description">Description</Label>
                       <Input
                         id="description"
                         placeholder="Optional description"
                         value={newExpense.description}
                         onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                         className="rounded-xl"
                       />
                     </div>
                  </TabsContent>

                  <TabsContent value="mileage" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="miles">Miles Driven</Label>
                      <Input
                        id="miles"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newExpense.miles}
                        onChange={(e) => setNewExpense({...newExpense, miles: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costPerMile">Cost per Mile ($)</Label>
                      <Input
                        id="costPerMile"
                        type="number"
                        step="0.001"
                        value={newExpense.costPerMile}
                        onChange={(e) => setNewExpense({...newExpense, costPerMile: e.target.value})}
                        className="rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">
                        Standard IRS rate: $0.545/mile
                      </p>
                    </div>

                    {newExpense.miles && newExpense.costPerMile && (
                      <div className="bg-accent p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Calculator className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Calculated Amount</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          ${(parseFloat(newExpense.miles) * parseFloat(newExpense.costPerMile)).toFixed(2)}
                        </p>
                      </div>
                    )}

                     <div className="space-y-2">
                       <Label htmlFor="mileage-date">Date</Label>
                       <Popover>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             className={cn(
                               "w-full justify-start text-left font-normal rounded-xl",
                               !selectedDate && "text-muted-foreground"
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                             mode="single"
                             selected={selectedDate}
                             onSelect={(date) => date && setSelectedDate(date)}
                             initialFocus
                             className="p-3 pointer-events-auto"
                           />
                         </PopoverContent>
                       </Popover>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="mileage-description">Description</Label>
                       <Input
                         id="mileage-description"
                         placeholder="Trip purpose"
                         value={newExpense.description}
                         onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                         className="rounded-xl"
                       />
                     </div>
                  </TabsContent>

                  <Button 
                    onClick={handleAddExpense}
                    className="w-full bg-gradient-primary hover:opacity-90 rounded-xl"
                  >
                    Add Expense
                  </Button>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Total</p>
              <p className="text-lg sm:text-xl font-bold text-white">${totalToday.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Categories</p>
              <p className="text-lg sm:text-xl font-bold text-white">{new Set(filteredExpenses.map(e => e.category)).size}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Entries</p>
              <p className="text-lg sm:text-xl font-bold text-white">{filteredExpenses.length}</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 -mt-4">
        {/* Date Filter */}
        <GradientCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h3 className="font-semibold text-base sm:text-lg">Filter by Date Range</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full sm:w-auto text-sm",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} -{" "}
                        {format(dateRange.to, "MMM dd, y")}
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
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </GradientCard>

        {filteredExpenses.length === 0 ? (
          <GradientCard className="text-center py-8">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No expenses recorded</h3>
            <p className="text-muted-foreground mb-4">Start tracking your business expenses</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Expense
                </Button>
              </DialogTrigger>
            </Dialog>
          </GradientCard>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredExpenses.map((expense) => (
              <GradientCard key={expense.id} className="hover:shadow-soft transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-warning/20 rounded-full flex items-center justify-center text-warning">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <span className="font-medium text-xs sm:text-sm bg-accent text-accent-foreground px-2 py-1 rounded-lg">
                        {expense.category}
                      </span>
                      {expense.type === "mileage" && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Auto-calculated
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium">{expense.description}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                        <span>{formatTime(expense.date)}</span>
                        {expense.type === "mileage" && expense.miles && (
                          <span>{expense.miles} miles @ ${expense.costPerMile}/mi</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <p className="text-lg sm:text-xl font-bold text-warning">
                      -${expense.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
};

export default Expenses;