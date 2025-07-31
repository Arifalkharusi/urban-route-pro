import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Search, Plane, Train, Bus, Calendar, MapPin, Clock, Users } from "lucide-react";

interface CityEvent {
  id: string;
  title: string;
  type: "flight" | "train" | "bus" | "event";
  time: string;
  location: string;
  details: string;
  passengers?: number;
  terminal?: string;
}

const CityInfo = () => {
  const [searchCity, setSearchCity] = useState("San Francisco");
  const [activeTab, setActiveTab] = useState("flights");

  // Mock data - in a real app, this would come from APIs
  const cityData: Record<string, CityEvent[]> = {
    flights: [
      {
        id: "1",
        title: "AA 1234 - New York",
        type: "flight",
        time: "14:30",
        location: "SFO Terminal 2",
        details: "Arrival from JFK",
        passengers: 180,
        terminal: "Terminal 2"
      },
      {
        id: "2",
        title: "UA 567 - Los Angeles",
        type: "flight",
        time: "15:45",
        location: "SFO Terminal 3",
        details: "Arrival from LAX",
        passengers: 150,
        terminal: "Terminal 3"
      },
      {
        id: "3",
        title: "DL 890 - Seattle",
        type: "flight",
        time: "16:20",
        location: "SFO Terminal 1",
        details: "Arrival from SEA",
        passengers: 120,
        terminal: "Terminal 1"
      }
    ],
    trains: [
      {
        id: "4",
        title: "Caltrain 152",
        type: "train",
        time: "14:15",
        location: "4th & King Station",
        details: "From San Jose",
        passengers: 200
      },
      {
        id: "5",
        title: "BART - Richmond",
        type: "train",
        time: "14:42",
        location: "Embarcadero Station",
        details: "East Bay service",
        passengers: 300
      }
    ],
    buses: [
      {
        id: "6",
        title: "Greyhound 1458",
        type: "bus",
        time: "15:30",
        location: "Transbay Terminal",
        details: "From Sacramento",
        passengers: 50
      },
      {
        id: "7",
        title: "Megabus 123",
        type: "bus",
        time: "16:00",
        location: "Caltrain Station",
        details: "From Los Angeles",
        passengers: 45
      }
    ],
    events: [
      {
        id: "8",
        title: "Giants vs Dodgers",
        type: "event",
        time: "19:05",
        location: "Oracle Park",
        details: "MLB Game - High demand expected",
        passengers: 41000
      },
      {
        id: "9",
        title: "Tech Conference 2024",
        type: "event",
        time: "09:00",
        location: "Moscone Center",
        details: "Day 2 of 3-day event",
        passengers: 5000
      }
    ]
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="w-4 h-4" />;
      case "train":
        return <Train className="w-4 h-4" />;
      case "bus":
        return <Bus className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "train":
        return "bg-green-100 text-green-800";
      case "bus":
        return "bg-yellow-100 text-yellow-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const tabData = [
    { id: "flights", label: "Flights", icon: Plane, data: cityData.flights },
    { id: "trains", label: "Trains", icon: Train, data: cityData.trains },
    { id: "buses", label: "Buses", icon: Bus, data: cityData.buses },
    { id: "events", label: "Events", icon: Calendar, data: cityData.events },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">City Info</h1>
            <p className="opacity-90">Track arrivals and events</p>
          </div>

          {/* City Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              placeholder="Search city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
            />
          </div>

          {/* Current City */}
          <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Current Location</p>
                <p className="text-xl font-bold text-white">{searchCity}</p>
              </div>
              <MapPin className="w-6 h-6 text-white/60" />
            </div>
          </GradientCard>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {tabData.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex flex-col gap-1 py-3"
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-xs">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabData.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              {tab.data.length === 0 ? (
                <GradientCard className="text-center py-8">
                  <tab.icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No {tab.label.toLowerCase()} found</h3>
                  <p className="text-muted-foreground">
                    No {tab.label.toLowerCase()} scheduled for {searchCity} today
                  </p>
                </GradientCard>
              ) : (
                <div className="space-y-3">
                  {tab.data.map((item) => (
                    <GradientCard key={item.id} className="hover:shadow-soft transition-shadow">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getTypeColor(item.type)}>
                                {getIcon(item.type)}
                                <span className="ml-1 capitalize">{item.type}</span>
                              </Badge>
                              {item.terminal && (
                                <Badge variant="outline" className="text-xs">
                                  {item.terminal}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.details}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              {formatTime(item.time)}
                            </div>
                          </div>
                        </div>

                        {/* Location and Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{item.location}</span>
                          </div>
                          
                          {item.passengers && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {item.passengers.toLocaleString()} {item.type === "event" ? "attendees" : "passengers"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="pt-2 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full rounded-lg"
                          >
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </GradientCard>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default CityInfo;