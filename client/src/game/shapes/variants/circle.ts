import { ServerCircle } from "@/game/comm/types/shapes";
import { GlobalPoint, Vector } from "@/game/geom";
import { Shape } from "@/game/shapes/shape";
import { BoundingRect } from "@/game/shapes/variants/boundingrect";
import { calculateDelta } from "@/game/ui/tools/utils";
import { clampGridLine, g2lz } from "@/game/units";
import { getFogColour } from "@/game/utils";
import { DEFAULT_GRID_SIZE } from "../../store";
import { SHAPE_TYPE } from "../types";

export class Circle extends Shape {
    type: SHAPE_TYPE = "circle";
    r: number;
    constructor(
        center: GlobalPoint,
        r: number,
        options?: { fillColour?: string; strokeColour?: string; uuid?: string },
    ) {
        super(center, options);
        this.r = r || 1;
    }

    asDict(): ServerCircle {
        // const base = <ServerCircle>this.getBaseDict();
        // base.r = this.r;
        // base.border = this.border;
        // return base;
        return Object.assign(this.getBaseDict(), {
            radius: this.r,
        });
    }

    fromDict(data: ServerCircle): void {
        super.fromDict(data);
        this.r = data.radius;
    }

    getBoundingBox(): BoundingRect {
        return new BoundingRect(
            new GlobalPoint(this.refPoint.x - this.r, this.refPoint.y - this.r),
            this.r * 2,
            this.r * 2,
        );
    }

    get points(): number[][] {
        return this.getBoundingBox().points;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        ctx.beginPath();
        if (this.fillColour === "fog") ctx.fillStyle = getFogColour();
        else ctx.fillStyle = this.fillColour;
        ctx.arc(0, 0, g2lz(this.r), 0, 2 * Math.PI);
        ctx.fill();
        if (this.strokeColour !== "rgba(0, 0, 0, 0)") {
            const borderWidth = 5;
            ctx.beginPath();
            ctx.lineWidth = g2lz(borderWidth);
            ctx.strokeStyle = this.strokeColour;
            // Inset the border with - borderWidth / 2
            ctx.arc(0, 0, Math.max(borderWidth / 2, g2lz(this.r - borderWidth / 2)), 0, 2 * Math.PI);
            ctx.stroke();
        }
        super.drawPost(ctx);
    }
    contains(point: GlobalPoint): boolean {
        return (point.x - this.refPoint.x) ** 2 + (point.y - this.refPoint.y) ** 2 < this.r ** 2;
    }
    center(): GlobalPoint;
    center(centerPoint: GlobalPoint): void;
    center(centerPoint?: GlobalPoint): GlobalPoint | void {
        if (centerPoint === undefined) return this.refPoint;
        this.refPoint = centerPoint;
    }
    visibleInCanvas(canvas: HTMLCanvasElement): boolean {
        if (super.visibleInCanvas(canvas)) return true;
        return this.getBoundingBox().visibleInCanvas(canvas);
    }
    snapToGrid(): void {
        const gs = DEFAULT_GRID_SIZE;
        let targetX;
        let targetY;
        if (((2 * this.r) / gs) % 2 === 0) {
            targetX = clampGridLine(this.refPoint.x);
        } else {
            targetX = Math.round((this.refPoint.x - gs / 2) / gs) * gs + this.r;
        }
        if (((2 * this.r) / gs) % 2 === 0) {
            targetY = clampGridLine(this.refPoint.y);
        } else {
            targetY = Math.round((this.refPoint.y - gs / 2) / gs) * gs + this.r;
        }
        const delta = calculateDelta(new Vector(targetX - this.refPoint.x, targetY - this.refPoint.y), this);
        this.refPoint = this.refPoint.add(delta);
        this.invalidate(false);
    }
    resizeToGrid(): void {
        const gs = DEFAULT_GRID_SIZE;
        this.r = Math.max(clampGridLine(this.r), gs / 2);
        this.invalidate(false);
    }
    resize(resizePoint: number, point: GlobalPoint): number {
        const diff = point.subtract(this.refPoint);
        this.r = Math.sqrt(Math.pow(diff.length(), 2) / 2);
        return resizePoint;
    }
}
