"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getInitials, daysSince } from "@/lib/utils";
import { RELATIONSHIP_COLORS, RELATIONSHIP_LABELS } from "@/types";
import type { PersonWithInsight, RelationshipType } from "@/types";
import type { PersonConnection } from "@/lib/mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SimNode {
  id: string;
  name: string;
  initials: string;
  group: string;
  closenessScore: number;
  trendDirection: string;
  lastSeen: number | null;
  isUser: boolean;
  // d3 fields
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}

interface SimLink {
  source: SimNode | string;
  target: SimNode | string;
  strength: number;
  isUserLink: boolean;
  label?: string;
  connType?: string;
}

interface TooltipState {
  x: number;
  y: number;
  node: SimNode;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Group cluster centres (relative to SVG centre = 0,0)
const CLUSTER_POSITIONS: Record<string, { x: number; y: number }> = {
  friend:    { x: -220, y: -160 },
  family:    { x:  200, y: -160 },
  romantic:  { x: -240, y:   60 },
  coworker:  { x:  220, y:   80 },
  mentor:    { x:    0, y:  200 },
};

const GROUP_LABELS: Record<string, string> = {
  friend:   "Friends",
  family:   "Family",
  romantic: "Romantic",
  coworker: "Work",
  mentor:   "Mentors",
};

// Slightly more saturated / distinct from chart colours for dark SVG backgrounds
const CLUSTER_FILL: Record<string, string> = {
  friend:   RELATIONSHIP_COLORS.friend,
  family:   RELATIONSHIP_COLORS.family,
  romantic: RELATIONSHIP_COLORS.romantic,
  coworker: RELATIONSHIP_COLORS.coworker,
  mentor:   RELATIONSHIP_COLORS.mentor,
  other:    RELATIONSHIP_COLORS.other,
};

// Colors for peer-to-peer connection types
const CONN_COLORS: Record<string, string> = {
  friend:       "#3b82f6",
  colleague:    "#f59e0b",
  mentor:       "#10b981",
  family:       "#8b5cf6",
  acquaintance: "#64748b",
};

const USER_COLOR = "#6366f1";

// ── Component ─────────────────────────────────────────────────────────────────

interface RelationshipGraphProps {
  people: PersonWithInsight[];
  connections: PersonConnection[];
  currentUser: { id: string; name: string; avatarUrl: string };
}

export function RelationshipGraph({
  people,
  connections,
  currentUser,
}: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const tooltipRef = useRef<TooltipState | null>(null);

  const navigate = useCallback((id: string) => router.push(`/people/${id}`), [router]);

  useEffect(() => {
    if (!svgRef.current) return;
    let cancelled = false;

    import("d3").then((d3) => {
      if (cancelled || !svgRef.current) return;

      // ── Data preparation ───────────────────────────────────────────────────
      const svgEl = svgRef.current;
      const W = svgEl.clientWidth || 800;
      const H = svgEl.clientHeight || 600;

      const userNode: SimNode = {
        id: "user",
        name: currentUser.name,
        initials: getInitials(currentUser.name),
        group: "user",
        closenessScore: 100,
        trendDirection: "steady",
        lastSeen: 0,
        isUser: true,
        fx: 0,
        fy: 0,
      };

      const simNodes: SimNode[] = [
        userNode,
        ...people.map((p) => ({
          id: p.id,
          name: p.name,
          initials: getInitials(p.name),
          group: p.relationshipType,
          closenessScore: p.relationshipInsight?.closenessScore ?? 20,
          trendDirection: p.relationshipInsight?.trendDirection ?? "steady",
          lastSeen: daysSince(p.relationshipInsight?.lastInteractionDate ?? null),
          isUser: false,
        })),
      ];

      // User → person edges
      const userLinks: SimLink[] = people.map((p) => ({
        source: "user",
        target: p.id,
        strength: p.relationshipInsight?.closenessScore ?? 20,
        isUserLink: true,
      }));

      // Person → person edges
      const peerLinks: SimLink[] = connections.map((c) => ({
        source: c.sourceId,
        target: c.targetId,
        strength: c.strength,
        isUserLink: false,
        label: c.label,
        connType: c.type,
      }));

      const simLinks: SimLink[] = [...userLinks, ...peerLinks];

      // ── SVG setup ─────────────────────────────────────────────────────────
      const svg = d3.select(svgEl);
      svg.selectAll("*").remove();
      svg.attr("viewBox", `0 0 ${W} ${H}`);

      // Defs: blur filter for halos, glow for user
      const defs = svg.append("defs");

      defs.append("filter").attr("id", "halo-blur").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%")
        .append("feGaussianBlur").attr("stdDeviation", "28");

      const glow = defs.append("filter").attr("id", "node-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
      glow.append("feGaussianBlur").attr("stdDeviation", "5").attr("result", "blur");
      const merge = glow.append("feMerge");
      merge.append("feMergeNode").attr("in", "blur");
      merge.append("feMergeNode").attr("in", "SourceGraphic");

      // Per-type diamond marker for peer edges (placed at midpoint)
      Object.entries(CONN_COLORS).forEach(([type, col]) => {
        defs.append("marker")
          .attr("id", `diamond-${type}`)
          .attr("viewBox", "-4 -4 8 8")
          .attr("refX", "0").attr("refY", "0")
          .attr("markerWidth", "5").attr("markerHeight", "5")
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-3 L3,0 L0,3 L-3,0 Z")
          .attr("fill", col)
          .attr("opacity", "0.75");
      });

      // ── Zoom / pan container ───────────────────────────────────────────────
      const rootG = svg.append("g").attr("class", "root");

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.25, 3])
        .on("zoom", (e) => rootG.attr("transform", e.transform));

      svg.call(zoom).on("dblclick.zoom", null);

      // Initial transform: centre + slight zoom-out
      svg.call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.85));

      // ── Layer groups ──────────────────────────────────────────────────────
      const halosG  = rootG.append("g").attr("class", "halos");
      const labelsG = rootG.append("g").attr("class", "group-labels");
      const linksG  = rootG.append("g").attr("class", "links");
      const nodesG  = rootG.append("g").attr("class", "nodes");

      // ── Static group halos + labels ───────────────────────────────────────
      const presentGroups = Array.from(new Set(people.map((p) => p.relationshipType as string)));

      presentGroups.forEach((group) => {
        const pos = CLUSTER_POSITIONS[group];
        const col = CLUSTER_FILL[group] ?? "#888";
        if (!pos) return;

        // Soft glow halo
        halosG.append("circle")
          .attr("class", `halo halo-${group}`)
          .attr("cx", pos.x).attr("cy", pos.y)
          .attr("r", 110)
          .attr("fill", col)
          .attr("opacity", 0.09)
          .attr("filter", "url(#halo-blur)");

        // Group label
        labelsG.append("text")
          .attr("class", `group-label label-${group}`)
          .attr("x", pos.x).attr("y", pos.y - 115)
          .attr("text-anchor", "middle")
          .attr("font-size", "10")
          .attr("font-weight", "700")
          .attr("letter-spacing", "0.12em")
          .attr("fill", col)
          .attr("opacity", "0.55")
          .text(GROUP_LABELS[group]?.toUpperCase() ?? group.toUpperCase());
      });

      // ── Links ─────────────────────────────────────────────────────────────
      // Sub-layers so peer curves render below user lines
      const peerLinksG = linksG.append("g").attr("class", "peer-links");
      const userLinksG = linksG.append("g").attr("class", "user-links");

      // User → person: solid colored lines
      const userLinkEls = userLinksG.selectAll<SVGLineElement, SimLink>("line")
        .data(userLinks)
        .join("line")
        .attr("stroke", (d) => {
          const tgt = d.target as SimNode;
          return CLUSTER_FILL[tgt.group] ?? "#888";
        })
        .attr("stroke-width", (d) => Math.max(1.5, (d.strength / 100) * 5))
        .attr("stroke-opacity", (d) => 0.35 + (d.strength / 100) * 0.55)
        .attr("stroke-dasharray", (d) => {
          const tgt = d.target as SimNode;
          return tgt.trendDirection === "down" ? "7 4" : null;
        });

      // Person ↔ person: colored bezier curves
      const peerPathEls = peerLinksG.selectAll<SVGPathElement, SimLink>("path")
        .data(peerLinks)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", (d) => CONN_COLORS[d.connType ?? "acquaintance"] ?? "#888")
        .attr("stroke-width", (d) => Math.max(1.8, (d.strength / 100) * 4))
        .attr("stroke-opacity", (d) => 0.45 + (d.strength / 100) * 0.4)
        .attr("stroke-dasharray", "8 5")
        .attr("stroke-linecap", "round");


      // ── Nodes ─────────────────────────────────────────────────────────────
      const nodeGs = nodesG.selectAll<SVGGElement, SimNode>("g.node")
        .data(simNodes)
        .join("g")
        .attr("class", "node")
        .style("cursor", (d) => d.isUser ? "default" : "pointer");

      // ─ User node ─
      const userG = nodeGs.filter((d) => d.isUser);

      userG.append("circle").attr("r", 36)
        .attr("fill", USER_COLOR).attr("opacity", 0.12);
      userG.append("circle").attr("r", 28)
        .attr("fill", USER_COLOR).attr("filter", "url(#node-glow)");
      userG.append("circle").attr("r", 28)
        .attr("fill", "none").attr("stroke", "white").attr("stroke-width", "2").attr("stroke-opacity", "0.4");
      userG.append("text")
        .attr("text-anchor", "middle").attr("dy", "0.35em")
        .attr("font-size", "11").attr("font-weight", "800").attr("fill", "white")
        .text("YOU");
      userG.append("text")
        .attr("text-anchor", "middle").attr("dy", "3.2em")
        .attr("font-size", "11").attr("font-weight", "600").attr("fill", "#374151")
        .text((d) => d.name.split(" ")[0]);

      // ─ Person nodes ─
      const personGs = nodeGs.filter((d) => !d.isUser);

      // Outer glow ring (closeness indicator)
      personGs.append("circle")
        .attr("r", (d) => 19 + (d.closenessScore / 100) * 10)
        .attr("fill", (d) => CLUSTER_FILL[d.group] ?? "#888")
        .attr("fill-opacity", 0.12)
        .attr("stroke", (d) => CLUSTER_FILL[d.group] ?? "#888")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", (d) => 0.25 + (d.closenessScore / 100) * 0.65);

      // Inner filled circle
      personGs.append("circle")
        .attr("r", (d) => 15 + (d.closenessScore / 100) * 7)
        .attr("fill", (d) => CLUSTER_FILL[d.group] ?? "#888");

      // Initials
      personGs.append("text")
        .attr("text-anchor", "middle").attr("dy", "0.35em")
        .attr("font-size", "9").attr("font-weight", "700").attr("fill", "white")
        .text((d) => d.initials);

      // Name label
      personGs.append("text")
        .attr("class", "name-label")
        .attr("text-anchor", "middle")
        .attr("dy", (d) => `${3.0 + (d.closenessScore / 100) * 1.2}em`)
        .attr("font-size", "10.5").attr("font-weight", "600").attr("fill", "#374151")
        .text((d) => d.name.split(" ")[0]);

      // Trend arrow
      personGs.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", (d) => `${4.4 + (d.closenessScore / 100) * 1.2}em`)
        .attr("font-size", "8")
        .attr("fill", (d) => d.trendDirection === "up" ? "#10b981" : d.trendDirection === "down" ? "#ef4444" : "#9ca3af")
        .text((d) => d.trendDirection === "up" ? "▲ growing" : d.trendDirection === "down" ? "▼ fading" : "— steady");

      // ── Interactions ──────────────────────────────────────────────────────
      // Hover tooltip
      personGs
        .on("mouseenter", function (event: MouseEvent, d: SimNode) {
          d3.select(this).select("circle:nth-child(2)")
            .transition().duration(150)
            .attr("r", (15 + (d.closenessScore / 100) * 7) * 1.18);
          const tip: TooltipState = { x: event.clientX, y: event.clientY, node: d };
          tooltipRef.current = tip;
          setTooltip({ ...tip });
        })
        .on("mousemove", function (event: MouseEvent) {
          if (tooltipRef.current) {
            const tip = { ...tooltipRef.current, x: event.clientX, y: event.clientY };
            tooltipRef.current = tip;
            setTooltip({ ...tip });
          }
        })
        .on("mouseleave", function (_event: MouseEvent, d: SimNode) {
          d3.select(this).select("circle:nth-child(2)")
            .transition().duration(150)
            .attr("r", 15 + (d.closenessScore / 100) * 7);
          tooltipRef.current = null;
          setTooltip(null);
        })
        .on("click", (_event: MouseEvent, d: SimNode) => {
          navigate(d.id);
        });

      // ── Drag ──────────────────────────────────────────────────────────────
      const drag = d3.drag<SVGGElement, SimNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x ?? 0;
          d.fy = d.y ?? 0;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (!d.isUser) { d.fx = null; d.fy = null; }
        });

