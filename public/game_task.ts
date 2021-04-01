import { Point } from "./point.js";

export enum MapLocation {
    Cafeteria = "Cafeteria",
    MedBay = "MedBay",
    UpperEngine = "Upper Engine",
    Reactor = "Reactor",
    Security = "Security",
    LowerEngine = "Lower Engine",
    Electrical = "Electrical",
    Storage = "Storage",
    Communications = "Communications",
    Shields = "Shields",
    Navigation = "Navigation",
    O2 = "O2",
    Weapons = "Weapons",
    Admin = "Admin",
}
export class GameTask {
    id: string;
    getName: (task: GameTask) => string;
    noCompleted: number;
    stages: MapLocation[];

    constructor(id: string, getName: (task: GameTask) => string, noCompleted: number, stages: MapLocation[]) {
        this.id = id;
        this.getName = getName;
        this.noCompleted = noCompleted;
        this.stages = stages;
    }
}
