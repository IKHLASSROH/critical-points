"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ContourData, CriticalPoint } from "@/lib/types";
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

interface ContourTabProps {
  contourData: ContourData | null;
  criticalPoints: CriticalPoint[];
  functionStr: string;
}

export function ContourTab({
  contourData,
  criticalPoints,
  functionStr,
}: ContourTabProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [contourData]);

  if (!contourData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No contour data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPointColor = (type: CriticalPoint["type"]) => {
    switch (type) {
      case "minimum":
        return "#22c55e";
      case "maximum":
        return "#ef4444";
      case "saddle":
        return "#f97316";
      default:
        return "#6b7280";
    }
  };

  const getPointSymbol = (type: CriticalPoint["type"]) => {
    switch (type) {
      case "minimum":
        return "circle";
      case "maximum":
        return "star";
      case "saddle":
        return "diamond";
      default:
        return "x";
    }
  };

  const traces: Plotly.Data[] = [
    {
      type: "contour",
      x: contourData.x,
      y: contourData.y,
      z: contourData.z,
      colorscale: [
        [0, "rgb(68, 1, 84)"],
        [0.25, "rgb(59, 82, 139)"],
        [0.5, "rgb(33, 145, 140)"],
        [0.75, "rgb(94, 201, 98)"],
        [1, "rgb(253, 231, 37)"],
      ],
      contours: {
        coloring: "heatmap",
        showlabels: true,
        labelfont: {
          size: 10,
          color: "white",
        },
      },
      colorbar: {
        title: "f(x, y)",
        titleside: "right",
        titlefont: { size: 12 },
      },
      hovertemplate: "x: %{x:.3f}<br>y: %{y:.3f}<br>f(x,y): %{z:.3f}<extra></extra>",
    } as Plotly.Data,
  ];

  // Add critical points
  if (criticalPoints.length > 0) {
    traces.push({
      type: "scatter",
      mode: "markers",
      x: criticalPoints.map((cp) => cp.x),
      y: criticalPoints.map((cp) => cp.y),
      marker: {
        size: 14,
        color: criticalPoints.map((cp) => getPointColor(cp.type)),
        symbol: criticalPoints.map((cp) => getPointSymbol(cp.type)),
        line: {
          color: "#fff",
          width: 2,
        },
      },
      text: criticalPoints.map(
        (cp) => `${cp.type.toUpperCase()}<br>(${cp.x}, ${cp.y})<br>f = ${cp.fValue}`
      ),
      hoverinfo: "text",
      name: "Critical Points",
    } as Plotly.Data);
  }

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: `Contour Plot: f(x, y) = ${functionStr}`,
      font: { size: 16, color: "#888" },
    },
    autosize: true,
    height: 500,
    margin: { l: 60, r: 80, t: 60, b: 60 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    xaxis: {
      title: "x",
      gridcolor: "rgba(128, 128, 128, 0.2)",
      zerolinecolor: "rgba(128, 128, 128, 0.4)",
    },
    yaxis: {
      title: "y",
      gridcolor: "rgba(128, 128, 128, 0.2)",
      zerolinecolor: "rgba(128, 128, 128, 0.4)",
      scaleanchor: "x",
      scaleratio: 1,
    },
    showlegend: false,
  };

  const config: Partial<Plotly.Config> = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2D Contour Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-lg overflow-hidden bg-muted/30">
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
          <CardTitle className="text-lg">Understanding Contour Maps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A contour map shows level curves - lines where the function has constant
            value. These curves help visualize the shape of the surface from above.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-medium mb-2">Critical Point Markers</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white" />
                  <span className="text-sm">Circle = Local Minimum</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 16 16" className="w-4 h-4">
                    <path
                      d="M8 1l2.5 5 5.5 1-4 4 1 5.5-5-2.5-5 2.5 1-5.5-4-4 5.5-1z"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                  <span className="text-sm">Star = Local Maximum</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#f97316] rotate-45 border-2 border-white" />
                  <span className="text-sm">Diamond = Saddle Point</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-medium mb-2">Reading the Map</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Closely spaced contours = steep gradient</li>
                <li>Widely spaced contours = gentle slope</li>
                <li>Closed loops around minima/maxima</li>
                <li>X-shaped patterns near saddle points</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
