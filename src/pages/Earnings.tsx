import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Plus, Car, MapPin, Clock, DollarSign } from "lucide-react";

interface Earning {
  id: string;
  amount: number;
  source: string;
  location: string;
  date: Date;
  duration?: number;
}

const Earnings = () => {
  const [earnings, setEarnings] = useState<Earning[]>([
    {
      id: "1",
      amount: 45.50,
      source: "Uber",
      location: "Airport to Downtown",
      date: new Date(),
      duration: 35
    },
    {
      id: "2", 
      amount: 28.75,
      source: "Lyft",
      location: "Mall to Residential",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 22
    },
    {
      id: "3",
      amount: 52.20,
      source: "Uber",
      location: "City Center to University",
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      duration: 40
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEarning, setNewEarning] = useState({
    amount: "",
    source: "",
    location: "",
    duration: ""
  });

  const totalToday = earnings
    .filter(earning => earning.date.toDateString() === new Date().toDateString())
    .reduce((sum, earning) => sum + earning.amount, 0);

  const handleAddEarning = () => {
    if (newEarning.amount && newEarning.source && newEarning.location) {
      const earning: Earning = {
        id: Date.now().toString(),
        amount: parseFloat(newEarning.amount),
        source: newEarning.source,
        location: newEarning.location,
        date: new Date(),
        duration: newEarning.duration ? parseInt(newEarning.duration) : undefined
      };
      
      setEarnings([earning, ...earnings]);
      setNewEarning({ amount: "", source: "", location: "", duration: "" });
      setIsDialogOpen(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Earnings</h1>
            <p className="opacity-90">Track your daily income</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add New Earning</DialogTitle>
                <DialogDescription>
                  Record a new trip or earning entry
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newEarning.amount}
                    onChange={(e) => setNewEarning({...newEarning, amount: e.target.value})}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={newEarning.source} onValueChange={(value) => setNewEarning({...newEarning, source: value})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uber">Uber</SelectItem>
                      <SelectItem value="Lyft">Lyft</SelectItem>
                      <SelectItem value="DoorDash">DoorDash</SelectItem>
                      <SelectItem value="UberEats">Uber Eats</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Trip Description</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Airport to Downtown"
                    value={newEarning.location}
                    onChange={(e) => setNewEarning({...newEarning, location: e.target.value})}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Optional"
                    value={newEarning.duration}
                    onChange={(e) => setNewEarning({...newEarning, duration: e.target.value})}
                    className="rounded-xl"
                  />
                </div>

                <Button 
                  onClick={handleAddEarning}
                  className="w-full bg-gradient-primary hover:opacity-90 rounded-xl"
                >
                  Add Earning
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Total */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Today's Total</p>
              <p className="text-2xl font-bold text-white">${totalToday.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-white/60" />
          </div>
        </GradientCard>
      </div>

      <div className="p-6 space-y-4">
        {earnings.length === 0 ? (
          <GradientCard className="text-center py-8">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No earnings yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking your trips and earnings</p>
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
          <div className="space-y-3">
            {earnings.map((earning) => (
              <GradientCard key={earning.id} className="hover:shadow-soft transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-success" />
                      </div>
                      <span className="font-medium text-sm bg-accent text-accent-foreground px-2 py-1 rounded-lg">
                        {earning.source}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {earning.location}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(earning.date)}
                        </div>
                        {earning.duration && (
                          <span>{earning.duration} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-success">
                      ${earning.amount.toFixed(2)}
                    </p>
                    {earning.duration && (
                      <p className="text-xs text-muted-foreground">
                        ${(earning.amount / earning.duration * 60).toFixed(2)}/hr
                      </p>
                    )}
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

export default Earnings;