      nodeGs.call(drag as d3.DragBehavior<SVGGElement, SimNode, SimNode | d3.SubjectPosition>);

      // ── Force simulation ──────────────────────────────────────────────────
      const simulation = d3.forceSimulation<SimNode>(simNodes)
        .force(
          "link",
          d3.forceLink<SimNode, SimLink>(simLinks)
            .id((d) => d.id)
            .distance((d) => d.isUserLink ? 130 : 90)
            .strength((d) => d.isUserLink ? 0.7 : 0.25)
        )
        .force("charge", d3.forceManyBody<SimNode>().strength(-260))
        .force("collide", d3.forceCollide<SimNode>().radius((d) => (d.isUser ? 45 : 35 + (d.closenessScore / 100) * 12)).strength(0.85))
        .force("cluster", (alpha: number) => {
          simNodes.forEach((node) => {
            if (node.isUser) return;
            const center = CLUSTER_POSITIONS[node.group];
            if (!center || node.x == null || node.y == null) return;
            node.vx = (node.vx ?? 0) + (center.x - node.x) * 0.1 * alpha;
            node.vy = (node.vy ?? 0) + (center.y - node.y) * 0.1 * alpha;
          });
        })
        .alphaDecay(0.025);

      // Helper: compute quadratic bezier path + midpoint for a peer link
      function peerCurve(d: SimLink): string {
        const s = d.source as SimNode;
        const t = d.target as SimNode;
        const sx = s.x ?? 0, sy = s.y ?? 0;
        const tx = t.x ?? 0, ty = t.y ?? 0;
        const dx = tx - sx, dy = ty - sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const bend = Math.min(55, len * 0.28);
        const cx = (sx + tx) / 2 - (dy / len) * bend;
        const cy = (sy + ty) / 2 + (dx / len) * bend;
        return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
      }

