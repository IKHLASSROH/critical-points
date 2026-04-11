"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { SurfaceData, CriticalPoint } from "@/lib/types";
import { RotateCcw, Download } from "lucide-react";
import dynamic from "next/dynamic";

// Import Plotly dynamically to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
});

interface Surface3DTabProps {
  surfaceData: SurfaceData | null;
  criticalPoints: CriticalPoint[];
  functionStr: string;
}

export function Surface3DTab({
  surfaceData,
  criticalPoints,
  functionStr,
}: Surface3DTabProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force re-render when surfaceData changes
    setKey((prev) => prev + 1);
  }, [surfaceData]);

  if (!surfaceData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No surface data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPointColor = (type: string) => {
    switch (type) {
      case "minimum":
        return "#22c55e"; // green
      case "maximum":
        return "#ef4444"; // red
      case "saddle":
        return "#f97316"; // orange
      default:
        return "#6b7280"; // gray
    }
  };

  const traces: Plotly.Data[] = [
    {
      type: "surface",
      x: surfaceData.x,
      y: surfaceData.y,
      z: surfaceData.z,
      colorscale: [
        [0, "rgb(68, 1, 84)"],
        [0.25, "rgb(59, 82, 139)"],
        [0.5, "rgb(33, 145, 140)"],
        [0.75, "rgb(94, 201, 98)"],
        [1, "rgb(253, 231, 37)"],
      ],
      contours: {
        z: {
          show: true,
          usecolormap: true,
          highlightcolor: "#fff",
          project: { z: true },
        },
      },
      opacity: 0.9,
      hovertemplate: "x: %{x:.3f}<br>y: %{y:.3f}<br>f(x,y): %{z:.3f}<extra></extra>",
    } as Plotly.Data,
  ];

  // Add critical points as scatter3d
  if (surfaceData.criticalPoints.length > 0) {
    const cpData = surfaceData.criticalPoints;
    
    traces.push({
      type: "scatter3d",
      mode: "markers",
      x: cpData.map((cp) => cp.x),
      y: cpData.map((cp) => cp.y),
      z: cpData.map((cp) => cp.z),
      marker: {
        size: 10,
        color: cpData.map((cp) => getPointColor(cp.type)),
        symbol: "circle",
        line: {
          color: "#fff",
          width: 2,
        },
      },
      hovertemplate: cpData.map(
        (cp) =>
          `<b>${cp.type.toUpperCase()}</b><br>x: ${cp.x.toFixed(3)}<br>y: ${cp.y.toFixed(3)}<br>f(x,y): ${cp.z.toFixed(3)}<extra></extra>`
      ),
      name: "Critical Points",
    } as Plotly.Data);
  }

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: `f(x, y) = ${functionStr}`,
      font: { size: 16, color: "#888" },
    },
    autosize: true,
    height: 500,
    margin: { l: 0, r: 0, t: 40, b: 0 },
    paper_bgcolor: "transparent",
    scene: {
      xaxis: {
        title: "x",
        gridcolor: "rgba(128, 128, 128, 0.3)",
        zerolinecolor: "rgba(128, 128, 128, 0.5)",
      },
      yaxis: {
        title: "y",
        gridcolor: "rgba(128, 128, 128, 0.3)",
        zerolinecolor: "rgba(128, 128, 128, 0.5)",
      },
      zaxis: {
        title: "f(x, y)",
        gridcolor: "rgba(128, 128, 128, 0.3)",
        zerolinecolor: "rgba(128, 128, 128, 0.5)",
      },
      bgcolor: "transparent",
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 },
      },
    },
    showlegend: false,
  };

  const config: Partial<Plotly.Config> = {
    displayModeBar: true,
    modeBarButtonsToRemove: ["toImage", "sendDataToCloud"],
    displaylogo: false,
    responsive: true,
  };

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  const handleDownload = () => {
    const plotElement = plotRef.current?.querySelector(".js-plotly-plot");
    if (plotElement) {
      import("plotly.js-dist-min").then((Plotly) => {
        Plotly.downloadImage(plotElement as HTMLElement, {
          format: "png",
          width: 1200,
          height: 800,
          filename: `surface-${functionStr.replace(/[^a-zA-Z0-9]/g, "_")}`,
        });
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">3D Surface Plot</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset View
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={plotRef} className="w-full rounded-lg overflow-hidden bg-muted/30">
            <Plot
              key={key}
              data={traces}
              layout={layout}
              config={config}
              className="w-full"
              useResizeHandler
              style={{ width: "100%", height: "500px" }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Critical Points Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#22c55e] shadow-sm border border-white/50" />
              <span className="text-sm">Local Minimum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ef4444] shadow-sm border border-white/50" />
              <span className="text-sm">Local Maximum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#f97316] shadow-sm border border-white/50 animate-saddle" />
              <span className="text-sm">Saddle Point</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Drag to rotate, scroll to zoom. Critical points are marked on the surface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
