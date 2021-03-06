import { Tracker, Label } from "../../shapes/interfaces";
import { ShapeOwner, ShapeAccess } from "../../shapes/owners";
import { SHAPE_TYPE } from "../../shapes/types";

export interface ServerShape {
    uuid: string;
    type_: SHAPE_TYPE;
    x: number;
    y: number;
    angle: number;
    floor: string;
    layer: string;
    movement_obstruction: boolean;
    vision_obstruction: boolean;
    draw_operator: string;
    trackers: Tracker[];
    auras: ServerAura[];
    labels: Label[];
    owners: ServerShapeOwner[];
    fill_colour: string;
    stroke_colour: string;
    stroke_width: number;
    name: string;
    name_visible: boolean;
    annotation: string;
    is_token: boolean;
    is_invisible: boolean;
    options?: string;
    badge: number;
    show_badge: boolean;
    is_locked: boolean;
    default_edit_access: boolean;
    default_movement_access: boolean;
    default_vision_access: boolean;
    asset?: number;
}

export interface ServerShapeAccess {
    edit_access: boolean;
    movement_access: boolean;
    vision_access: boolean;
}

export interface ServerShapeOwner extends ServerShapeAccess {
    shape: string;
    user: string;
}

export interface ServerRect extends ServerShape {
    width: number;
    height: number;
}

export interface ServerCircle extends ServerShape {
    radius: number;
}

export interface ServerCircularToken extends ServerCircle {
    text: string;
    font: string;
}

export interface ServerLine extends ServerShape {
    x2: number;
    y2: number;
    line_width: number;
}
export interface ServerPolygon extends ServerShape {
    vertices: number[][];
    open_polygon: boolean;
    line_width: number;
}
export interface ServerText extends ServerShape {
    text: string;
    font: string;
    angle: number;
}
export interface ServerAsset extends ServerRect {
    src: string;
}

export interface ServerTracker {
    shape: string;
    uuid: string;
    visible: boolean;
    name: string;
    value: number;
    maxvalue: number;
}

export interface ServerAura {
    shape: string;
    uuid: string;
    vision_source: boolean;
    visible: boolean;
    name: string;
    value: number;
    dim: number;
    colour: string;
}

export const accessToServer = (access: ShapeAccess): ServerShapeAccess => ({
    edit_access: access.edit || false,
    movement_access: access.movement || false,
    vision_access: access.vision || false,
});

export const ownerToServer = (owner: ShapeOwner): ServerShapeOwner => ({
    user: owner.user,
    shape: owner.shape,
    ...accessToServer(owner.access),
});

export const accessToClient = (access: ServerShapeAccess): ShapeAccess => ({
    edit: access.edit_access,
    movement: access.movement_access,
    vision: access.vision_access,
});

export const ownerToClient = (owner: ServerShapeOwner): ShapeOwner => ({
    user: owner.user,
    shape: owner.shape,
    access: accessToClient(owner),
});
