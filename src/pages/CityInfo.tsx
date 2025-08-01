import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Plane, Train, Bus, Calendar, MapPin, Clock, ChevronDown } from "lucide-react";

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

interface HourlyCount {
  hour: string;
  count: number;
  locations: string[];
  totalPassengers: number;
}

const CityInfo = () => {
  const [searchCity, setSearchCity] = useState("San Francisco");
  const [activeTab, setActiveTab] = useState("flights");

  // Predetermined cities
  const cities = [
    "San Francisco",
    "New York",
    "Los Angeles", 
    "Chicago",
    "Miami",
    "Seattle",
    "Boston",
    "Las Vegas",
    "Denver",
    "Austin"
  ];

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
        time: "14:45",
        location: "SFO Terminal 3",
        details: "Arrival from LAX",
        passengers: 150,
        terminal: "Terminal 3"
      },
      {
        id: "3",
        title: "DL 890 - Seattle",
        type: "flight",
        time: "15:20",
        location: "SFO Terminal 1",
        details: "Arrival from SEA",
        passengers: 120,
        terminal: "Terminal 1"
      },
      {
        id: "4",
        title: "SW 445 - Phoenix",
        type: "flight",
        time: "15:55",
        location: "SFO Terminal 1",
        details: "Arrival from PHX",
        passengers: 140,
        terminal: "Terminal 1"
      },
      {
        id: "5",
        title: "BA 285 - London",
        type: "flight",
        time: "16:10",
        location: "SFO Terminal G",
        details: "Arrival from LHR",
        passengers: 250,
        terminal: "Terminal G"
      },
      {
        id: "6",
        title: "JL 002 - Tokyo",
        type: "flight",
        time: "16:40",
        location: "SFO Terminal G",
        details: "Arrival from NRT",
        passengers: 200,
        terminal: "Terminal G"
      }
    ],
    trains: [
      {
        id: "7",
        title: "Caltrain 152",
        type: "train",
        time: "14:15",
        location: "4th & King Station",
        details: "From San Jose",
        passengers: 200
      },
      {
        id: "8",
        title: "BART - Richmond",
        type: "train",
        time: "14:42",
        location: "Embarcadero Station",
        details: "East Bay service",
        passengers: 300
      },
      {
        id: "9",
        title: "Caltrain 156",
        type: "train",
        time: "15:15",
        location: "4th & King Station",
        details: "From San Jose",
        passengers: 180
      },
      {
        id: "10",
        title: "BART - Fremont",
        type: "train",
        time: "15:48",
        location: "Embarcadero Station",
        details: "South Bay service",
        passengers: 280
      }
    ],
    buses: [
      {
        id: "11",
        title: "Greyhound 1458",
        type: "bus",
        time: "14:30",
        location: "Transbay Terminal",
        details: "From Sacramento",
        passengers: 50
      },
      {
        id: "12",
        title: "Megabus 123",
        type: "bus",
        time: "15:00",
        location: "Caltrain Station",
        details: "From Los Angeles",
        passengers: 45
      },
      {
        id: "13",
        title: "Greyhound 2267",
        type: "bus",
        time: "15:45",
        location: "Transbay Terminal",
        details: "From Portland",
        passengers: 48
      },
      {
        id: "14",
        title: "FlixBus 456",
        type: "bus",
        time: "16:15",
        location: "Transbay Terminal",
        details: "From Seattle",
        passengers: 52
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

  // Function to group transport data by hour
  const groupByHour = (data: CityEvent[]): HourlyCount[] => {
    const hourlyMap = new Map<string, HourlyCount>();

    data.forEach((item) => {
      const hour = item.time.split(':')[0]; // Extract hour from time (e.g., "14" from "14:30")
      const hourRange = `${hour}:00 - ${hour}:59`;
      
      if (!hourlyMap.has(hourRange)) {
        hourlyMap.set(hourRange, {
          hour: hourRange,
          count: 0,
          locations: [],
          totalPassengers: 0
        });
      }

      const existing = hourlyMap.get(hourRange)!;
      existing.count += 1;
      existing.totalPassengers += item.passengers || 0;
      
      // Add unique locations
      const locationShort = item.location.split(' ')[0]; // Get first word of location
      if (!existing.locations.includes(locationShort)) {
        existing.locations.push(locationShort);
      }
    });

    return Array.from(hourlyMap.values()).sort((a, b) => 
      a.hour.localeCompare(b.hour)
    );
  };

  const tabData = [
    { id: "flights", label: "Flights", icon: Plane, data: cityData.flights, isTransport: true },
    { id: "trains", label: "Trains", icon: Train, data: cityData.trains, isTransport: true },
    { id: "buses", label: "Buses", icon: Bus, data: cityData.buses, isTransport: true },
    { id: "events", label: "Events", icon: Calendar, data: cityData.events, isTransport: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="space-y-4">

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Select City</label>
            <Select value={searchCity} onValueChange={setSearchCity}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                <SelectValue placeholder="Choose a city" />
                <ChevronDown className="h-4 w-4 text-white/60" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-[100]">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="cursor-pointer">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        {/* Modern Tab Selectors */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105
                ${activeTab === tab.id 
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                  : 'border-border bg-card hover:border-primary/30 hover:bg-accent/50'
                }
              `}
            >
              {activeTab === tab.id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
                }
              `}>
                <tab.icon className="w-6 h-6" />
              </div>
              <span className={`
                text-sm font-medium transition-colors duration-300
                ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}
              `}>
                {tab.label}
              </span>
              <div className={`
                w-8 h-1 rounded-full transition-all duration-300
                ${activeTab === tab.id ? 'bg-primary' : 'bg-transparent'}
              `} />
            </button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

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
                  {tab.isTransport ? (
                    // Hourly grouped view for transport
                    groupByHour(tab.data).map((hourlyData, index) => (
                      <GradientCard key={index} className="hover:shadow-soft transition-shadow">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getTypeColor(tab.data[0].type)}>
                                  {getIcon(tab.data[0].type)}
                                  <span className="ml-1 capitalize">{tab.label}</span>
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {hourlyData.count} {hourlyData.count === 1 ? 'arrival' : 'arrivals'}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg">{hourlyData.hour}</h3>
                              <p className="text-sm text-muted-foreground">
                                {hourlyData.count} {tab.label.toLowerCase()} arriving this hour
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm font-medium mb-1">
                                <Clock className="w-4 h-4" />
                                {hourlyData.hour.split(' - ')[0]}
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                {hourlyData.count}
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {hourlyData.locations.length === 1 
                                  ? hourlyData.locations[0]
                                  : `${hourlyData.locations.length} locations`
                                }
                              </span>
                            </div>
                            {hourlyData.locations.length > 1 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {hourlyData.locations.map((location, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {location}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </GradientCard>
                    ))
                  ) : (
                    // Individual view for events
                    tab.data.map((item) => (
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
                          </div>
                        </div>
                      </GradientCard>
                    ))
                  )}
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