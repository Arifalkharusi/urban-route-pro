import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Plus, Car, Clock, DollarSign, Users, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface Earning {
  id: string;
  amount: number;
  platform: string;
  trips: number;
  hours: number;
  date: string;
}

const Earnings = () => {
  const { toast } = useToast();
  const [earnings, setEarnings] = useState<Earning[]>([
    { id: "1", amount: 145.50, platform: "Uber", trips: 8, hours: 6.5, date: "2024-01-15" },
    { id: "2", amount: 123.75, platform: "Bolt", trips: 6, hours: 5.0, date: "2024-01-15" },
    { id: "3", amount: 167.25, platform: "Uber", trips: 10, hours: 7.5, date: "2024-01-14" },
    { id: "4", amount: 89.00, platform: "Bolt", trips: 5, hours: 4.0, date: "2024-01-14" },
    { id: "5", amount: 200.00, platform: "Lyft", trips: 12, hours: 8.0, date: "2024-01-13" },
  ]);
  
  const [customPlatforms, setCustomPlatforms] = useState<string[]>(["Lyft"]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [formData, setFormData] = useState({
    amount: "",
    platform: "",
    customPlatform: "",
    trips: "",
    hours: "",
    date: new Date().toISOString().split('T')[0]
  });

  const defaultPlatforms = ["Uber", "Bolt"];
  const allPlatforms = [...defaultPlatforms, ...customPlatforms];

  const handleAddEarning = () => {
    if (!formData.amount || !formData.platform || !formData.trips || !formData.hours) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    let selectedPlatform = formData.platform;
    
    // Handle custom platform
    if (formData.platform === "custom" && formData.customPlatform) {
      selectedPlatform = formData.customPlatform;
      if (!customPlatforms.includes(formData.customPlatform)) {
        setCustomPlatforms([...customPlatforms, formData.customPlatform]);
      }
    }

    const newEarning: Earning = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      platform: selectedPlatform,
      trips: parseInt(formData.trips),
      hours: parseFloat(formData.hours),
      date: formData.date
    };

    setEarnings([newEarning, ...earnings]);
    setFormData({
      amount: "",
      platform: "",
      customPlatform: "",
      trips: "",
      hours: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Earning added successfully",
    });
  };

  // Filter earnings by date range
  const filteredEarnings = earnings.filter(earning => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const earningDate = new Date(earning.date);
    return earningDate >= dateRange.from && earningDate <= dateRange.to;
  });

  // Group filtered earnings by platform
  const groupedEarnings = filteredEarnings.reduce((acc, earning) => {
    if (!acc[earning.platform]) {
      acc[earning.platform] = [];
    }
    acc[earning.platform].push(earning);
    return acc;
  }, {} as Record<string, Earning[]>);

  const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'uber': return 'bg-black text-white';
      case 'bolt': return 'bg-green-500 text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Earnings</h1>
            <p className="opacity-90 text-sm sm:text-base mt-1">Track your income by platform</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Earnings Overview */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white">Earnings Overview</h2>
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
              <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-lg sm:text-xl">Add New Earning</DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Record earnings for a shift
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="platform" className="text-sm font-medium">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                      <SelectTrigger className="rounded-xl h-12 text-base">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg max-h-60">
                        {allPlatforms.map((platform) => (
                          <SelectItem key={platform} value={platform} className="text-base py-3">{platform}</SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-base py-3">Add Custom Platform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.platform === "custom" && (
                    <div className="space-y-3">
                      <Label htmlFor="customPlatform" className="text-sm font-medium">Custom Platform Name</Label>
                      <Input
                        id="customPlatform"
                        value={formData.customPlatform}
                        onChange={(e) => setFormData({...formData, customPlatform: e.target.value})}
                        placeholder="e.g., Local Taxi Company"
                        className="rounded-xl h-12 text-base"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-medium">Total Earning ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      className="rounded-xl h-12 text-base"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="trips" className="text-sm font-medium">Number of Trips</Label>
                      <Input
                        id="trips"
                        type="number"
                        value={formData.trips}
                        onChange={(e) => setFormData({...formData, trips: e.target.value})}
                        placeholder="0"
                        className="rounded-xl h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="hours" className="text-sm font-medium">Hours Worked</Label>
                      <Input
                        id="hours"
                        type="number"
                        step="0.5"
                        value={formData.hours}
                        onChange={(e) => setFormData({...formData, hours: e.target.value})}
                        placeholder="0.0"
                        className="rounded-xl h-12 text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="rounded-xl h-12 text-base"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddEarning}
                    className="w-full bg-gradient-primary hover:opacity-90 rounded-xl h-12 text-base font-medium mt-6"
                  >
                    Add Earning
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Total</p>
              <p className="text-lg sm:text-xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Platforms</p>
              <p className="text-lg sm:text-xl font-bold text-white">{Object.keys(groupedEarnings).length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Entries</p>
              <p className="text-lg sm:text-xl font-bold text-white">{filteredEarnings.length}</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
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
        {filteredEarnings.length === 0 ? (
          <GradientCard className="text-center py-8">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No earnings yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking your platform earnings</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Earning
                </Button>
              </DialogTrigger>
            </Dialog>
          </GradientCard>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEarnings).map(([platform, platformEarnings]) => {
              const platformTotal = platformEarnings.reduce((sum, earning) => sum + earning.amount, 0);
              const totalTrips = platformEarnings.reduce((sum, earning) => sum + earning.trips, 0);
              const totalHours = platformEarnings.reduce((sum, earning) => sum + earning.hours, 0);
              
              return (
                <div key={platform} className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Badge className={getPlatformColor(platform)}>
                        {platform}
                      </Badge>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        ${platformTotal.toFixed(2)} total
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        {totalTrips} trips
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {totalHours.toFixed(1)}h
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-2">
                    {platformEarnings.map((earning) => (
                      <GradientCard key={earning.id} className="hover:shadow-soft transition-shadow">
                        <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
                          {/* Mobile: Top Section with Date and Amount */}
                          <div className="flex justify-between items-start sm:hidden">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(earning.date).toLocaleDateString()}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-success">
                                ${earning.amount.toFixed(2)}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-success">
                                <TrendingUp className="w-3 h-3" />
                                ${(earning.amount / earning.hours).toFixed(2)}/hr
                              </div>
                            </div>
                          </div>

                          {/* Mobile: Bottom Section with Stats */}
                          <div className="grid grid-cols-3 gap-3 sm:hidden">
                            <div className="bg-muted/20 rounded-lg p-2 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Users className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <p className="text-xs font-medium">{earning.trips}</p>
                              <p className="text-xs text-muted-foreground">trips</p>
                            </div>
                            <div className="bg-muted/20 rounded-lg p-2 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <p className="text-xs font-medium">{earning.hours}h</p>
                              <p className="text-xs text-muted-foreground">hours</p>
                            </div>
                            <div className="bg-success/10 rounded-lg p-2 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <DollarSign className="w-3 h-3 text-success" />
                              </div>
                              <p className="text-xs font-medium text-success">${(earning.amount / earning.trips).toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">per trip</p>
                            </div>
                          </div>

                          {/* Desktop: Original Layout */}
                          <div className="hidden sm:flex sm:flex-1 sm:space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(earning.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{earning.trips} trips</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{earning.hours}h</span>
                              </div>
                              <div className="text-muted-foreground">
                                ${(earning.amount / earning.trips).toFixed(2)}/trip
                              </div>
                            </div>
                          </div>

                          {/* Desktop: Amount Display */}
                          <div className="hidden sm:block sm:text-right">
                            <p className="text-xl font-bold text-success">
                              ${earning.amount.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-success">
                              <TrendingUp className="w-3 h-3" />
                              ${(earning.amount / earning.hours).toFixed(2)}/hr
                            </div>
                          </div>
                        </div>
                      </GradientCard>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
};

export default Earnings;