import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./Card";
import { FileText, Image, Settings, Calendar } from "lucide-react";

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
}

function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const quickActions = [
    { label: "View Bookings", icon: Calendar, page: "bookings", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Edit Content", icon: FileText, page: "content", color: "text-[#C9A24D]", bg: "bg-[#fdf7ef]" },
    { label: "Manage Gallery", icon: Image, page: "images", color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Settings", icon: Settings, page: "settings", color: "text-gray-600", bg: "bg-gray-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-2xl font-display text-[#2c1a0a]">Welcome back, Susan</h1>
          <p className="text-muted-foreground">Manage your website, bookings, and content from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} hover>
              <button 
                onClick={() => onNavigate(action.page)}
                className="w-full text-left"
              >
                <CardContent className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${action.bg} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${action.color}`} />
                  </div>
                  <div>
                    <h2 className="text-foreground font-medium">{action.label}</h2>
                    <p className="text-xs text-muted-foreground">Go to {action.page}</p>
                  </div>
                </CardContent>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardHome;