      // Tick: update positions
      simulation.on("tick", () => {
        // User → person lines
        userLinkEls
          .attr("x1", (d) => (d.source as SimNode).x ?? 0)
          .attr("y1", (d) => (d.source as SimNode).y ?? 0)
          .attr("x2", (d) => (d.target as SimNode).x ?? 0)
          .attr("y2", (d) => (d.target as SimNode).y ?? 0);

        // Peer curves
        peerPathEls.attr("d", (d) => peerCurve(d));

        nodeGs.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

        // Drift halos toward actual cluster average
        presentGroups.forEach((group) => {
          const inGroup = simNodes.filter((n) => n.group === group);
          if (inGroup.length === 0) return;
          const cx = inGroup.reduce((s, n) => s + (n.x ?? 0), 0) / inGroup.length;
          const cy = inGroup.reduce((s, n) => s + (n.y ?? 0), 0) / inGroup.length;
          halosG.select(`.halo-${group}`).attr("cx", cx).attr("cy", cy);
          labelsG.select(`.label-${group}`).attr("x", cx).attr("y", cy - 115);
        });
      });

      // Cleanup
      return () => simulation.stop();
    });

    return () => { cancelled = true; };
  }, [people, connections, currentUser, navigate]);

  return (
    <div className="relative w-full" style={{ height: 580 }}>
      {/* SVG graph */}
      <svg
        ref={svgRef}
        className="w-full h-full rounded-xl border bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
      />

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl shadow-xl p-3 min-w-[160px] text-xs">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CLUSTER_FILL[tooltip.node.group] ?? "#888" }}
              />
              <span className="font-semibold text-sm">{tooltip.node.name}</span>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex justify-between gap-4">
                <span>Type</span>
                <span className="font-medium text-foreground capitalize">
                  {RELATIONSHIP_LABELS[tooltip.node.group as RelationshipType] ?? tooltip.node.group}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Closeness</span>
                <span className="font-medium text-foreground">{Math.round(tooltip.node.closenessScore)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Last seen</span>
                <span className="font-medium text-foreground">
                  {tooltip.node.lastSeen === null ? "—" : tooltip.node.lastSeen === 0 ? "Today" : `${tooltip.node.lastSeen}d ago`}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Trend</span>
                <span
                  className="font-medium"
                  style={{ color: tooltip.node.trendDirection === "up" ? "#10b981" : tooltip.node.trendDirection === "down" ? "#ef4444" : "#9ca3af" }}
                >
                  {tooltip.node.trendDirection === "up" ? "↑ Growing" : tooltip.node.trendDirection === "down" ? "↓ Fading" : "→ Steady"}
                </span>
              </div>
            </div>
            <p className="mt-2 pt-2 border-t text-muted-foreground italic">Click to open profile →</p>
          </div>
        </div>
      )}
    </div>
  );
}
